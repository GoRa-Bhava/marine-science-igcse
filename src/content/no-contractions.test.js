import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Writing standard (20 Nov 2026): no contractions in learner-facing content.
// This lint scans the STRING LITERALS of the content files (never comments,
// code or keys) for the banned contraction forms. Possessive "its" is never
// matched because the pattern requires an apostrophe. A short allowlist covers
// quoted student wording that is meant to read as a learner's own phrasing.

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", ".."); // repo src/.. => repo root
const FILES = [
  "src/content/marine-science.jsx",
  "src/reader/practicals.js",
  "src/content/writing-bank.js",
  "src/content/truefalse-bank.js",
  "src/content/mark-true-bank.js",
  "src/flashcards/flashcards.js",
  "src/comparison/comparison-cards.js",
  "src/reader/notes.js",
];

// Quoted student wording that is deliberately left contracted. Keep this list
// explicit and small; every entry is a phrase a learner might actually write.
const ALLOWLIST = [
  "'photosynthesises so it's a plant'",
  "'microscopic so it's a bacterium'",
  "'moves so it's an animal'",
  "'it's bad'",
];

const CONTR = /\b(doesn|don|isn|aren|can|won|wouldn|shouldn|couldn|didn|wasn|weren|hasn|haven)['’]t\b|\b(it|that|there|what)['’]s\b|\b(they|you)['’]re\b/gi;

// Tokenize into regions so only string-literal content is scanned.
function regionize(src) {
  const n = src.length;
  let cur = "code", start = 0;
  const r = [];
  for (let i = 0; i < n; i++) {
    const c = src[i], c2 = src.slice(i, i + 2);
    if (cur === "code") {
      if (c2 === "//") { r.push(["code", start, i]); cur = "line"; start = i; i++; }
      else if (c2 === "/*") { r.push(["code", start, i]); cur = "block"; start = i; i++; }
      else if (c === '"') { r.push(["code", start, i]); cur = "dq"; start = i; }
      else if (c === "'") { r.push(["code", start, i]); cur = "sq"; start = i; }
      else if (c === "`") { r.push(["code", start, i]); cur = "bq"; start = i; }
    } else if (cur === "line") { if (c === "\n") { r.push(["line", start, i]); cur = "code"; start = i; } }
    else if (cur === "block") { if (c2 === "*/") { r.push(["block", start, i + 2]); cur = "code"; start = i + 2; i++; } }
    else if (cur === "dq") { if (c === "\\") { i++; } else if (c === '"') { r.push(["dq", start, i + 1]); cur = "code"; start = i + 1; } }
    else if (cur === "sq") { if (c === "\\") { i++; } else if (c === "'") { r.push(["sq", start, i + 1]); cur = "code"; start = i + 1; } }
    else if (cur === "bq") { if (c === "\\") { i++; } else if (c === "`") { r.push(["bq", start, i + 1]); cur = "code"; start = i + 1; } }
  }
  r.push([cur, start, n]);
  return r;
}

function allowlistRanges(src) {
  const ranges = [];
  for (const phrase of ALLOWLIST) {
    let from = 0, idx;
    while ((idx = src.indexOf(phrase, from)) !== -1) { ranges.push([idx, idx + phrase.length]); from = idx + phrase.length; }
  }
  return ranges;
}

test("no contraction appears in content strings (except quoted student wording)", () => {
  const offenders = [];
  for (const file of FILES) {
    const src = readFileSync(resolve(ROOT, file), "utf8");
    const regions = regionize(src);
    const allow = allowlistRanges(src);
    for (const [type, a, b] of regions) {
      if (type !== "dq" && type !== "sq" && type !== "bq") continue;
      const seg = src.slice(a, b);
      let m; CONTR.lastIndex = 0;
      while ((m = CONTR.exec(seg))) {
        const pos = a + m.index;
        if (allow.some(([s, e]) => pos >= s && pos < e)) continue;
        const line = src.slice(0, pos).split("\n").length;
        offenders.push(`${file}:${line} "${m[0]}"`);
      }
    }
  }
  assert.deepEqual(offenders, [], `contraction(s) found in content strings:\n  ${offenders.join("\n  ")}`);
});
