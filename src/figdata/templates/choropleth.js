/* ---------- SHADED-KEY (CHOROPLETH) MAP WITH LATITUDE AND LONGITUDE (0697 1.3/LO2, 6.6/LO3, 2.6/LO1, 4.3/LO8) ----------
   A survey grid of 2° × 2° squares over part of an ocean, each square shaded by class with monochrome patterns (key).
   Variant "plastic": floating plastic mass concentration (kg per km²) in part of a subtropical gyre — 5 classes; highest near the
   gyre centre (garbage patch). Variant "productivity": primary productivity (low / medium / high) off a coast with upwelling.
   All data is generated ("Survey A"); coordinate windows are plausible real locations but values are never real statistics.
   Skills: read the class at given coordinates; read coordinates of a site; describe the distribution with counts/positions;
   tap the highest site; explain the pattern (gyre / upwelling); judge a conclusion (one survey cannot show change over time);
   mark an X in a given class. Every asked square has its four neighbours (N, S, E, W) in the same class, so a one-square misreading cannot change the answer. */
import { rng, pickR, shuffleR, pickMixed } from "../core.js";

const KEY = "choropleth";
const NC = 12, NR = 10, CS = 34, L = 74, T = 30, W = 560, MWID = NC * CS, MHT = NR * CS;
const VAR = {
  plastic: {
    classes: ["less than 0.1", "0.1–0.9", "1–9", "10–99", "100 or more"], unit: "kg per km²", what: "mass concentration of floating plastic",
    title: (F) => `floating plastic in part of an ocean gyre (Survey A)`, pats: [0, 1, 2, 3, 4],
    windows: [[24, -160], [22, -150], [26, -140], [24, -70], [26, -60], [-36, -130], [-38, -30], [-34, 70], [-36, 80]],
  },
  productivity: {
    classes: ["low", "medium", "high"], unit: "", what: "primary productivity",
    title: (F) => `primary productivity off a west-facing coast (Survey A)`, pats: [0, 2, 4],
    windows: [[-26, -94], [-20, -96], [20, -36], [24, -38], [28, -138], [32, -140], [-30, -10], [-26, -12]],
  },
};
const latS = (v) => `${Math.abs(v)}° ${v >= 0 ? "N" : "S"}`, lonS = (v) => `${Math.abs(v)}° ${v >= 0 ? "E" : "W"}`;
const LET = "ABCDE";

