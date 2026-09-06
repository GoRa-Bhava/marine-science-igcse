/* ========================================================================
   SCHEDULER — FSRS, tap-graded, one review per item per day

   Each answered item carries an FSRS card (ts-fsrs, FSRS-6 weights). The app
   only ever reads { seen, due } off a record; the card sits alongside as
   `fsrs`.

   Grading is binary and automatic: a correct tap is FSRS "Good", a wrong tap
   is "Again". Nothing about ratings, stability or difficulty is shown.

   The app works in whole days. An item is met at most once a day, so the
   earliest anything comes back is tomorrow, whatever FSRS's sub-day timing
   says. Learning steps are switched off for the same reason.
   ======================================================================== */
import { fsrs, generatorParameters, createEmptyCard, Rating, State } from "ts-fsrs";

/* The one tuning knob: the recall probability FSRS schedules for. */
export const REQUEST_RETENTION = 0.9;

/* Bumped when the saved progress shape changes. 1 (implicit, no field) was
   the fixed boxes; 2 is FSRS; 3 adds the gold-day count on each record. */
export const PROGRESS_VERSION = 3;

/* Gold days needed for a topic's items to count as mastered. */
export const GOLD_DAYS = 3;

const params = generatorParameters({
  request_retention: REQUEST_RETENTION,
  enable_fuzz: false,
  learning_steps: [],
  relearning_steps: [],
});
const scheduler = fsrs(params);

/* --------------------------------------------------------------- dates */
/* Dates are UTC calendar days, as they always were. */
export const dayOf = (d) => d.toISOString().slice(0, 10);
export const todayISO = (now = new Date()) => dayOf(now);
export const addDays = (n, now = new Date()) => {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return dayOf(d);
};

/* ----------------------------------------------------------- the card */
/* Stored cards keep dates as ISO strings so JSON round-trips cleanly. */
const toCard = (s) => ({
  ...s,
  due: new Date(s.due),
  last_review: s.last_review ? new Date(s.last_review) : undefined,
});
const fromCard = (c) => ({
  due: c.due.toISOString(),
  stability: c.stability,
  difficulty: c.difficulty,
  elapsed_days: c.elapsed_days,
  scheduled_days: c.scheduled_days,
  reps: c.reps,
  lapses: c.lapses,
  state: c.state,
  last_review: c.last_review ? c.last_review.toISOString() : undefined,
});

export const isDue = (rec, now = new Date()) => !!(rec && rec.seen && rec.due <= todayISO(now));

/* Feed one answer to FSRS and return the new record.
   A wrong answer always comes back tomorrow, as it always has: FSRS updates
   the card's stability and difficulty for the lapse, but its own timing for
   "Again" (a day or three, depending on how mature the item was) is not used.
   Reviewing a little earlier than FSRS asked is something it handles cleanly. */
export function review(rec, correct, now = new Date()) {
  const card = rec?.fsrs ? toCard(rec.fsrs) : createEmptyCard(now);
  const { card: next } = scheduler.next(card, now, correct ? Rating.Good : Rating.Again);
  const tomorrow = addDays(1, now);
  const fsrsDay = dayOf(next.due);
  const due = correct && fsrsDay > tomorrow ? fsrsDay : tomorrow;
  /* Gold: one credit per distinct calendar day the item is got right on a
     scheduled review. This function is only reached for due or new items and
     for lapses; an early correct answer never gets here. Capped at GOLD_DAYS
     and never reduced, so mastery cannot be lost. */
  const today = todayISO(now);
  let goldDays = rec?.goldDays || 0;
  let lastGoldDay = rec?.lastGoldDay;
  if (correct && lastGoldDay !== today) {
    goldDays = Math.min(GOLD_DAYS, goldDays + 1);
    lastGoldDay = today;
  }
  return { seen: true, due, fsrs: fromCard(next), goldDays, lastGoldDay };
}

