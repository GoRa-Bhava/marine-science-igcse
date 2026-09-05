# Content spec — what a subject file must provide

The app is a reusable retrieval-practice engine. Everything a learner sees that
belongs to one subject comes from a single content module in `src/content/`.
This file is the contract that module must satisfy. `src/content/marine-science.jsx`
is the reference implementation.

## Registering a subject

`src/content/index.js` holds the subject registry and the active-subject line:

```js
import marineScience from "./marine-science.jsx";
export const SUBJECTS = { "marine-science": marineScience };
export const ACTIVE_SUBJECT = "marine-science";
```

Adding a subject is: add a content file, register it in `SUBJECTS`, and point
`ACTIVE_SUBJECT` at it. Nothing in `App.jsx` changes.

## The default export

```js
export default {
  id: "marine-science",          // short slug, used for nothing visible yet
  title: "Marine Science IGCSE", // map header, first line
  subtitle: "Units 1 to 3",      // map header, after the title
  headline: "Earth, water and life",  // map heading
  storeKey: "marine_u1_v1",      // localStorage key for progress — NEVER change once shipped
  creaturePath: "creatures/",    // folder under public/ holding <creature id>.png
  collection: {
    title: "Ocean discoveries",  // collection screen and map button
    noun: "creatures",           // "12 of 28 creatures found"
    blurb: "Rarer species appear as more topics reach mastered.",
  },
  units, topics, items, creatures,
  drawnArt,                      // optional
};
```

Every field is required except `drawnArt`.

## `units[]`

```js
{ n: 1, name: "Earth and oceans" }
```

`n` is the unit number topics refer to. Units are shown in array order.

## `topics[]`

```js
{ id: "space", unit: 1, name: "Earth in space", depth: "Surface" }
```

| Field | Meaning |
| --- | --- |
| `id` | unique slug; items refer to it, and progress is keyed by it |
| `unit` | matches a `units[].n` |
| `name` | shown on the map and in lessons |
| `depth` | short label shown at the right of the topic row (any text) |

Topics are listed on the map in array order within their unit.

## `items[]`

Every item has these fields:

| Field | Meaning |
| --- | --- |
| `id` | unique across the whole subject. Progress is keyed by it, so never reuse or rename an id once shipped |
| `topic` | a `topics[].id` |
| `type` | one of `choice`, `gap`, `multi`, `match`, `chain` |
| `q` | the prompt |
| `why` | one sentence shown after answering, right or wrong |
| `bridge` | optional `true`, flags a step that goes beyond the source material (see QUESTION-SPEC.md) |

Plus the fields for its type. The engine orders a lesson up the ladder
`choice` → `gap` → `match`/`multi` → `chain`.

### `choice` — Recognise

```js
{ id: "sp1", topic: "space", type: "choice",
  q: "...",
  options: ["correct", "distractor", "distractor", "distractor"],
  a: 0,
  why: "..." }
```

Exactly four `options`. `a` is the index of the correct one. Author it first;
the app shuffles and never shows the authored order.

### `gap` — Retrieve

```js
{ id: "sp2", topic: "space", type: "gap",
  q: "Complete the sentence.",
  segments: ["Text before ", " text between ", " text after."],
  answers: ["word1", "word2"],
  bank: ["word1", "word2", "d1", "d2", "d3"],
  why: "..." }
```

`segments` has one more entry than `answers`; blank *i* sits between
`segments[i]` and `segments[i+1]`. Every answer must appear in `bank`, exactly
once. Bank words are compared as exact strings.

### `multi` — Connect

```js
{ id: "sp3", topic: "space", type: "multi",
  q: "Select every ...",
  options: ["...", "...", "...", "...", "..."],
  a: [0, 1, 2],
  why: "..." }
```

Five to seven `options`. `a` lists the indexes of every correct option; the
learner must select exactly that set.

### `match` — Connect

```js
{ id: "sp4", topic: "space", type: "match",
  q: "Match each term to its description.",
  pairs: [["Term", "Description"], ["Term", "Description"], ["Term", "Description"]],
  why: "..." }
```

Three to five pairs, term first. The app shuffles both columns and never
leaves a term opposite its own description.

### `chain` — Explain

```js
{ id: "sp5", topic: "space", type: "chain",
  q: "Build the explanation: ...",
  chunks: ["step 1", "step 2", "step 3", "step 4"],
  why: "..." }
```

Four or five `chunks` in the correct order. The learner must reproduce that
exact order.

## `creatures[]`

```js
{ id: "clownfish", name: "Clownfish", rarity: "common", fact: "..." }
```

| Field | Meaning |
| --- | --- |
| `id` | unique slug; also the image filename `public/<creaturePath><id>.png` |
| `name` | shown once discovered |
| `rarity` | `common`, `uncommon` or `rare`; rarer ones appear as more topics reach mastered |
| `fact` | one or two sentences shown on discovery and in the collection |

The collection is shown in array order.

## `drawnArt(id, palette)` — optional

Returns JSX for the inside of a `0 0 100 100` SVG, or `null`. Used only when
the creature's PNG fails to load. `palette` is the app colour object
(`glow`, `glowDim`, `coral`, `sand`, `foam`, `mist`, `abyss`, `deep`, ...).
When absent or `null`, a generic fish silhouette is drawn.

## Progress

Progress is stored in `localStorage` under `storeKey`, keyed by item id and
topic id. That is why ids must never change once a subject has shipped.
