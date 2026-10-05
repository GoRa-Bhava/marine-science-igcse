/* ProgressStore — device-local, sync-ready persistence for the Units 1–6 Reader.
 *
 * Decisions (locked): IndexedDB now, behind an interface so multi-device sync can
 * be added later; no login. Every persisted record carries `updatedAt` (epoch ms)
 * and a stable `id`; `meta` holds `schemaVersion` and a generated `deviceId`.
 * Ordered `migrations[]` run on load. Every read/write is throw-safe: if storage
 * is unavailable or throws (private mode, cleared data) the app still works, using
 * an in-memory backend for the session.
 *
 * Local learner profiles (schema v2): the device holds 1–N profiles, each with
 * fully isolated progress. One profile is ACTIVE at a time; every per-profile
 * read/write is namespaced to it via a composite key `${profileId}::${id}`, so
 * the public API shape is unchanged — callers still pass/return the logical
 * itemId/sectionId. Device-level data (theme lives in localStorage; the licence
 * `entitlement` lives in `deviceSettings`) is shared across a device's profiles.
 *
 * Interface (all async unless noted):
 *   ready() / getMeta()
 *   getItemProgress(id) / putItemProgress(rec) / getAllItemProgress()
 *   deleteItemProgress(id) / deleteItemProgressMany(ids) / deleteSectionState(id)
 *   getBookmark() / putBookmark(rec) / getBookmarks() / putBookmarks(rec)
 *   getSectionState(id) / putSectionState(rec) / getAllSectionState()
 *   getSettings() / putSettings(patch)                 // PER-PROFILE
 *   getDeviceSettings() / putDeviceSettings(patch)     // device-level (entitlement…)
 *   listProfiles() / getActiveProfileId() / getActiveProfile() / setActiveProfile(id)
 *   createProfile(name,color?) / renameProfile(id,patch) / deleteProfile(id) / resetProfile(id)
 *   exportAll() / importAll(dump, opts) / clearAll()
 *   isMemoryFallback  (boolean)
 */

export const SCHEMA_VERSION = 2;
export const DB_NAME = "marine-reader";
const STORES = ["items", "sections", "kv"]; // kv holds bookmark(s)/settings/profiles/deviceSettings/meta by id
export const DEFAULT_PROFILE_COLOR = "#4FD8C4";
export const PROFILE_COLORS = ["#4FD8C4", "#F3C34E", "#FF7A5C", "#7FB8AE", "#F0A63C", "#9A8CFF"];

const now = () => Date.now();
const keyOf = (pid, id) => `${pid}::${id}`;
const stripPid = (compositeId) => { const i = String(compositeId).indexOf("::"); return i >= 0 ? compositeId.slice(i + 2) : compositeId; };

export function newDeviceId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch (e) { /* ignore */ }
  return "dev-" + Math.random().toString(36).slice(2) + now().toString(36);
}

/* Ordered data migrations. Each: { to: <schemaVersion>, migrate(dump) -> dump }.
   `dump` is { meta, items:[], sections:[], kv:[] } — kv is every kv record by id.
   Baseline is empty; add entries here as the shape evolves — never reorder/renumber. */
