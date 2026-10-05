/* Lemon Squeezy configuration for the licence gate.
 *
 * Live values (store created). No secret API key lives here (or anywhere in the
 * client): the licence activate/validate/deactivate endpoints authenticate with
 * the LICENCE KEY itself, which the buyer supplies. Everything below is public
 * (hosted-checkout URLs + variant ids).
 *
 * Mapping confirmed from the live checkout pages: be005b8b… = Single, 62c04385… =
 * Family. variant → maxProfiles is set in licence.js: Single (2209640) → 1,
 * Family (2209839) → 3; free/no-key → 1.
 *
 * ⚠️ Before go-live (post-KYC store activation): re-check in the LS dashboard that
 * these variant IDs and checkout URLs are unchanged — if LS issued different live
 * values, update them here. Don't ship with stale pre-activation IDs.
 */
export const LICENCE_CONFIG = {
  storeDomain: "wildcateducation.lemonsqueezy.com",
  checkoutUrlSingle: "https://wildcateducation.lemonsqueezy.com/checkout/buy/be005b8b-8353-4f78-894d-0bda8bc6746e",
  checkoutUrlFamily: "https://wildcateducation.lemonsqueezy.com/checkout/buy/62c04385-2349-44ea-bdc9-77b5911053f3",
  variantIdSingle: "2209640",
  variantIdFamily: "2209839",
  supportEmail: "support@wildcateducation.co.uk", // shown on activation-limit errors
};

// True once the owner has filled in real checkout URLs (used only to show a
// "coming soon" note on the buy buttons during the placeholder phase — never
// gates the activate flow, which works against a real key regardless).
export const CHECKOUT_READY = !/REPLACE/.test(LICENCE_CONFIG.checkoutUrlSingle + LICENCE_CONFIG.checkoutUrlFamily);
