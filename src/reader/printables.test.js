import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PRINTABLES_PAGE, PRINTABLES_ADDON_URL, FREE_PRINTABLES, FREE_PRINTABLES_COUNT,
  bundleOffer, showActivationOffer,
} from "../links.js";

const SET_URL = "https://wildcateducation.lemonsqueezy.com/checkout/buy/printables-addon";

test("with the add-on link empty, no £20 control is offered — the £30 bundle shows instead", () => {
  assert.equal(PRINTABLES_ADDON_URL, "", "ships empty until the owner pastes the checkout link");
  // Even for an activated device, an empty add-on link falls back to the £30 bundle.
  const o = bundleOffer({ activated: true, addonUrl: "" });
  assert.equal(o.kind, "bundle");
  assert.equal(o.price, "£30");
  assert.equal(o.url, PRINTABLES_PAGE);
  assert.doesNotMatch(o.label, /£20/);
});

test("when the add-on link is set and the app is activated, the £20 add-on button renders", () => {
  const o = bundleOffer({ activated: true, addonUrl: SET_URL });
  assert.equal(o.kind, "addon");
  assert.equal(o.price, "£20");
  assert.equal(o.url, SET_URL);
  assert.match(o.label, /£20/);
});

test("when the app is not activated, the £30 link renders even if the add-on link is set", () => {
  const o = bundleOffer({ activated: false, addonUrl: SET_URL });
  assert.equal(o.kind, "bundle");
  assert.equal(o.price, "£30");
  assert.equal(o.url, PRINTABLES_PAGE);
});

test("the post-activation offer shows once only, and only when the add-on link is set", () => {
  // Not yet seen + link set → show.
  assert.equal(showActivationOffer({ seen: false, addonUrl: SET_URL }), true);
  // Already seen → never again.
  assert.equal(showActivationOffer({ seen: true, addonUrl: SET_URL }), false);
  // Link empty → never, regardless of the seen flag.
  assert.equal(showActivationOffer({ seen: false, addonUrl: "" }), false);
});

test("there are 17 free sheets, all hosted on the website over https", () => {
  assert.equal(FREE_PRINTABLES_COUNT, 17);
  const all = FREE_PRINTABLES.flatMap((g) => g.items);
  assert.equal(all.length, 17);
  for (const it of all) {
    assert.match(it.href, /^https:\/\/www\.wildcateducation\.co\.uk\/printables\/free\//, `${it.file} is a website URL`);
    assert.match(it.file, /\.pdf$/);
  }
});

test("the service worker precache list contains no .pdf files", () => {
  const sw = readFileSync(new URL("../../public/sw.js", import.meta.url), "utf8");
  assert.doesNotMatch(sw, /\.pdf/i, "no PDF is ever precached (free sheets live off-origin and open in a new tab)");
});