export const MIGRATIONS = [
  {
    // v1 → v2: introduce local learner profiles. Fold all existing (single-learner)
    // data into a default "Me" profile by namespacing every per-profile record, and
    // split device-level settings (entitlement) out of the old per-learner settings.
    // Idempotent-safe and lossless: existing users keep everything as their first profile.
    to: 2,
    migrate: (dump) => {
      const t = now();
      const kv = dump.kv || [];
      const byId = {}; for (const r of kv) if (r && r.id != null) byId[r.id] = r;
      // If a profiles record already exists (re-run safety), keep it; else make one.
      let profiles = byId.profiles;
      let pid;
      if (profiles && Array.isArray(profiles.list) && profiles.list.length) {
        pid = profiles.activeId || profiles.list[0].id;
      } else {
        pid = newDeviceId();
        profiles = { id: "profiles", list: [{ id: pid, name: "Me", color: DEFAULT_PROFILE_COLOR, createdAt: t, updatedAt: t }], activeId: pid, updatedAt: t };
      }
      const hasPrefix = (id) => String(id).includes("::");
      dump.items = (dump.items || []).map((r) => hasPrefix(r.id) ? r : ({ ...r, id: keyOf(pid, r.itemId ?? r.id), itemId: r.itemId ?? r.id, profileId: pid }));
      dump.sections = (dump.sections || []).map((r) => hasPrefix(r.id) ? r : ({ ...r, id: keyOf(pid, r.sectionId ?? r.id), sectionId: r.sectionId ?? r.id, profileId: pid }));
      const old = byId.settings || {};
      const psettings = { id: keyOf("psettings", pid), examDate: old.examDate ?? null, creatures: old.creatures || [], nudgeToSmartPractice: old.nudgeToSmartPractice, updatedAt: t };
      const deviceSettings = byId.deviceSettings || { id: "deviceSettings", entitlement: old.entitlement, lastActiveAt: t, updatedAt: t };
      const newKv = [];
      for (const r of kv) {
        if (!r || r.id == null) continue;
        if (r.id === "settings" || r.id === "profiles" || r.id === "deviceSettings") continue; // replaced below
        if (r.id === "bookmark") { newKv.push({ ...r, id: keyOf("bookmark", pid) }); continue; }
        if (r.id === "bookmarks") { newKv.push({ ...r, id: keyOf("bookmarks", pid) }); continue; }
        newKv.push(r); // meta and anything already namespaced
      }
      newKv.push(profiles, deviceSettings, psettings);
      dump.kv = newKv;
      return dump;
    },
  },
];

