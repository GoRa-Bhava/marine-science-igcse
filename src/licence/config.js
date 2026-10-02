/* Lemon Squeezy configuration for the licence gate.
 *
 * ⚠️ PLACEHOLDERS — fill these in once the Lemon Squeezy store exists. No secret
 * API key lives here (or anywhere in the client): the licence activate/validate/
 * deactivate endpoints authenticate with the LICENCE KEY itself, which the buyer
 * supplies. The only values below are public (hosted-checkout URLs + variant ids).
 *
 * Store-setup checklist (owner):
 *  1. Create two one-time products in Lemon Squeezy: "Single" (£20) and
 *     "Family" (£40). Enable "License keys" on each.
 *  2. Set the activation limit: Single = 2, Family = 6.
 *  3. Copy each product's hosted-checkout URL into checkoutUrlSingle / …Family.
 *  4. Copy each variant id into variantIdSingle / variantIdFamily (used to tell
 *     Single from Family in the validate response → maxProfiles 1 vs 3).
 *  5. Enable the native affiliate programme in store settings (no app change;
 *     ?aff= links point at these same checkout URLs).
 */
export const LICENCE_CONFIG = {
  storeDomain: "marine-science.lemonsqueezy.com", // PLACEHOLDER
  checkoutUrlSingle: "https://marine-science.lemonsqueezy.com/buy/REPLACE-SINGLE", // PLACEHOLDER
  checkoutUrlFamily: "https://marine-science.lemonsqueezy.com/buy/REPLACE-FAMILY", // PLACEHOLDER
  variantIdSingle: "REPLACE_SINGLE_VARIANT_ID", // PLACEHOLDER
  variantIdFamily: "REPLACE_FAMILY_VARIANT_ID", // PLACEHOLDER
  supportEmail: "support@example.com", // PLACEHOLDER — shown on activation-limit errors
};

// True once the owner has filled in real checkout URLs (used only to show a
// "coming soon" note on the buy buttons during the placeholder phase — never
// gates the activate flow, which works against a real key regardless).
export const CHECKOUT_READY = !/REPLACE/.test(LICENCE_CONFIG.checkoutUrlSingle + LICENCE_CONFIG.checkoutUrlFamily);
