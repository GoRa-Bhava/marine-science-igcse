/* Teacher tools — report / assignment / result codec (pure, no network).
 *
 * A student's device turns its progress into a short code that goes ONLY in a
 * URL fragment (#r=…, #a=…, #x=…), so it is never sent to any server. The
 * teacher's device decodes it locally. Nothing here touches the network, storage
 * or any third-party script beyond the bundled pure-JS deflate fallback.
 *
 * Pipeline:  data → JSON (+ 2-byte checksum field `k`) → raw DEFLATE → base64url
 * Prefixes:  report WC1. · assignment WA1. · result WR1.
 *
 * Compression uses the platform CompressionStream("deflate-raw") when present
 * (all evergreen browsers, modern iOS/Android, Node ≥18) and falls back to
 * fflate (pure JS) otherwise. The two are wire-compatible, so a code made on one
 * path decodes on the other.
 */

import { deflateSync, inflateSync, strToU8, strFromU8 } from "fflate";

// family letter + version → prefix. The family lets us tell "newer version"
// (right family, wrong version) from "not one of our codes" (wrong family).
const KINDS = {
  report: { family: "WC", version: 1, prefix: "WC1.", label: "progress" },
  assignment: { family: "WA", version: 1, prefix: "WA1.", label: "assignment" },
  result: { family: "WR", version: 1, prefix: "WR1.", label: "result" },
};

const BASE_URL = "https://app.wildcateducation.co.uk/";
const REPORT_MAX = 1500; // target code length for a full bank, in characters

// ---------- friendly errors ----------
function codeError(message) {
  const e = new Error(message);
  e.name = "CodeError";
  e.friendly = true;
  return e;
}
const ERR_INCOMPLETE = "This code is incomplete or damaged. Ask for it to be sent again.";
const ERR_NEWER = "This code is from a newer version of the app. Please update, then try again.";
const ERR_WRONGKIND = (label) => `This doesn't look like a ${label} code.`;

