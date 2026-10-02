/* Licence / entitlement logic for the free–paid boundary.
 *
 * One-off, lifetime licences via Lemon Squeezy. The LS licence endpoints take the
 * licence KEY as the credential — no store API key, so this runs client-side with
 * no secret in the bundle. Every network call is wrapped by the caller in the
 * entitlement refresh, which falls back to the cached entitlement (never to
 * "locked") on any failure. The licence key never leaves the device except in the
 * body of a POST to api.lemonsqueezy.com.
 */
import { LICENCE_CONFIG } from "./config.js";

const LS_BASE = "https://api.lemonsqueezy.com/v1/licenses";
export const GRACE_MS = 30 * 24 * 60 * 60 * 1000; // 30-day offline grace

// variant → profile cap. Family unlocks up to 3 learners; single/free = 1.
export function maxProfilesForVariant(variantId, variantName) {
  const id = String(variantId ?? "");
  const name = String(variantName ?? "").toLowerCase();
  if (id === String(LICENCE_CONFIG.variantIdFamily) || name.includes("family")) return 3;
  return 1;
}
export function tierForVariant(variantId, variantName) {
  return maxProfilesForVariant(variantId, variantName) === 3 ? "family" : "single";
}

// The single source of truth for the gate. Unit 1 is free forever; everything
// else needs a valid entitlement that is either freshly validated or still inside
// the offline grace window.
export function isEntitled(entitlement, now = Date.now()) {
  if (!entitlement || !entitlement.key || !entitlement.valid) return false;
  const last = entitlement.lastValidatedAt || 0;
  return now - last <= GRACE_MS;
}
export function isUnlocked(unitId, entitlement, now = Date.now()) {
  return Number(unitId) === 1 || isEntitled(entitlement, now);
}
export function maxProfilesOf(entitlement) {
  return (entitlement && entitlement.maxProfiles) || 1;
}
// True when a paying device is past its grace window and should be soft-prompted
// to reconnect (still treated as locked by isEntitled, but worth a gentler message).
export function graceExpired(entitlement, now = Date.now()) {
  return !!(entitlement && entitlement.key && entitlement.valid && (now - (entitlement.lastValidatedAt || 0) > GRACE_MS));
}

async function lsPost(path, params) {
  const body = new URLSearchParams(params).toString();
  const res = await fetch(`${LS_BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
  });
  let json = {};
  try { json = await res.json(); } catch (_) { /* non-JSON error */ }
  return { ok: res.ok, status: res.status, json };
}

function entitlementFrom(json, key, instanceId) {
  const meta = json.meta || {};
  const variantId = meta.variant_id;
  const variantName = meta.variant_name;
  const status = (json.license_key && json.license_key.status) || (json.valid ? "active" : "inactive");
  return {
    key,
    instanceId: instanceId || (json.instance && json.instance.id) || null,
    tier: tierForVariant(variantId, variantName),
    maxProfiles: maxProfilesForVariant(variantId, variantName),
    variantName: variantName || null,
    status,
    valid: true,
    lastValidatedAt: Date.now(),
  };
}

// Activate a key on this device. Returns { ok, entitlement } or { ok:false, error, code }.
export async function activate(key, deviceId) {
  const k = String(key || "").trim();
  if (!k) return { ok: false, error: "Enter your licence key." };
  try {
    const { ok, json } = await lsPost("activate", { license_key: k, instance_name: deviceId || "device" });
    if (ok && json.activated) {
      return { ok: true, entitlement: entitlementFrom(json, k, json.instance && json.instance.id) };
    }
    // LS returns { error } with activation-limit and invalid-key messages.
    const msg = json.error || "That licence key could not be activated.";
    const limit = /activation limit|limit reached|no activations left/i.test(msg);
    return { ok: false, error: msg, code: limit ? "limit" : "invalid" };
  } catch (e) {
    return { ok: false, error: "Couldn't reach the licence server. Check your connection and try again.", code: "network" };
  }
}

// Re-validate a stored entitlement. On a reachable server this refreshes validity
// (a refunded/disabled key comes back invalid → re-lock). On a network failure it
// returns { offline:true } and the caller keeps the cached entitlement.
export async function validate(entitlement) {
  if (!entitlement || !entitlement.key) return { ok: false };
  try {
    const params = { license_key: entitlement.key };
    if (entitlement.instanceId) params.instance_id = entitlement.instanceId;
    const { ok, json } = await lsPost("validate", params);
    if (!ok && json && json.error == null) return { offline: false, ok: false };
    const valid = !!json.valid;
    const meta = json.meta || {};
    return {
      ok: true,
      entitlement: {
        ...entitlement,
        valid,
        status: (json.license_key && json.license_key.status) || entitlement.status,
        tier: tierForVariant(meta.variant_id, meta.variant_name) || entitlement.tier,
        maxProfiles: valid ? maxProfilesForVariant(meta.variant_id, meta.variant_name) : 1,
        variantName: meta.variant_name || entitlement.variantName,
        lastValidatedAt: Date.now(),
      },
    };
  } catch (e) {
    return { offline: true }; // keep the cached entitlement; never hard-lock offline
  }
}

// Deactivate this device ("Remove this device"). Clears the local entitlement
// regardless of the server result so a stuck key can always be removed locally.
export async function deactivate(entitlement) {
  if (!entitlement || !entitlement.key || !entitlement.instanceId) return { ok: true };
  try {
    await lsPost("deactivate", { license_key: entitlement.key, instance_id: entitlement.instanceId });
  } catch (e) { /* best-effort; still clear locally */ }
  return { ok: true };
}
