/* ProgressStore — device-local, sync-ready persistence for the Units 1–6 Reader.
 *
 * Decisions (locked): IndexedDB now, behind an interface so multi-device sync can
 * be added later; no login. Every persisted record carries `updatedAt` (epoch ms)
 * and a stable `id`; `meta` holds `schemaVersion` and a generated `deviceId`.
 * Ordered `migrations[]` run on load. Every read/write is throw-safe: if storage
 * is unavailable or throws (private mode, cleared data) the app still works, using
 * an in-memory backend for the session.
 *
 * The store is intentionally generic — it persists opaque records keyed by `id`,
 * so it does not depend on the ItemProgress / SectionState field shapes (spec §5).
 *
 * Interface (all async):
 *   ready()
 *   getMeta()
 *   getItemProgress(id) / putItemProgress(rec) / getAllItemProgress()
 *   getBookmark() / putBookmark(rec)
 *   getSectionState(id) / putSectionState(rec) / getAllSectionState()
 *   getSettings() / putSettings(patch)
 *   exportAll() / importAll(dump, opts)
 *   clearAll()
 *   isMemoryFallback  (boolean; true when IndexedDB was unavailable)
 */

export const SCHEMA_VERSION = 1;
export const DB_NAME = "marine-reader";
const STORES = ["items", "sections", "kv"]; // kv holds bookmark / settings / meta by id

const now = () => Date.now();

export function newDeviceId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch (e) { /* ignore */ }
  return "dev-" + Math.random().toString(36).slice(2) + now().toString(36);
}

// Ordered data migrations. Each: { to: <schemaVersion>, migrate(dump) -> dump }.
// `dump` is { meta, items:[], sections:[], kv:{bookmark, settings} }. Baseline is
// empty; add entries here as the shape evolves — never reorder or renumber.
export const MIGRATIONS = [];

/* ------------------------------------------------------------------ backends */
// A backend is the low-level record store: get/put/getAll/delete/clear per store.

class MemoryBackend {
  constructor() { this.m = { items: new Map(), sections: new Map(), kv: new Map() }; this.memory = true; }
  async get(store, id) { return this.m[store].has(id) ? clone(this.m[store].get(id)) : null; }
  async put(store, rec) { this.m[store].set(rec.id, clone(rec)); return clone(rec); }
  async getAll(store) { return [...this.m[store].values()].map(clone); }
  async delete(store, id) { this.m[store].delete(id); }
  async clear(store) { this.m[store].clear(); }
}

class IdbBackend {
  constructor(db) { this.db = db; this.memory = false; }
  _tx(store, mode) { return this.db.transaction(store, mode).objectStore(store); }
  get(store, id) {
    return new Promise((res, rej) => { const r = this._tx(store, "readonly").get(id); r.onsuccess = () => res(r.result ?? null); r.onerror = () => rej(r.error); });
  }
  put(store, rec) {
    return new Promise((res, rej) => { const r = this._tx(store, "readwrite").put(rec); r.onsuccess = () => res(rec); r.onerror = () => rej(r.error); });
  }
  getAll(store) {
    return new Promise((res, rej) => { const r = this._tx(store, "readonly").getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => rej(r.error); });
  }
  delete(store, id) {
    return new Promise((res, rej) => { const r = this._tx(store, "readwrite").delete(id); r.onsuccess = () => res(); r.onerror = () => rej(r.error); });
  }
  clear(store) {
    return new Promise((res, rej) => { const r = this._tx(store, "readwrite").clear(); r.onsuccess = () => res(); r.onerror = () => rej(r.error); });
  }
}

function openIdb(indexedDB) {
  return new Promise((res, rej) => {
    let req;
    try { req = indexedDB.open(DB_NAME, 1); } catch (e) { return rej(e); }
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: "id" });
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
    req.onblocked = () => rej(new Error("idb blocked"));
  });
}

function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

