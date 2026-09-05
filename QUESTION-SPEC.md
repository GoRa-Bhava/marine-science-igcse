# Question-writing spec — Marine Science IGCSE app

This adapts the generator brief to the app's actual question formats. Read it
before writing or reviewing any question. Sections 1–4 carry over the original
brief almost unchanged; 5 onward is specific to this app.

---

## 1. Source

The supplied unit material (flashcards, plus any lesson notes provided) is the
authoritative source.

- Do not introduce facts, terms, figures or mechanisms the source does not
  support.
- **Bridging facts.** Explanation chains sometimes need one link the card
  leaves implicit. A bridging fact is allowed only if (a) it is needed to make
  a cause-and-effect chain coherent, (b) it is IGCSE-level, and (c) it is
  flagged with `bridge: true` on the item so it can be reviewed and removed.
- Earlier units may be referenced. Later units may not.
- If the source is ambiguous, leave the question out rather than guess.

## 2. Level and purpose

IGCSE Marine Science. The questions exist to make terminology familiar,
reinforce definitions, connect terms to marine contexts, distinguish similar
terms, and reinforce simple cause and effect. Never make a question hard for
its own sake.

## 3. Context

Every question names its subject. No bare pronouns, no "What does it do?".
The student should know exactly what is being asked and what kind of answer is
wanted. Scenarios are welcome but must stay inside the unit and fit on a phone
screen — roughly 25 words.

## 4. Quality bar

One clearly correct answer. No trick questions, double negatives, or
grammatical giveaways. Distractors are plausible, subject-relevant, and
ideally represent real student misconceptions.

---

## 5. The five shapes

Each shape does a different job. Pick the shape that fits the content, not the
other way round.

| Shape | `type` | Tests | Use when |
| --- | --- | --- | --- |
| Recognise | `choice` | Definition, identification, terminology | The card gives a definition or a single fact |
| Retrieve | `gap` | Recall of key words in context | The card's answer has 2–3 words that carry the meaning |
| Connect | `multi` | Classification, "which of the following" | The card lists characteristics, factors, or members of a set |
| Connect | `match` | Distinguishing similar terms | The unit has 3–5 terms that students confuse |
| Explain | `chain` | Sequence, process, cause and effect | The card describes something that happens in an order |

A card producing questions in two or three different shapes is the method,
not repetition. A card producing two questions of the same shape on the same
fact is repetition — cut one.

Rough balance per topic: 2–3 `choice`, 1 `gap`, 1 `multi` or `match`, and a
`chain` only where the content genuinely has an order. Not every topic
supports a chain; do not force one.

## 6. Rules per shape

### `choice`
- Four options. Exactly one correct.
- **All four options must be similar in length and level of detail.** If the
  correct answer needs a full sentence, so do the distractors. This is the
  rule most often broken.
- Distractors should be things a student might actually believe: the
  neighbouring term, the reversed relationship, the answer to a nearby card.
- Author with the correct answer first (`a: 0`). The app shuffles.

### `gap`
- Two or three blanks. Each blank is a key term, not a filler word.
- The word bank holds the answers plus 3–4 distractors from the same unit.
- **No synonyms of an answer in the bank** ("real" next to "actual" makes
  both right). No repeated answer words — each bank word can be placed once.
- The sentence must read as a complete, correct statement once filled.

### `multi`
- 5–7 options. At least two correct, at least two incorrect.
- Correct set must be exactly what the source lists — don't add extras.
- Distractors come from adjacent cards (an echinoderm feature in a cnidarian
  list), so wrong answers still teach.

### `match`
- 3–5 pairs. Terms on the left, descriptions on the right.
- **Every description must belong to exactly one term.** If two descriptions
  could both apply to one term, rewrite until they can't. ("Gives greater
  density" and "denser than warm water" both describe density increasing —
  that was a bad question.)
- Descriptions should be short: under ten words.

### `chain`
- 4–5 steps. Each step is one clause.
- **There must be exactly one correct order.** Cause-and-effect and processes
  qualify. Lists of features do not — never make a chain out of "describe X".
- Every step must be supported by the source, or flagged as a bridge.
- The `why` line should name what the chain demonstrates, not restate it.

## 7. The `why` line

One sentence, shown after the answer whether right or wrong.

- Reinforce the term or link being tested.
- Add the one thing a student most often forgets, if there is one.
- Do not introduce facts outside the source.
- Do not simply repeat the correct option.

## 8. Difficulty

The shape *is* the difficulty ladder. Within a lesson the app orders
`choice` → `gap` → `multi`/`match` → `chain`. Aim for roughly 40% `choice`,
40% `gap`/`multi`/`match`, 20% `chain`, which matches the original brief's
recall / understanding / application split.

## 9. Output format

Return items as JavaScript objects ready to paste into the `ITEMS` array.
Give every item a short unique `id` (two letters for the topic plus a number),
a `topic` matching an entry in `TOPICS`, and the fields for its shape:

```js
{
  id: "xx1", topic: "topicid", type: "choice",
  q: "...",
  options: ["correct", "distractor", "distractor", "distractor"],
  a: 0,
  why: "...",
},
{
  id: "xx2", topic: "topicid", type: "gap",
  q: "Complete the sentence.",
  segments: ["Text before ", " text between ", " text after."],
  answers: ["word1", "word2"],
  bank: ["word1", "word2", "d1", "d2", "d3", "d4"],
  why: "...",
},
{
  id: "xx3", topic: "topicid", type: "multi",
  q: "Select every ...",
  options: ["...", "...", "...", "...", "..."],
  a: [0, 1, 2],
  why: "...",
},
{
  id: "xx4", topic: "topicid", type: "match",
  q: "Match each term to its description.",
  pairs: [["Term", "Description"], ["Term", "Description"], ["Term", "Description"]],
  why: "...",
},
{
  id: "xx5", topic: "topicid", type: "chain",
  q: "Build the explanation: ...",
  chunks: ["step 1", "step 2", "step 3", "step 4"],
  why: "...",
  bridge: true,   // only if a step goes beyond the source
},
```

## 10. Validation before returning

For every item check:

- **Source** — is every claim in the question, options and `why` in the
  supplied material (or flagged as a bridge)?
- **Context** — is the subject named? Would the question make sense on its
  own, out of sequence?
- **One answer** — is there exactly one correct answer (or, for `multi`,
  exactly one correct set)?
- **Length parity** — for `choice`, are the four options comparable in
  length? Cover the answer: could a student guess it from shape alone?
- **Shape fit** — is this the right shape for the content? Is a `chain`
  genuinely ordered? Is a `match` free of overlapping descriptions?
- **Bank hygiene** — for `gap`, no synonyms, no repeats, answers present.
- **Repetition** — does another item test the same fact in the same shape?
- **Level** — would an IGCSE student who has read the card get this right?

If an item fails any check, fix it or drop it. Clear beats clever.
