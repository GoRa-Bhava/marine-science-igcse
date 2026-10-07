/* Lemon Squeezy configuration for the licence gate.
 *
 * Live values (store created). No secret API key lives here (or anywhere in the
 * client): the licence activate/validate/deactivate endpoints authenticate with
 * the LICENCE KEY itself, which the buyer supplies. Everything below is public
 * (hosted-checkout URLs + variant ids).
 *
 * Mapping confirmed from the live checkout pages: be005b8b… = Single, 62c04385… =
 * Family. variant → maxProfiles is set in licence.js: Single (2217452) → 1,
 * Family (2217451) → 3; free/no-key → 1.
 *
 * Store switched test → live (2026-10-07): the live store reissued the variant
 * IDs (old test IDs 2209640/2209839 → live 2217452/2217451). Checkout URLs were
 * unchanged. If LS reissues IDs again, update the two variantId lines below.
 */
export const LICENCE_CONFIG = {
  storeDomain: "wildcateducation.lemonsqueezy.com",
  checkoutUrlSingle: "https://wildcateducation.lemonsqueezy.com/checkout/buy/be005b8b-8353-4f78-894d-0bda8bc6746e",
  checkoutUrlFamily: "https://wildcateducation.lemonsqueezy.com/checkout/buy/62c04385-2349-44ea-bdc9-77b5911053f3",
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