/* -------------------------------------------------------------------- store */

class ProgressStore {
  constructor(backend, migrations = MIGRATIONS) {
    this.backend = backend;
    this.migrations = migrations;
    this.isMemoryFallback = !!backend.memory;
    this._degrade = () => {
      // A backend that throws mid-session: switch to memory so the app keeps working.
      if (!(this.backend instanceof MemoryBackend)) { this.backend = new MemoryBackend(); this.isMemoryFallback = true; }
    };
    this._ready = this._init();
  }

  async _safe(fn, fallback) {
    try { return await fn(); }
    catch (e) { try { console.warn("[ProgressStore] op failed, degrading to memory:", e?.message || e); } catch (_) {} this._degrade(); return fallback; }
  }

  async _init() {
    try {
      let meta = await this.backend.get("kv", "meta");
      if (!meta) {
        meta = { id: "meta", schemaVersion: 0, deviceId: newDeviceId(), createdAt: now(), updatedAt: now() };
      }
      if ((meta.schemaVersion || 0) < SCHEMA_VERSION) {
        await this._runMigrations(meta);
        meta.schemaVersion = SCHEMA_VERSION;
        meta.updatedAt = now();
        await this.backend.put("kv", meta);
      }
      this.meta = meta;
    } catch (e) {
      this._degrade();
      this.meta = { id: "meta", schemaVersion: SCHEMA_VERSION, deviceId: newDeviceId(), createdAt: now(), updatedAt: now() };
      try { await this.backend.put("kv", this.meta); } catch (_) {}
    }
  }

  async _runMigrations(meta) {
    const from = meta.schemaVersion || 0;
    const pending = this.migrations.filter((m) => m.to > from).sort((a, b) => a.to - b.to);
    if (!pending.length) return;
    let dump = await this._rawDump();
    for (const m of pending) dump = m.migrate(dump) || dump;
    await this._writeDump(dump);
  }

  async _rawDump() {
    return {
      meta: await this.backend.get("kv", "meta"),
      items: await this.backend.getAll("items"),
      sections: await this.backend.getAll("sections"),
      bookmark: await this.backend.get("kv", "bookmark"),
      settings: await this.backend.get("kv", "settings"),
    };
  }

  async _writeDump(dump) {
    for (const s of STORES) await this.backend.clear(s);
    for (const it of dump.items || []) await this.backend.put("items", it);
    for (const se of dump.sections || []) await this.backend.put("sections", se);
    if (dump.bookmark) await this.backend.put("kv", { ...dump.bookmark, id: "bookmark" });
    if (dump.settings) await this.backend.put("kv", { ...dump.settings, id: "settings" });
  }

  ready() { return this._ready; }
  async getMeta() { await this._ready; return this.meta; }

  // ---- item progress ----
  async getItemProgress(id) { await this._ready; return this._safe(() => this.backend.get("items", id), null); }
  async putItemProgress(rec) {
    await this._ready;
    // ItemProgress is keyed by itemId (spec §2); the store keeps a stable `id`.
    const id = rec.id ?? rec.itemId;
    const out = { ...rec, id, itemId: rec.itemId ?? id, updatedAt: now() };
    return this._safe(async () => { await this.backend.put("items", out); return out; }, out);
  }
  async getAllItemProgress() { await this._ready; return this._safe(() => this.backend.getAll("items"), []); }

  // ---- bookmark ----
  async getBookmark() { await this._ready; return this._safe(() => this.backend.get("kv", "bookmark"), null); }
  async putBookmark(rec) {
    await this._ready;
    const out = { ...rec, id: "bookmark", updatedAt: now() };
    return this._safe(async () => { await this.backend.put("kv", out); return out; }, out);
  }

