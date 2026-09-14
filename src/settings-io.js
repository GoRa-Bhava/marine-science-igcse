// Pure helpers for the Settings backup/restore feature, kept out of the React
// component so they can be unit-tested and reused.
import { BACKUP_SCHEMA } from "./theme.js";

// Wrap the raw stored progress (a JSON string) into a versioned backup object.
export function makeBackup(storeString) {
  let progress;
  try { progress = JSON.parse(storeString); } catch (e) { progress = {}; }
  return {
    schemaVersion: BACKUP_SCHEMA,
    app: "marine-science-igcse",
    exportedAt: new Date().toISOString(),
    progress,
  };
}

// Parse + validate a backup file's text. Accepts a wrapped backup
// ({schemaVersion, progress}) or a legacy raw progress record (no schemaVersion).
// Returns { ok:true, progress } or { ok:false, error }.
export function readBackup(text) {
  let parsed;
  try { parsed = JSON.parse(text); } catch (e) { return { ok: false, error: "invalid-json" }; }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { ok: false, error: "not-object" };

  let payload = parsed;
  if (parsed.schemaVersion != null) {
    if (typeof parsed.schemaVersion !== "number" || parsed.schemaVersion > BACKUP_SCHEMA) {
      return { ok: false, error: "newer-schema" };
    }
    payload = parsed.progress;
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { ok: false, error: "no-progress" };
  return { ok: true, progress: payload };
}