// ---------- base64url over raw bytes (browser + Node) ----------
function bytesToB64url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(s) {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm.length % 4 === 0 ? "" : "=".repeat(4 - (norm.length % 4));
  const bin = atob(norm + pad); // throws on invalid input → caller maps to ERR_INCOMPLETE
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ---------- raw DEFLATE (prefer platform, fall back to fflate) ----------
async function deflateRaw(bytes) {
  if (typeof CompressionStream === "function") {
    const cs = new CompressionStream("deflate-raw");
    const w = cs.writable.getWriter();
    // Swallow writer-side rejections (the real error, if any, surfaces on read).
    w.write(bytes).catch(() => {});
    w.close().catch(() => {});
    return new Uint8Array(await new Response(cs.readable).arrayBuffer());
  }
  return deflateSync(bytes);
}
async function inflateRaw(bytes) {
  if (typeof DecompressionStream === "function") {
    const ds = new DecompressionStream("deflate-raw");
    const w = ds.writable.getWriter();
    // Swallow writer-side rejections; a bad body surfaces when we read below.
    w.write(bytes).catch(() => {});
    w.close().catch(() => {});
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }
  return inflateSync(bytes);
}

// ---------- 2-byte checksum (Fletcher-16 over the JSON string) ----------
function checksum16(str) {
  let a = 0;
  let b = 0;
  for (let i = 0; i < str.length; i++) {
    a = (a + str.charCodeAt(i)) % 255;
    b = (b + a) % 255;
  }
  return (b << 8) | a;
}

// ---------- generic encode / decode ----------
async function encodeKind(kind, obj) {
  const spec = KINDS[kind];
  const body = { ...obj, v: spec.version };
  const k = checksum16(JSON.stringify(body)); // checksum of everything except k
  const payload = { ...body, k };
  const compressed = await deflateRaw(strToU8(JSON.stringify(payload)));
  return spec.prefix + bytesToB64url(compressed);
}

async function decodeKind(kind, str) {
  const spec = KINDS[kind];
  if (typeof str !== "string" || !str) throw codeError(ERR_WRONGKIND(spec.label));
  const s = str.trim();
  if (!s.startsWith(spec.prefix)) {
    // Right family but not this version → newer app. Otherwise → wrong kind.
    if (s.startsWith(spec.family)) throw codeError(ERR_NEWER);
    throw codeError(ERR_WRONGKIND(spec.label));
  }
  const bodyStr = s.slice(spec.prefix.length);
  if (!bodyStr) throw codeError(ERR_INCOMPLETE);

  let bytes;
  try {
    bytes = b64urlToBytes(bodyStr);
  } catch {
    throw codeError(ERR_INCOMPLETE);
  }
  let json;
  try {
    json = strFromU8(await inflateRaw(bytes));
  } catch {
    throw codeError(ERR_INCOMPLETE);
  }
  let payload;
  try {
    payload = JSON.parse(json);
  } catch {
    throw codeError(ERR_INCOMPLETE);
  }
  if (!payload || typeof payload !== "object") throw codeError(ERR_INCOMPLETE);

  const { k, ...body } = payload;
  if (typeof k !== "number" || checksum16(JSON.stringify(body)) !== k) {
    throw codeError(ERR_INCOMPLETE);
  }
  if (body.v !== spec.version) throw codeError(ERR_NEWER);
  return body;
}

// ---------- report (WC1.) with size-driven trimming ----------
// If the code is over REPORT_MAX, shed the lowest-value data first: oldest
// misconceptions (mp is most-recent-first), then writing ticks (keep the score
// and total), then everything optional. Required fields are never dropped.
export async function encodeReport(data) {
  const base = { ...data };
  const fullMp = Array.isArray(base.mp) ? base.mp.slice(0, 40) : undefined;

  // Each step mutates `work` to a smaller payload; applied in order until small.
  const steps = [];
  if (fullMp && fullMp.length > 0) {
    for (const cap of [30, 20, 10, 5, 0]) {
      steps.push((w) => {
        if (Array.isArray(w.mp) && w.mp.length > cap) w.mp = w.mp.slice(0, cap);
      });
    }
  }
  steps.push((w) => {
    if (w.w && typeof w.w === "object") {
      const trimmed = {};
      for (const [qid, v] of Object.entries(w.w)) {
        trimmed[qid] = Array.isArray(v) ? v.slice(0, 2) : v; // drop [ticks]
      }
      w.w = trimmed;
    }
  });
  steps.push((w) => { delete w.rd; }); // optional readiness
  steps.push((w) => { delete w.w; }); // last resort: drop writing entirely

  const work = { ...base };
  if (fullMp) work.mp = fullMp;

  let code = await encodeKind("report", work);
  for (let i = 0; i < steps.length && code.length > REPORT_MAX; i++) {
    steps[i](work);
    code = await encodeKind("report", work);
  }
  return code;
}
export function decodeReport(str) {
  return decodeKind("report", str);
}

// ---------- assignment (WA1.) ----------
export async function encodeAssignment(data) {
  return encodeKind("assignment", data);
}
export function decodeAssignment(str) {
  return decodeKind("assignment", str);
}

// ---------- result (WR1.) ----------
export async function encodeResult(data) {
  return encodeKind("result", data);
}
export function decodeResult(str) {
  return decodeKind("result", str);
}

// ---------- links & hash routing (codes live ONLY in the fragment) ----------
export function reportUrl(code) {
  return BASE_URL + "#r=" + code;
}
export function assignmentUrl(code) {
  return BASE_URL + "#a=" + code;
}
export function resultUrl(code) {
  return BASE_URL + "#x=" + code;
}

const HASH_KEY_TO_KIND = { r: "report", a: "assignment", x: "result" };

// Parse a location hash (or a whole URL) into { kind, code } or null.
// Accepts "#r=WC1.…", "r=WC1.…", or a full "https://…/#r=WC1.…".
export function readHash(hashOrUrl) {
  if (typeof hashOrUrl !== "string" || !hashOrUrl) return null;
  let frag = hashOrUrl;
  const hashAt = frag.indexOf("#");
  if (hashAt >= 0) frag = frag.slice(hashAt + 1);
  const eq = frag.indexOf("=");
  if (eq <= 0) return null;
  const key = frag.slice(0, eq).trim().toLowerCase();
  const kind = HASH_KEY_TO_KIND[key];
  if (!kind) return null;
  const code = frag.slice(eq + 1).trim();
  if (!code) return null;
  return { kind, code };
}

export const REPORT_SIZE_LIMIT = REPORT_MAX;