  // ---- section state ----
  async getSectionState(id) { await this._ready; return this._safe(() => this.backend.get("sections", id), null); }
  async putSectionState(rec) {
    await this._ready;
    // SectionState is keyed by sectionId (spec §2).
    const id = rec.id ?? rec.sectionId;
    const out = { ...rec, id, sectionId: rec.sectionId ?? id, updatedAt: now() };
    return this._safe(async () => { await this.backend.put("sections", out); return out; }, out);
  }
  async getAllSectionState() { await this._ready; return this._safe(() => this.backend.getAll("sections"), []); }

  // ---- settings (merged patch) ----
  async getSettings() { await this._ready; return this._safe(async () => (await this.backend.get("kv", "settings")) || { id: "settings" }, { id: "settings" }); }
  async putSettings(patch) {
    await this._ready;
    const cur = (await this.getSettings()) || { id: "settings" };
    const out = { ...cur, ...patch, id: "settings", updatedAt: now() };
    return this._safe(async () => { await this.backend.put("kv", out); return out; }, out);
  }

  // ---- export / import ----
  async exportAll() {
    await this._ready;
    return this._safe(async () => ({
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now(),
      meta: await this.backend.get("kv", "meta"),
      items: await this.backend.getAll("items"),
      sections: await this.backend.getAll("sections"),
      bookmark: await this.backend.get("kv", "bookmark"),
      settings: await this.backend.get("kv", "settings"),
    }), { schemaVersion: SCHEMA_VERSION, exportedAt: now(), meta: this.meta, items: [], sections: [], bookmark: null, settings: null });
  }

  // Merge by default (last-write-wins per record via updatedAt). replace: wipe first.
  async importAll(dump, { merge = true } = {}) {
    await this._ready;
    return this._safe(async () => {
      if (!dump || typeof dump !== "object") return { imported: 0 };
      let imported = 0;
      if (!merge) for (const s of STORES) { await this.backend.clear(s); }
      const mergeRec = async (store, rec) => {
        if (!rec || rec.id == null) return;
        if (merge) {
          const ex = await this.backend.get(store, rec.id);
          if (ex && (ex.updatedAt || 0) >= (rec.updatedAt || 0)) return; // keep newer local
        }
        await this.backend.put(store, rec); imported++;
      };
      for (const it of dump.items || []) await mergeRec("items", it);
      for (const se of dump.sections || []) await mergeRec("sections", se);
      if (dump.bookmark) await mergeRec("kv", { ...dump.bookmark, id: "bookmark" });
      if (dump.settings) await mergeRec("kv", { ...dump.settings, id: "settings" });
      return { imported };
    }, { imported: 0 });
  }

  async clearAll() {
    await this._ready;
    return this._safe(async () => {
      for (const s of STORES) await this.backend.clear(s);
      this.meta = { id: "meta", schemaVersion: SCHEMA_VERSION, deviceId: newDeviceId(), createdAt: now(), updatedAt: now() };
      await this.backend.put("kv", this.meta);
    }, undefined);
  }
}

/* ------------------------------------------------------------------ factory */

// Build a store, choosing IndexedDB when available and falling back to memory
// (private mode, no IDB, or open failure) so the app always works.
export async function createProgressStore({ indexedDB: idb, migrations } = {}) {
  const g = typeof globalThis !== "undefined" ? globalThis : {};
  const IDB = idb || g.indexedDB || null;
  if (IDB) {
    try {
      const db = await openIdb(IDB);
      const store = new ProgressStore(new IdbBackend(db), migrations);
      await store.ready();
      return store;
    } catch (e) {
      try { console.warn("[ProgressStore] IndexedDB unavailable, using memory:", e?.message || e); } catch (_) {}
    }
  }
  const store = new ProgressStore(new MemoryBackend(), migrations);
  await store.ready();
  return store;
}

// Exposed for tests / explicit in-memory use.
export function createMemoryStore({ migrations } = {}) {
  return new ProgressStore(new MemoryBackend(), migrations);
}

export { ProgressStore, MemoryBackend, IdbBackend };
