/* Lemon Squeezy configuration for the licence gate.
 *
 * Live values (store created). No secret API key lives here (or anywhere in the
 * client): the licence activate/validate/deactivate endpoints authenticate with
 * the LICENCE KEY itself, which the buyer supplies. Everything below is public
 * (hosted-checkout URLs + variant ids).
 *
 * Mapping confirmed from the live checkout pages: 93e672c7… = Single, 725e4f77… =
 * Family. variant → maxProfiles is set in licence.js: Single (2217452) → 1,
 * Family (2217451) → 3; free/no-key → 1.
 *
 * Store switched test → live (2026-10-07): the live store reissued BOTH the
 * variant IDs (test 2209640/2209839 → live 2217452/2217451) and the hosted
 * checkout URLs (the test URLs be005b8b…/62c04385… opened the test checkout).
 * If LS reissues any of these again, update the four fields below.
 */
export const LICENCE_CONFIG = {
  storeDomain: "wildcateducation.lemonsqueezy.com",
  checkoutUrlSingle: "https://wildcateducation.lemonsqueezy.com/checkout/buy/93e672c7-0a58-4034-96d8-fe2f4e05ce67",
  checkoutUrlFamily: "https://wildcateducation.lemonsqueezy.com/checkout/buy/725e4f77-569e-4271-b4f5-4e4267843d67",
  variantIdSingle: "2217452",
  variantIdFamily: "2217451",
  supportEmail: "support@wildcateducation.co.uk", // shown on activation-limit errors
};

// True once the owner has filled in real checkout URLs (used only to show a
// "coming soon" note on the buy buttons during the placeholder phase — never
// gates the activate flow, which works against a real key regardless).
export const CHECKOUT_READY = !/REPLACE/.test(LICENCE_CONFIG.checkoutUrlSingle + LICENCE_CONFIG.checkoutUrlFamily);

/* Owner comp access (private). Entering a key whose SHA-256 matches the hash
 * below unlocks every unit on that device as a Family entitlement, WITHOUT
 * contacting Lemon Squeezy — so the owner can use the full app before the store
 * is live, and on any device. Only the hash ships in the bundle: the plaintext
 * key is never present, so it can't be lifted from the JS and shared. This is
 * not a public bypass (a real buyer still activates a real LS key as normal).
 * Set to "" to disable. */
export const OWNER_KEY_SHA256 = "b63d13c7a94a338f6a98fcab4dd328bb54a3e5500a5ea7422a8f2875a71be2c6";