/* ------------------------------------------------------------------ backends */
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
    this.activeId = null;
    this._degrade = () => {
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
      if (!meta) meta = { id: "meta", schemaVersion: 0, deviceId: newDeviceId(), createdAt: now(), updatedAt: now() };
      if ((meta.schemaVersion || 0) < SCHEMA_VERSION) {
        await this._runMigrations(meta);
        meta.schemaVersion = SCHEMA_VERSION;
        meta.updatedAt = now();
        await this.backend.put("kv", meta);
      }
      this.meta = meta;
      await this._ensureProfiles();
    } catch (e) {
      this._degrade();
      this.meta = { id: "meta", schemaVersion: SCHEMA_VERSION, deviceId: newDeviceId(), createdAt: now(), updatedAt: now() };
      try { await this.backend.put("kv", this.meta); } catch (_) {}
      try { await this._ensureProfiles(); } catch (_) { this.activeId = "p-fallback"; }
    }
  }

  // There is always ≥1 profile; load it (or seed a default) and set the active id.
  async _ensureProfiles() {
    let p = await this.backend.get("kv", "profiles");
    if (!p || !Array.isArray(p.list) || !p.list.length) {
      const pid = newDeviceId();
      p = { id: "profiles", list: [{ id: pid, name: "Me", color: DEFAULT_PROFILE_COLOR, createdAt: now(), updatedAt: now() }], activeId: pid, updatedAt: now() };
      await this.backend.put("kv", p);
    }
    if (!p.activeId || !p.list.some((x) => x.id === p.activeId)) { p.activeId = p.list[0].id; await this.backend.put("kv", p); }
    this._profiles = p;
    this.activeId = p.activeId;
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
      kv: await this.backend.getAll("kv"),
    };
  }

  async _writeDump(dump) {
    for (const s of STORES) await this.backend.clear(s);
    for (const it of dump.items || []) await this.backend.put("items", it);
    for (const se of dump.sections || []) await this.backend.put("sections", se);
    for (const rec of dump.kv || []) if (rec && rec.id != null) await this.backend.put("kv", rec);
  }

  ready() { return this._ready; }
  async getMeta() { await this._ready; return this.meta; }
  _pid() { return this.activeId; }

  // ---- item progress (namespaced to the active profile) ----
  async getItemProgress(id) {
    await this._ready;
    return this._safe(async () => { const r = await this.backend.get("items", keyOf(this._pid(), id)); return r ? { ...r, id } : null; }, null);
  }
  async putItemProgress(rec) {
    await this._ready;
    const logical = rec.itemId ?? rec.id;
    const out = { ...rec, id: keyOf(this._pid(), logical), itemId: logical, profileId: this._pid(), updatedAt: now() };
    return this._safe(async () => { await this.backend.put("items", out); return { ...out, id: logical }; }, { ...out, id: logical });
  }
  async getAllItemProgress() {
    await this._ready;
    const pre = keyOf(this._pid(), "");
    return this._safe(async () => (await this.backend.getAll("items")).filter((r) => String(r.id).startsWith(pre)).map((r) => ({ ...r, id: r.itemId ?? stripPid(r.id) })), []);
  }
  async deleteItemProgress(id) {
    await this._ready;
    return this._safe(async () => { await this.backend.delete("items", keyOf(this._pid(), id)); }, undefined);
  }
  async deleteItemProgressMany(ids = []) {
    await this._ready;
    return this._safe(async () => { for (const id of ids) await this.backend.delete("items", keyOf(this._pid(), id)); }, undefined);
  }
  // FUTURE-SYNC: a raw delete is NOT reconcilable — once a sync backend lands, a
  // reset here could be resurrected by an older record from another device. When
  // sync lands, resets must write a *tombstoned* zeroed record (box:0, timesSeen:0,
  // timesCorrect:0, timesWrong:0, wrongFlag:false, lastResult:null, fresh updatedAt)
  // rather than a hard delete. No sync backend today (clearAll has the same
  // property), so a raw delete is fine for now. Do not build tombstones yet.
  async deleteSectionState(id) {
    await this._ready;
    return this._safe(async () => { await this.backend.delete("sections", keyOf(this._pid(), id)); }, undefined);
  }

  // ---- bookmark (per profile) ----
  async getBookmark() {
    await this._ready;
    return this._safe(async () => { const r = await this.backend.get("kv", keyOf("bookmark", this._pid())); return r ? { ...r, id: "bookmark" } : null; }, null);
  }
  async putBookmark(rec) {
    await this._ready;
    const out = { ...rec, id: keyOf("bookmark", this._pid()), updatedAt: now() };
    return this._safe(async () => { await this.backend.put("kv", out); return { ...out, id: "bookmark" }; }, { ...out, id: "bookmark" });
  }

  // ---- per-unit bookmarks (per profile) ----
  async getBookmarks() {
    await this._ready;
    return this._safe(async () => { const r = await this.backend.get("kv", keyOf("bookmarks", this._pid())); return r ? { ...r, id: "bookmarks" } : null; }, null);
  }
  async putBookmarks(rec) {
    await this._ready;
    const out = { ...rec, id: keyOf("bookmarks", this._pid()), updatedAt: now() };
    return this._safe(async () => { await this.backend.put("kv", out); return { ...out, id: "bookmarks" }; }, { ...out, id: "bookmarks" });
  }

  // ---- section state (per profile) ----
  async getSectionState(id) {
    await this._ready;
    return this._safe(async () => { const r = await this.backend.get("sections", keyOf(this._pid(), id)); return r ? { ...r, id } : null; }, null);
  }
  async putSectionState(rec) {
    await this._ready;
    const logical = rec.sectionId ?? rec.id;
    const out = { ...rec, id: keyOf(this._pid(), logical), sectionId: logical, profileId: this._pid(), updatedAt: now() };
    return this._safe(async () => { await this.backend.put("sections", out); return { ...out, id: logical }; }, { ...out, id: logical });
  }
  async getAllSectionState() {
    await this._ready;
    const pre = keyOf(this._pid(), "");
    return this._safe(async () => (await this.backend.getAll("sections")).filter((r) => String(r.id).startsWith(pre)).map((r) => ({ ...r, id: r.sectionId ?? stripPid(r.id) })), []);
  }

  // ---- per-profile settings (examDate, creatures, nudge) ----
  async getSettings() {
    await this._ready;
    const id = keyOf("psettings", this._pid());
    return this._safe(async () => (await this.backend.get("kv", id)) || { id }, { id: keyOf("psettings", this._pid()) });
  }
  async putSettings(patch) {
    await this._ready;
    const id = keyOf("psettings", this._pid());
    const cur = (await this.getSettings()) || { id };
    const out = { ...cur, ...patch, id, updatedAt: now() };
    return this._safe(async () => { await this.backend.put("kv", out); return out; }, out);
  }

  // ---- spaced-repetition map (Mixed Practice only, per profile) ----
  // Kept entirely separate from ItemProgress/box-ladder: one kv record per
  // profile holding { itemId: fsrsRecord }. Fed only by Mixed-Practice answers.
  async getSRMap() {
    await this._ready;
    const id = keyOf("sr", this._pid());
    return this._safe(async () => ((await this.backend.get("kv", id)) || {}).map || {}, {});
  }
  async putSRMap(map) {
    await this._ready;
    const id = keyOf("sr", this._pid());
    const out = { id, map: map || {}, updatedAt: now() };
    return this._safe(async () => { await this.backend.put("kv", out); return out; }, out);
  }

  // ---- device-level settings (shared across profiles: licence entitlement…) ----
  async getDeviceSettings() {
    await this._ready;
    return this._safe(async () => (await this.backend.get("kv", "deviceSettings")) || { id: "deviceSettings" }, { id: "deviceSettings" });
  }
  async putDeviceSettings(patch) {
    await this._ready;
    const cur = (await this.getDeviceSettings()) || { id: "deviceSettings" };
    const out = { ...cur, ...patch, id: "deviceSettings", updatedAt: now() };
    return this._safe(async () => { await this.backend.put("kv", out); return out; }, out);
  }

  // ---- profiles ----
  async _putProfiles() { this._profiles.updatedAt = now(); await this.backend.put("kv", this._profiles); }
  listProfiles() { return (this._profiles?.list || []).map((p) => ({ ...p })); }
  getActiveProfileId() { return this.activeId; }
  getActiveProfile() { return (this._profiles?.list || []).find((p) => p.id === this.activeId) || null; }

  async setActiveProfile(id) {
    await this._ready;
    return this._safe(async () => {
      if (!this._profiles.list.some((p) => p.id === id)) return this.getActiveProfile();
      this._profiles.activeId = id; this.activeId = id;
      await this._putProfiles();
      return this.getActiveProfile();
    }, this.getActiveProfile());
  }

  // Caller enforces the maxProfiles cap (from the entitlement).
  async createProfile(name, color) {
    await this._ready;
    return this._safe(async () => {
      const list = this._profiles.list;
      const used = new Set(list.map((p) => p.color));
      const pickedColor = color || PROFILE_COLORS.find((c) => !used.has(c)) || DEFAULT_PROFILE_COLOR;
      const prof = { id: newDeviceId(), name: String(name || "Learner").slice(0, 40), color: pickedColor, createdAt: now(), updatedAt: now() };
      list.push(prof);
      await this._putProfiles();
      return { ...prof };
    }, null);
  }

  async renameProfile(id, patch = {}) {
    await this._ready;
    return this._safe(async () => {
      const p = this._profiles.list.find((x) => x.id === id);
      if (!p) return null;
      if (patch.name != null) p.name = String(patch.name).slice(0, 40);
      if (patch.color != null) p.color = patch.color;
      p.updatedAt = now();
      await this._putProfiles();
      return { ...p };
    }, null);
  }

  // Remove every namespaced row for a profile, then its list entry. Never leaves zero
  // profiles: if the last one is removed, a fresh default takes its place.
  async _wipeProfileData(id) {
    const pre = keyOf(id, "");
    for (const store of ["items", "sections"]) {
      const rows = await this.backend.getAll(store);
      for (const r of rows) if (String(r.id).startsWith(pre)) await this.backend.delete(store, r.id);
    }
    for (const k of [keyOf("bookmark", id), keyOf("bookmarks", id), keyOf("psettings", id), keyOf("sr", id)]) await this.backend.delete("kv", k);
  }

  async deleteProfile(id) {
    await this._ready;
    return this._safe(async () => {
      await this._wipeProfileData(id);
      let list = this._profiles.list.filter((p) => p.id !== id);
      if (!list.length) {
        const pid = newDeviceId();
        list = [{ id: pid, name: "Me", color: DEFAULT_PROFILE_COLOR, createdAt: now(), updatedAt: now() }];
        this._profiles.activeId = pid;
      } else if (this._profiles.activeId === id) {
        this._profiles.activeId = list[0].id;
      }
      this._profiles.list = list;
      this.activeId = this._profiles.activeId;
      await this._putProfiles();
      return this.getActiveProfile();
    }, this.getActiveProfile());
  }

  // Reset one learner's PROGRESS (items/sections/resume) but keep the profile itself
  // and its examDate/creatures. Reuses the per-row delete paths.
  async resetProfile(id) {
    await this._ready;
    return this._safe(async () => {
      const pre = keyOf(id, "");
      for (const store of ["items", "sections"]) {
        const rows = await this.backend.getAll(store);
        for (const r of rows) if (String(r.id).startsWith(pre)) await this.backend.delete(store, r.id);
      }
      for (const k of [keyOf("bookmark", id), keyOf("bookmarks", id), keyOf("sr", id)]) await this.backend.delete("kv", k);
    }, undefined);
  }

  // ---- export / import (all profiles) ----
  async exportAll() {
    await this._ready;
    return this._safe(async () => ({
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now(),
      meta: await this.backend.get("kv", "meta"),
      items: await this.backend.getAll("items"),
      sections: await this.backend.getAll("sections"),
      kv: await this.backend.getAll("kv"),
    }), { schemaVersion: SCHEMA_VERSION, exportedAt: now(), meta: this.meta, items: [], sections: [], kv: [] });
  }

  // Merge by default (last-write-wins per record via updatedAt). replace: wipe first.
  async importAll(dump, { merge = true } = {}) {
    await this._ready;
    return this._safe(async () => {
      if (!dump || typeof dump !== "object") return { imported: 0 };
      let imported = 0;
      if (!merge) for (const s of STORES) await this.backend.clear(s);
      const mergeRec = async (store, rec) => {
        if (!rec || rec.id == null) return;
        if (merge) { const ex = await this.backend.get(store, rec.id); if (ex && (ex.updatedAt || 0) >= (rec.updatedAt || 0)) return; }
        await this.backend.put(store, rec); imported++;
      };
      for (const it of dump.items || []) await mergeRec("items", it);
      for (const se of dump.sections || []) await mergeRec("sections", se);
      // kv: new generic shape, plus tolerate the pre-v2 flat keys from an old backup.
      for (const rec of dump.kv || []) await mergeRec("kv", rec);
      if (dump.bookmark) await mergeRec("kv", { ...dump.bookmark, id: dump.bookmark.id || "bookmark" });
      if (dump.bookmarks) await mergeRec("kv", { ...dump.bookmarks, id: dump.bookmarks.id || "bookmarks" });
      if (dump.settings) await mergeRec("kv", { ...dump.settings, id: dump.settings.id || "settings" });
      await this._ensureProfiles(); // adopt imported profiles + active id
      return { imported };
    }, { imported: 0 });
  }

  async clearAll() {
    await this._ready;
    return this._safe(async () => {
      for (const s of STORES) await this.backend.clear(s);
      this.meta = { id: "meta", schemaVersion: SCHEMA_VERSION, deviceId: newDeviceId(), createdAt: now(), updatedAt: now() };
      await this.backend.put("kv", this.meta);
      this._profiles = null; this.activeId = null;
      await this._ensureProfiles(); // start fresh with one default profile
    }, undefined);
  }
}

/* ------------------------------------------------------------------ factory */

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
