/* Teacher tools — teacher-side storage (separate IndexedDB, local only).
 *
 * The teacher's device collects students' reports and keeps them here, in a DB
 * that is entirely separate from learner progress (marine-reader). Nothing is
 * sent anywhere. One object store, "classes"; each class groups its students:
 *   { id, code, name, createdAt, students: { studentKey: { name, classCode, addedAt, report } } }
 *
 * Classes are grouped by class code; a teacher-made class without a code is
 * allowed (its id is generated). Re-importing the same student in the same class
 * replaces the older report.
 */

export const DB_NAME = "marine-teacher";
const STORE = "classes";
const NO_CODE = "__nocode__";

const now = () => new Date().toISOString();
const normName = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
const normCode = (s) => String(s || "").trim().toUpperCase().replace(/\s+/g, " ");

export function classIdForCode(code) {
  const c = normCode(code);
  return c ? "code:" + c : null;
}
function genId() {
  return "cls-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---- backends --------------------------------------------------------------
function openIdb(indexedDB) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function idbBackend(db) {
  const tx = (mode) => db.transaction(STORE, mode).objectStore(STORE);
  const p = (req) => new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });
  return {
    getAll: () => p(tx("readonly").getAll()),
    get: (id) => p(tx("readonly").get(id)),
    put: (doc) => p(tx("readwrite").put(doc)),
    del: (id) => p(tx("readwrite").delete(id)),
    clear: () => p(tx("readwrite").clear()),
  };
}
function memoryBackend() {
  const m = new Map();
  return {
    getAll: async () => [...m.values()].map((v) => JSON.parse(JSON.stringify(v))),
    get: async (id) => (m.has(id) ? JSON.parse(JSON.stringify(m.get(id))) : undefined),
    put: async (doc) => { m.set(doc.id, JSON.parse(JSON.stringify(doc))); },
    del: async (id) => { m.delete(id); },
    clear: async () => { m.clear(); },
  };
}

export function createTeacherStore(indexedDB) {
  const idb = indexedDB || (typeof globalThis !== "undefined" ? globalThis.indexedDB : undefined);
  let backend = null;
  const ready = (async () => {
    try {
      if (idb) backend = idbBackend(await openIdb(idb));
      else backend = memoryBackend();
    } catch {
      backend = memoryBackend();
    }
  })();
  const safe = async (fn, fallback) => {
    await ready;
    try { return await fn(backend); } catch { return fallback; }
  };

  return {
    _ready: ready,

    // Upsert a decoded report as a student in its class. Returns { classId, studentName }.
    async addReport(report) {
      if (!report || typeof report !== "object") throw new Error("bad report");
      const name = String(report.n || "").trim() || "Unnamed";
      const code = normCode(report.c);
      const id = classIdForCode(code) || NO_CODE;
      return safe(async (b) => {
        let cls = await b.get(id);
        if (!cls) cls = { id, code: code || "", name: code || (id === NO_CODE ? "No class code" : code), createdAt: now(), students: {} };
        cls.students[normName(name)] = { name, classCode: code || "", addedAt: now(), report };
        await b.put(cls);
        return { classId: id, studentName: name };
      }, { classId: id, studentName: name });
    },

    // Create an empty class without a code (teacher-made).
    async createClass(name) {
      const id = genId();
      const cls = { id, code: "", name: String(name || "Class").trim() || "Class", createdAt: now(), students: {} };
      return safe(async (b) => { await b.put(cls); return cls; }, cls);
    },

    // All classes, students as arrays (sorted by name).
    async listClasses() {
      return safe(async (b) => {
        const all = await b.getAll();
        return all.map((cls) => ({
          ...cls,
          students: Object.values(cls.students || {}).sort((a, z) => a.name.localeCompare(z.name)),
        })).sort((a, z) => (a.name || "").localeCompare(z.name || ""));
      }, []);
    },

    // Flat list of every student across classes.
    async listStudents() {
      const classes = await this.listClasses();
      return classes.flatMap((c) => c.students);
    },

    async deleteStudent(classId, name) {
      return safe(async (b) => {
        const cls = await b.get(classId);
        if (!cls) return false;
        delete cls.students[normName(name)];
        await b.put(cls);
        return true;
      }, false);
    },

    async deleteClass(classId) {
      return safe(async (b) => { await b.del(classId); return true; }, false);
    },

    async exportAll() {
      return safe(async (b) => ({ app: "0697", kind: "teacher-backup", at: now(), classes: await b.getAll() }), { app: "0697", kind: "teacher-backup", at: now(), classes: [] });
    },

    // Merge a backup in (replacing classes/students by id/name).
    async importAll(dump, { replace = false } = {}) {
      return safe(async (b) => {
        if (replace) await b.clear();
        const classes = (dump && dump.classes) || [];
        for (const cls of classes) {
          if (!cls || !cls.id) continue;
          const existing = replace ? null : await b.get(cls.id);
          if (existing) {
            existing.students = { ...existing.students, ...(cls.students || {}) };
            existing.name = existing.name || cls.name;
            await b.put(existing);
          } else {
            await b.put(cls);
          }
        }
        return true;
      }, false);
    },

    async clearAll() {
      return safe(async (b) => { await b.clear(); return true; }, false);
    },
  };
}
