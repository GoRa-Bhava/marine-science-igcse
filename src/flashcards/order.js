/* Flashcard deck ordering — pure and rng-injectable so it can be unit-tested.

   shuffleDeck: a plain Fisher–Yates shuffle (unit decks).
   mixedDeck:   shuffle within each unit, then interleave the units so that no two
                consecutive cards share a unit whenever that is possible, with a
                randomised starting unit (the Mixed deck).

   Both return a new array and never mutate their input. rng defaults to
   Math.random; tests pass a seeded rng. */

// Fisher–Yates on a copy.
export function shuffleDeck(cards, rng = Math.random) {
  const a = cards.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/* Interleave units so adjacent cards differ in unit when possible. Greedy: at
   each step take a card from the unit with the most cards still remaining whose
   unit differs from the previous card's. If every group has at most half the
   cards (true for the 36-card deck: 6 of 36), this never places two same-unit
   cards together. The starting unit is randomised by shuffling the group order,
   so ties at the first pick (all groups equal) resolve to a random unit. */
export function mixedDeck(cards, rng = Math.random) {
  // Group by unit, each group independently shuffled.
  const groups = new Map();
  for (const c of cards) {
    if (!groups.has(c.unit)) groups.set(c.unit, []);
    groups.get(c.unit).push(c);
  }
  // Randomise group order so the start (and any count ties) vary by seed.
  const buckets = shuffleDeck(
    [...groups.entries()].map(([unit, cs]) => ({ unit, cards: shuffleDeck(cs, rng) })),
    rng,
  );

  const out = [];
  let prevUnit = null;
  const total = cards.length;
  while (out.length < total) {
    const nonEmpty = buckets.filter((b) => b.cards.length > 0);
    if (nonEmpty.length === 0) break;
    // Prefer a unit different from the previous card; fall back only if forced.
    let candidates = nonEmpty.filter((b) => b.unit !== prevUnit);
    if (candidates.length === 0) candidates = nonEmpty;
    // Most cards remaining wins; ties keep the (already randomised) bucket order.
    let pick = candidates[0];
    for (const b of candidates) if (b.cards.length > pick.cards.length) pick = b;
    out.push(pick.cards.pop());
    prevUnit = pick.unit;
  }
  return out;
}