/* The rule the lesson applies to a first attempt (retries within a lesson
   never touch the schedule):
     - due or new  -> FSRS review, right or wrong
     - early wrong -> FSRS review ("Again"); a lapse is a lapse
     - early right -> nothing. Extra practice on the same day is welcome, but
                      it is not spacing, and it must not inflate stability. */
export function answer(rec, correct, now = new Date()) {
  const gapElapsed = !rec || !rec.seen || rec.due <= todayISO(now);
  if (gapElapsed || !correct) return review(rec, correct, now);
  return rec;
}

/* ------------------------------------------------------------ strength */
/* Per-item strength 0..1 from FSRS stability, piecewise-linear through the
   points the old fixed boxes sat at (1, 3, 7 and 21 days), so a migrated
   map reads exactly as it did. "Mastered" (topic mean >= 0.75) therefore
   means items holding for about a week or better. */
const BAND = [[0.5, 0], [1, 0.25], [3, 0.5], [7, 0.75], [21, 1]];
export function itemStrength(rec) {
  if (!rec?.seen) return 0;
  const s = rec.fsrs?.stability ?? 0;
  if (s <= BAND[0][0]) return 0;
  for (let i = 1; i < BAND.length; i++) {
    const [s0, v0] = BAND[i - 1];
    const [s1, v1] = BAND[i];
    if (s <= s1) return v0 + ((v1 - v0) * (s - s0)) / (s1 - s0);
  }
  return 1;
}

/* ----------------------------------------------------------- migration */
/* Old shape: { box: 0..4, due: "YYYY-MM-DD", seen: true }. Box n was last
   scheduled with interval [1, 3, 7, 21][n - 1]; box 0 was a lapse due
   tomorrow. That interval becomes the card's stability, so strength, and
   with it the map, is unchanged by the migration. `due` and `seen` carry
   over as they are. The last review is placed one interval before `due`. */
const BOX_STABILITY = [0.5, 1, 3, 7, 21];

export function migrateRecord(old, now = new Date()) {
  if (!old || old.fsrs || old.box === undefined) return old;
  const box = Math.max(0, Math.min(4, Math.floor(old.box)));
  const stability = BOX_STABILITY[box];
  const due = old.due ? new Date(`${old.due}T00:00:00Z`) : now;
  const last = new Date(due.getTime() - stability * 86400e3);
  // Difficulty comes from what FSRS would assign that first answer.
  const seed = scheduler.next(createEmptyCard(last), last, box === 0 ? Rating.Again : Rating.Good).card;
  const card = {
    ...seed,
    due,
    last_review: last,
    stability,
    elapsed_days: 0,
    scheduled_days: Math.round(stability),
    reps: Math.max(1, box),
    lapses: box === 0 ? 1 : 0,
    state: State.Review,
  };
  return { seen: !!old.seen, due: old.due || dayOf(due), fsrs: fromCard(card) };
}

/* Version 3 adds goldDays. Records saved before it (v1 boxes or v2 FSRS)
   have no count, so it is seeded from the FSRS review count: a topic the
   learner has already reviewed a few times keeps that credit. */
export function migrateProgress(progress, now = new Date()) {
  if ((progress.version || 1) >= PROGRESS_VERSION) return { progress, migrated: false };
  const items = {};
  let changed = false;
  for (const [id, rec] of Object.entries(progress.items || {})) {
    let m = migrateRecord(rec, now); // v1 box -> fsrs; no-op for v2
    if (m && m.seen && m.goldDays === undefined) {
      const reps = m.fsrs?.reps || 1;
      const last = m.fsrs?.last_review ? new Date(m.fsrs.last_review) : now;
      m = { ...m, goldDays: Math.min(GOLD_DAYS, reps), lastGoldDay: dayOf(last) };
    }
    if (m !== rec) changed = true;
    items[id] = m;
  }
  return { progress: { ...progress, items, version: PROGRESS_VERSION }, migrated: changed };
}
