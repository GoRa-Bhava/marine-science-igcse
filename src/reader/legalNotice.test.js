import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COPYRIGHT, TRADEMARK, LICENCE_USE } from "../legal.js";

const OWNER = "Don Simpson trading as Wildcat Education";
const src = readFileSync(new URL("./ReaderApp.jsx", import.meta.url), "utf8");

// The function body of `function name() { ... }` up to the next top-level
// `  function ` declaration — enough to check which notices each view renders.
function bodyOf(name) {
  const start = src.indexOf(`function ${name}()`);
  assert.ok(start >= 0, `${name} exists in ReaderApp`);
  const after = src.indexOf("\n  function ", start + 1);
  return src.slice(start, after === -1 ? undefined : after);
}

test("legal.js carries the ownership and trademark wording", () => {
  assert.ok(COPYRIGHT.includes(OWNER), "COPYRIGHT names the owner");
  assert.ok(COPYRIGHT.includes("All rights reserved"), "COPYRIGHT reserves rights");
  assert.ok(
    TRADEMARK.includes("Cambridge University Press & Assessment") &&
      TRADEMARK.includes("not endorsed by or affiliated"),
    "TRADEMARK disclaims Cambridge affiliation"
  );
  assert.ok(LICENCE_USE.includes("your own use"), "LICENCE_USE states personal-use terms");
});

test("the Settings/About view renders the copyright and trademark notice", () => {
  const body = bodyOf("renderSettings");
  assert.ok(body.includes("{COPYRIGHT}"), "Settings renders COPYRIGHT (the owner name)");
  assert.ok(body.includes("{TRADEMARK}"), "Settings renders the trademark line");
});

test("the licence/unlock view renders the copyright and licence-use notice", () => {
  const body = bodyOf("renderUnlock");
  assert.ok(body.includes("{COPYRIGHT}"), "Unlock renders COPYRIGHT (the owner name)");
  assert.ok(body.includes("{LICENCE_USE}"), "Unlock renders the licence-use line");
});

test("both views therefore show the owner name", () => {
  // COPYRIGHT is the string that names the owner, and both views render it.
  assert.ok(COPYRIGHT.includes(OWNER));
  assert.ok(bodyOf("renderSettings").includes("{COPYRIGHT}"));
  assert.ok(bodyOf("renderUnlock").includes("{COPYRIGHT}"));
});