function make(seed) {
  const v = rng(seed)() < 0.55 ? "plastic" : "productivity";   // variant fixed by the seed; retries only redraw the data
  for (let tries = 0; ; tries++) {
    if (tries > 3000) throw new Error('choropleth make: no figure found');
    const r = rng(seed + tries * 6151 + 11);
    const Vv = VAR[v], nC = Vv.classes.length;
    const [lat0, lon0] = pickR(r, Vv.windows);          // south-west corner (lat0 = southern edge, lon0 = western edge)
    const cls = [], land = [];
    if (v === "plastic") {
      const cx = 3 + r() * 6, cy = 3 + r() * 4, sx = 2.6 + r() * 1.4, sy = 2.2 + r() * 1.2, cx2 = cx + (r() - 0.5) * 6, cy2 = cy + (r() - 0.5) * 4;
      for (let j = 0; j < NR; j++) { cls.push([]); land.push([]); for (let i = 0; i < NC; i++) {
        const f = 3.4 * Math.exp(-((((i - cx) / sx) ** 2 + ((j - cy) / sy) ** 2) ** 0.8)) + 0.8 * Math.exp(-(((i - cx2) / 2.5) ** 2 + ((j - cy2) / 2.5) ** 2)) + 0.2 * Math.sin(i * 1.3 + j * 0.7 + r() * 0.2);
        cls[j].push(Math.max(0, Math.min(4, Math.floor(f / 0.6)))); land[j].push(false); } }
    } else {
      // coast on the eastern side: land squares from a jagged coastline 1–3 squares wide
      let cw = 1 + Math.floor(r() * 2);
      for (let j = 0; j < NR; j++) { cls.push([]); land.push([]); if (r() < 0.35) cw = Math.max(1, Math.min(3, cw + (r() < 0.5 ? -1 : 1)));
        const cell = (i) => NC - 1 - i; // distance index from the east edge
        for (let i = 0; i < NC; i++) { const fromCoast = cell(i) - cw; const isL = fromCoast < 0; land[j].push(isL);
          const f = isL ? 0 : 3.4 * Math.exp(-fromCoast / (3.6 + 0.4 * Math.sin(j * 0.9))) + 0.2 * Math.sin(i * 1.1 + j * 1.7);
          cls[j].push(isL ? -1 : Math.max(0, Math.min(2, Math.floor(f / 0.95)))); } }
    }
    // squares whose four neighbours (N, S, E, W) are sea and in the same class
    const uni = [];
    for (let j = 1; j < NR - 1; j++) for (let i = 1; i < NC - 1; i++) { const c = cls[j][i]; if (c < 0) continue; if (cls[j - 1][i] === c && cls[j + 1][i] === c && cls[j][i - 1] === c && cls[j][i + 1] === c) uni.push({ i, j, c }); }
    const byC = (c) => uni.filter((u) => u.c === c);
    if (byC(nC - 1).length < 1 || new Set(uni.map((u) => u.c)).size < Math.min(nC, 3)) continue;
    const counts = Array(nC).fill(0); let sea = 0; for (const row of cls) for (const c of row) if (c >= 0) { counts[c]++; sea++; }
    if (counts[nC - 1] < 3 || counts[0] < 6) continue;
    // five sites: one in the top class, four in lower classes (distinct squares, spread out)
    const sites = [], top = pickR(r, byC(nC - 1)); sites.push(top);
    for (const u of shuffleR(r, uni.filter((u) => u.c < nC - 1))) { if (sites.length >= 5) break; if (sites.every((s) => Math.abs(s.i - u.i) + Math.abs(s.j - u.j) >= 3)) sites.push(u); }
    if (sites.length < 5) continue;
    const S = shuffleR(r, sites).map((s, k) => Object.assign({}, s, { id: LET[k] }));
    // a query square that is not one of the sites
    const qcand = uni.filter((u) => !S.some((s) => s.i === u.i && s.j === u.j));
    if (!qcand.length) continue;
    const qcl = pickR(r, [...new Set(qcand.map((u) => u.c))]), query = pickR(r, qcand.filter((u) => u.c === qcl));
    // a start square for the plot question: lowest class, not the top class
    const start = uni.find((u) => u.c === 0) || { i: 0, j: 0, c: cls[0][0] };
    if (start.c === nC - 1) continue;
    return { kind: KEY, seed, v, lat0, lon0, cls, land, counts, sea, sites: S, query, start };
  }
}
/* square (i, j): i = column from the west, j = row from the NORTH; centre coordinates */
const cLat = (F, j) => F.lat0 + 2 * (NR - 1 - j) + 1, cLon = (F, i) => F.lon0 + 2 * i + 1;
const xs = (i) => L + i * CS, ys = (j) => T + j * CS;

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {}, Vv = VAR[F.v], pats = Vv.pats;
  let s = `<defs>
    <pattern id="${KEY}-p1" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.2" class="chdot"/></pattern>
    <pattern id="${KEY}-p2" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.3" class="chdot"/></pattern>
    <pattern id="${KEY}-p3" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" class="chhat"/></pattern>
    <pattern id="${KEY}-p4" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" class="chhat"/><line x1="0" y1="0" x2="6" y2="0" class="chhat"/></pattern>
    <pattern id="${KEY}-land" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" class="chland"/></pattern></defs>`;
  const fillOf = (c) => (c < 0 ? `url(#${KEY}-land)` : pats[c] === 0 ? "none" : `url(#${KEY}-p${pats[c]})`);
  s += `<rect x="${L}" y="${T}" width="${MWID}" height="${MHT}" class="chsea"/>`;
  for (let j = 0; j < NR; j++) for (let i = 0; i < NC; i++) s += `<rect x="${xs(i)}" y="${ys(j)}" width="${CS}" height="${CS}" fill="${fillOf(F.cls[j][i])}" class="chcell${F.land[j][i] ? " chl" : ""}"/>`;
  if (F.v === "productivity") s += `<text x="${xs(NC - 1) + CS / 2}" y="${ys(NR - 1) + CS - 6}" text-anchor="middle" class="chsm">land</text>`;
  // graticule: every 2° (square edges), labelled every 4°
  for (let j = 0; j <= NR; j++) { const lat = F.lat0 + 2 * (NR - j); s += `<line x1="${L}" x2="${L + MWID}" y1="${ys(j)}" y2="${ys(j)}" class="gmaj"/>`; if (lat % 4 === 0) s += `<text x="${L - 6}" y="${ys(j) + 4}" text-anchor="end" class="chax">${latS(lat)}</text>`; }
  for (let i = 0; i <= NC; i++) { const lon = F.lon0 + 2 * i; s += `<line y1="${T}" y2="${T + MHT}" x1="${xs(i)}" x2="${xs(i)}" class="gmaj"/>`; if (lon % 4 === 0) s += `<text x="${xs(i)}" y="${T + MHT + 16}" text-anchor="middle" class="chax">${lonS(lon)}</text>`; }
  s += `<rect x="${L}" y="${T}" width="${MWID}" height="${MHT}" class="chframe"/>`;
  s += `<text x="${L}" y="${T - 10}" class="chsm">grid squares are 2° × 2° · lines every 2°, labelled every 4°</text>`;
  if (hl.cell) { const c = hl.cell; s += `<rect x="${xs(c.i) + 2}" y="${ys(c.j) + 2}" width="${CS - 4}" height="${CS - 4}" class="chhl"/>`; }
  if (hl.cls != null) for (let j = 0; j < NR; j++) for (let i = 0; i < NC; i++) if (F.cls[j][i] === hl.cls) s += `<rect x="${xs(i) + 1.5}" y="${ys(j) + 1.5}" width="${CS - 3}" height="${CS - 3}" class="chhl2"/>`;
  if (opt.sites !== false) F.sites.forEach((p) => {
    const x = xs(p.i) + CS / 2, y = ys(p.j) + CS / 2, on = (hl.sites || []).includes(p.id);
    s += `<circle cx="${x}" cy="${y}" r="9" class="chsite${on ? " chsiteh" : ""}"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" class="chsitet">${p.id}</text>`;
    if (opt.tapMode) s += `<circle cx="${x}" cy="${y}" r="16" fill="transparent" data-tap="${p.id}"/>`;
  });
  // key: two columns under the map
  const ky = T + MHT + 34, C = Vv.classes;
  s += `<text x="${L}" y="${ky}" class="chkt">Key: ${Vv.what}${Vv.unit ? " / " + Vv.unit : ""}</text>`;
  C.forEach((lab, k) => { const col = k % 2, row = Math.floor(k / 2), x = L + col * 205, y = ky + 12 + row * 24; s += `<rect x="${x}" y="${y}" width="26" height="16" fill="${fillOf(k)}" class="chcell chkey"/><text x="${x + 34}" y="${y + 13}" class="chk">${lab}</text>`; });
  const kRows = Math.ceil(C.length / 2) + (F.v === "productivity" ? 1 : 0);
  if (F.v === "productivity") { const k = C.length, x = L + (k % 2) * 205, y = ky + 12 + Math.floor(k / 2) * 24; s += `<rect x="${x}" y="${y}" width="26" height="16" fill="url(#${KEY}-land)" class="chcell chkey"/><text x="${x + 34}" y="${y + 13}" class="chk">land</text>`; }
  if (opt.plotMode) s += `<rect x="${L}" y="${T}" width="${MWID}" height="${MHT}" fill="transparent" class="plothit"/>`;
  if (opt.state && typeof opt.state.i === "number") { const x = xs(opt.state.i) + CS / 2, y = ys(opt.state.j) + CS / 2; s += `<path d="M${x - 8} ${y - 8}L${x + 8} ${y + 8}M${x + 8} ${y - 8}L${x - 8} ${y + 8}" class="chX"/>`; }
  const H = ky + 12 + Math.ceil((C.length + (F.v === "productivity" ? 1 : 0)) / 2) * 24 + 6;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Shaded map of ${Vv.what} with lines of latitude and longitude">${s}</svg>`;
}

function questions(F, r) {
  const qs = [], Vv = VAR[F.v], C = Vv.classes, nC = C.length, u = Vv.unit ? ` ${Vv.unit}` : "", top = nC - 1;
  const clsTxt = (c) => (Vv.unit ? `${C[c]}${u}` : C[c]);
  // 1. class at given coordinates
  const Q = F.query, qlat = cLat(F, Q.j), qlon = cLon(F, Q.i);
  const optIdx = [Q.c, ...shuffleR(r, C.map((_, k) => k).filter((k) => k !== Q.c)).slice(0, Math.min(3, nC - 1))];
  qs.push({ kind: "choice", q: `What is the ${Vv.what} at <b>${latS(qlat)}, ${lonS(qlon)}</b>?`, options: optIdx.map(clsTxt), a: 0, askOpt: { sites: false }, doneOpt: () => ({ sites: false, hl: { cell: Q } }),
    why: `Find ${latS(qlat)} (between the ${latS(qlat - 1)} and ${latS(qlat + 1)} lines) and ${lonS(qlon)} (between ${lonS(qlon - 1)} and ${lonS(qlon + 1)}). The square where they cross has the pattern for <b>${clsTxt(Q.c)}</b> in the key.` });
  // 2. coordinates of a site (choice; distractors one square off)
  const sp = pickR(r, F.sites), slat = cLat(F, sp.j), slon = cLon(F, sp.i);
  const cand = [[slat, slon], [slat + 2, slon], [slat, slon - 2], [slat - 2, slon + 2], [slat + 2, slon + 2], [slat - 2, slon]];
  const copt = []; for (const c of cand) if (copt.length < 4 && !copt.some((d) => d[0] === c[0] && d[1] === c[1])) copt.push(c);
  qs.push({ kind: "choice", q: `What are the coordinates of site <b>${sp.id}</b>?`, options: copt.map((c) => `${latS(c[0])}, ${lonS(c[1])}`), a: 0, hl: { sites: [sp.id], cell: sp },
    why: `Site ${sp.id} is in the middle of a 2° square. Read the latitude from the side: halfway between ${latS(slat - 1)} and ${latS(slat + 1)} is <b>${latS(slat)}</b>. Read the longitude from the bottom: halfway between ${lonS(slon - 1)} and ${lonS(slon + 1)} is <b>${lonS(slon)}</b>. Latitude is given first.` });
  // 3. tap the site with the highest class
  const ts = F.sites.find((s) => s.c === top);
  qs.push({ kind: "tap", q: `Tap the survey site with the <b>highest</b> ${Vv.what}.`, a: [ts.id], ansTxt: `site ${ts.id}`, labelOf: (id) => `site ${id}`, askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true, hl: { sites: [ts.id] } }),
    why: `Use the key: the ${pDesc(Vv.pats[top])} pattern is the highest class (${clsTxt(top)}). Only site ${ts.id} is in a square with that pattern. ${F.sites.filter((s) => s !== ts).map((s) => `${s.id}: ${clsTxt(s.c)}`).join("; ")}.` });
  // 4. distribution statements (counts and positions)
  const st = [], cnt = F.counts, sea = F.sea;
  const lowTwo = cnt[0] + cnt[1], frac = lowTwo / sea;
  if (Math.abs(frac - 0.5) >= 0.08) { const lowW = r() < 0.5; const hiTwo = sea - lowTwo;
    st.push(lowW ? [`More than half of the surveyed sea squares are in the lowest two classes.`, frac > 0.5, `${lowTwo} of the ${sea} sea squares are in the lowest two classes.`]
                 : [`More than half of the surveyed sea squares are in the ${nC === 3 ? "highest two classes" : "highest three classes"}.`, hiTwo / sea > 0.5, `${hiTwo} of the ${sea} sea squares are above the lowest two classes.`]); }
  let nT = 0, sT = 0; for (let j = 0; j < NR; j++) for (let i = 0; i < NC; i++) if (F.cls[j][i] === top) (j < NR / 2 ? nT++ : sT++);
  if (Math.abs(nT - sT) >= 2) st.push([`There are more squares in the highest class in the northern half of the map than in the southern half.`, nT > sT, `Highest class: ${nT} squares in the northern half, ${sT} in the southern half.`]);
  const [a, b] = shuffleR(r, F.sites).slice(0, 2);
  if (a.c !== b.c) st.push([`Site ${a.id} has a higher ${Vv.what} than site ${b.id}.`, a.c > b.c, `Site ${a.id}: ${clsTxt(a.c)}; site ${b.id}: ${clsTxt(b.c)}.`]);
  { const up = r() < 0.5, n = up ? cnt[top] + 3 : cnt[top] - 2; st.push([`Fewer than ${n} squares are in the highest class.`, cnt[top] < n, `${cnt[top]} squares are in the highest class.`]); }
  if (F.v === "productivity") {
    let near = 0, nN = 0, far = 0, nF = 0; for (let j = 0; j < NR; j++) { const coastI = F.land[j].indexOf(true); for (let i = 0; i < NC; i++) { if (F.land[j][i]) continue; const d = coastI - i; if (d <= 2) { near += F.cls[j][i]; nN++; } else if (d >= 6) { far += F.cls[j][i]; nF++; } } }
    const hiNear = r() < 0.5, ev = `Squares next to the coast are mostly ${C[Math.round(near / nN)]}; squares far offshore are mostly ${C[Math.round(far / nF)]}.`;
    st.push(hiNear ? [`Productivity is generally higher close to the coast than far from it.`, near / nN > far / nF, ev] : [`Productivity is generally higher far from the coast than close to it.`, far / nF > near / nN, ev]);
    let nTouch = 0, nHigh = 0; for (let j = 0; j < NR; j++) { const ci = F.land[j].indexOf(true); if (ci > 0) { nTouch++; if (F.cls[j][ci - 1] === top) nHigh++; } }
    st.push(r() < 0.5 ? [`At least half of the sea squares next to the land are high.`, nHigh >= nTouch / 2, `${nHigh} of the ${nTouch} sea squares next to the land are high.`]
                      : [`Fewer than half of the sea squares next to the land are high.`, nHigh < nTouch / 2, `${nHigh} of the ${nTouch} sea squares next to the land are high.`]);
  } else {
    // centre vs edges
    let cen = 0, nCen = 0, edge = 0, nE = 0; for (let j = 0; j < NR; j++) for (let i = 0; i < NC; i++) { const e = i === 0 || j === 0 || i === NC - 1 || j === NR - 1; if (e) { edge += F.cls[j][i]; nE++; } else if (i >= 3 && i <= NC - 4 && j >= 2 && j <= NR - 3) { cen += F.cls[j][i]; nCen++; } }
    if (Math.abs(cen / nCen - edge / nE) >= 0.4) { const ev = `Squares in the middle are mostly ${C[Math.round(cen / nCen)]}; squares along the edges are mostly ${C[Math.round(edge / nE)]}.`;
      st.push(r() < 0.5 ? [`Concentrations are generally higher in the middle of the map than along its edges.`, cen / nCen > edge / nE, ev] : [`Concentrations are generally higher along the edges of the map than in its middle.`, edge / nE > cen / nCen, ev]); }
  }
  // one statement about a site's class; its truth is chosen so the set always has both true and false statements
  { const allT = st.every((x) => x[1]), allF = st.every((x) => !x[1]), want = allT ? false : allF ? true : r() < 0.5;
    const pool = F.sites.filter((x) => x.c > 0 && x.c < top), sx = pickR(r, pool.length ? pool : F.sites);
    const k = want ? sx.c : (sx.c === 0 ? 1 : sx.c === top ? top - 1 : sx.c + (r() < 0.5 ? 1 : -1));
    const say = (kk) => (F.v === "plastic" ? `in the “${C[kk]} ${Vv.unit}” class` : `in the “${C[kk]}” class`);
    st.push([`Site ${sx.id} is ${say(k)}.`, k === sx.c, `Site ${sx.id} is ${say(sx.c)}.`]); }
  const pick = pickMixed(r, st.filter((x, i, arr) => arr.findIndex((y) => y[0] === x[0]) === i), 4);
  if (pick) qs.push({ kind: "multi", q: "Tick every statement the map supports.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: { cls: top },
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>") });
  // 5. explain the pattern (syllabus mechanism; distractors are knowledge-model misconceptions)
  if (F.v === "plastic") qs.push({ kind: "choice", q: "This area is near the centre of an ocean gyre. Why does floating plastic collect here?",
    options: ["Circulating surface currents carry floating plastic towards the calm centre", "Tides carry plastic into the centre twice a day and leave it there", "Currents on the seabed drag the plastic down towards the centre", "Winds blow the plastic out from the coasts and drop it in the centre"], a: 0, hl: { cls: top },
    why: "A gyre is a large system of circulating surface currents. Floating plastic is carried round by the currents and moves towards the calm centre, where it accumulates as a garbage patch. Gyres are surface currents, not tides or seabed currents." });
  else qs.push({ kind: "choice", q: "Why is primary productivity highest close to this coast?",
    options: ["Winds move surface water away and nutrient-rich deep water rises", "Upwelling brings warm water up, so producers photosynthesise faster", "The water near the coast holds more oxygen, so producers grow faster", "Tides lift the producers up from deep water into the sunlit surface"], a: 0, hl: { cls: top },
    why: "This is upwelling: winds push surface water away from the coast, and cold, nutrient-rich water rises from depth to replace it. Producers in the sunlit surface take up the nutrients and photosynthesise rapidly, so productivity is high. Upwelled water is cold, not warm; it lifts nutrients, not producers; and oxygen is not the cause." });
  // 6. judge a conclusion (one survey cannot show change over time)
  const concl = F.v === "plastic" ? "the amount of floating plastic in this area is increasing" : "productivity near this coast is high all through the year";
  qs.push({ kind: "choice", q: `A student uses the map to conclude that ${concl}. Is this conclusion valid?`,
    options: [`No, because the map shows a single survey, not changes over time`, `Yes, because the highest class is found in several squares`, `Yes, because every survey site is shaded with a pattern`, `No, because the map does not show any coordinates`], a: 0, hl: {},
    why: `The map shows <b>one survey</b>, at one time. To show ${F.v === "plastic" ? "an increase" : "the pattern through the year"} you would need repeated surveys of the same area at different times. The pattern of classes in one survey cannot show change.` });
  // 7. mark an X in a square of the highest class (plot; snaps to the square tapped)
  qs.push({ kind: "plot", q: `Mark an X in any square where the ${Vv.what} is <b>${F.v === "plastic" ? clsTxt(top) : "high"}</b>. Tap the map, then use the buttons to adjust.`,
    askOpt: { plotMode: true, sites: false },
    plot: {
      start: { i: F.start.i, j: F.start.j }, answer: (() => { const t = F.sites.find((s) => s.c === top); return { i: t.i, j: t.j }; })(), hint: "Tap a square on the map.",
      fromTap: (p) => { const i = Math.floor((p.x - L) / CS), j = Math.floor((p.y - T) / CS); if (i < 0 || j < 0 || i >= NC || j >= NR) return null; return { i, j }; },
      nudges: [["l", "◀", "Move the X one square west"], ["u", "▲", "Move the X one square north"], ["d", "▼", "Move the X one square south"], ["r", "▶", "Move the X one square east"]],
      nudge: (s, k) => ({ i: Math.max(0, Math.min(NC - 1, s.i + (k === "l" ? -1 : k === "r" ? 1 : 0))), j: Math.max(0, Math.min(NR - 1, s.j + (k === "u" ? -1 : k === "d" ? 1 : 0))) }),
      label: (s) => `Your X: ${latS(cLat(F, s.j))}, ${lonS(cLon(F, s.i))}.`,
      check: (s) => F.cls[s.j] && F.cls[s.j][s.i] === top,
    },
    doneOpt: (s) => ({ state: s, sites: false, hl: { cls: top } }),
    doneNote: (s, ok) => (ok ? "" : `The squares in the highest class are outlined.`),
    why: `Use the key: ${F.v === "plastic" ? clsTxt(top) : "high productivity"} is the ${pDesc(Vv.pats[top])} pattern. Any square with that pattern is accepted; all of them are outlined on the map.` });
  return qs;
}
function pDesc(p) { return ["plain (no pattern)", "sparse dots", "dense dots", "diagonal lines", "cross-hatched"][p]; }

function selfTest(F, qs) {
  const bad = [], top = VAR[F.v].classes.length - 1;
  const tops = F.sites.filter((s) => s.c === top); if (tops.length !== 1) bad.push("top site not unique");
  for (const s of [...F.sites, F.query]) for (const [di, dj] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const c = F.cls[s.j + dj] && F.cls[s.j + dj][s.i + di]; if (c !== s.c) bad.push("asked square next to a boundary"); }
  const p = qs.find((q) => q.kind === "plot"); if (p.plot.check(p.plot.start)) bad.push("start accepted");
  if (new Set(qs.find((q) => /coordinates of site/.test(q.q)).options).size !== 4) bad.push("coordinate options");
  if (!qs.some((q) => q.kind === "multi")) bad.push("no multi");
  return bad;
}

export default {
  key: KEY, group: "Maps", zoomDefault: true, name: "Shaded map with latitude and longitude", topics: "Units 1, 2, 4 and 6 (1.3, 2.6, 4.3, 6.6)", thumbSeed: 3,
  blurb: "A survey map of part of an ocean, shaded by class: floating plastic in a gyre, or productivity off a coast with upwelling.",
  tips: ["Read the key first: each pattern is one class.", "Find a place from its coordinates: latitude first (N/S, up the side), then longitude (E/W, along the bottom).", "Describe a distribution with positions and evidence: where the highest and lowest classes are, with counts or coordinates.", "Floating plastic collects in the calm centre of a gyre; productivity is high where upwelling brings nutrients to the surface.", "One survey shows one moment: it cannot show a change over time."],
  ctx: (F) => VAR[F.v].title(F),
  make, svg, questions, selfTest,
  css: `.fig-choropleth .chsea{fill:var(--surface2)}.fig-choropleth .chcell{stroke:none}.fig-choropleth .chkey{stroke:currentColor;stroke-width:1}.fig-choropleth .chland{fill:color-mix(in srgb,var(--ink) 30%,transparent)}.fig-choropleth .chdot{fill:currentColor}.fig-choropleth .chhat{stroke:currentColor;stroke-width:1.3}.fig-choropleth .chframe{fill:none;stroke:currentColor;stroke-width:1.4}.fig-choropleth .chax{font-size:12.5px}.fig-choropleth .chsm{font-size:12px;opacity:.85}.fig-choropleth .chkt{font-size:13.5px;font-weight:700}.fig-choropleth .chk{font-size:13.5px}.fig-choropleth .chsite{fill:var(--surface2);stroke:currentColor;stroke-width:1.8}.fig-choropleth .chsite.chsiteh{fill:var(--app)}.fig-choropleth .chsitet{font-size:13px;font-weight:800}.fig-choropleth .chhl{fill:none;stroke:var(--app);stroke-width:4}.fig-choropleth .chhl2{fill:none;stroke:var(--app);stroke-width:2.5}.fig-choropleth .chX{stroke:var(--accent);stroke-width:3.5}.fig-choropleth .gmaj{opacity:.75}`,
};
