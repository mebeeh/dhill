// Exhaustive safety-invariant test of the live Dhill rule engine (engine.js extracted from dhill.pages.dev).
// Pre-specified invariants (written before running):
//  I1 Confusion/fainting -> 'emergency' for every medicine list and temperature.
//  I2 Hotter day never lowers the status (temperature monotonicity).
//  I3 An extra symptom, or a larger weight loss, never lowers the status (symptom monotonicity).
//  I4 Adding a medicine never lowers the status (medicine monotonicity).
//  I5 Vomiting/diarrhoea with >= 2 high-risk medicines -> at least 'red'.
//  I6 No heat-sensitive medicine (all low-risk) and no symptoms -> 'green' at every temperature.
//  I7 Every non-green result carries at least one stated reason.
//  I9 (v1.3) City very hot day + high-risk medicine profile -> at least red.
//  I8 Pending check with high-risk medicines on a very hot day (>=43 C) -> flagged as a high-risk day.
const E = require('./engine_v13.js');
const CITY = process.argv[2] || 'makkah'; const MAXK = +(process.argv[3] || 3); E.setCity(CITY);
const RANK = { green: 0, pending: 0, amber: 1, red: 2, emergency: 3 };
const meds = Object.keys(E.MEDS);
const temps = []; for (let t = 30; t <= 50; t++) temps.push(t);

// medicine lists: every subset of size 0..3 of the 23 demo medicines
const lists = [[]];
for (let i = 0; i < meds.length; i++) {
  lists.push([meds[i]]);
  for (let j = i + 1; j < meds.length; j++) {
    lists.push([meds[i], meds[j]]);
    if (MAXK >= 3) for (let k = j + 1; k < meds.length; k++) lists.push([meds[i], meds[j], meds[k]]);
  }
}
const SYM = ['dizzy', 'lowFluids', 'lessUrine', 'vomDia', 'fever', 'ortho', 'tachy'];
const LOSS = [0, 2, 4]; // % weight loss vs baseline
function makeCheck(mask, loss) {
  const c = { weight: +(70 * (1 - loss / 100)).toFixed(2), confusion: false };
  for (let b = 0; b < SYM.length; b++) {
    const on = !!(mask & (1 << b));
    if (SYM[b] === 'tachy') { c.pulse = on ? 108 : 78; continue; }
    if (SYM[b] === 'ortho') {
      if (on) Object.assign(c, { bpLyingSys: 130, bpLyingDia: 80, bpStandSys: 105, bpStandDia: 75 });
      else Object.assign(c, { bpLyingSys: 130, bpLyingDia: 80, bpStandSys: 128, bpStandDia: 80 });
    } else c[SYM[b]] = on;
  }
  return c;
}
const checks = [];
for (const loss of LOSS) for (let m = 0; m < 128; m++) checks.push({ loss, m, c: makeCheck(m, loss) });

const viol = { I1: 0, I2: 0, I3: 0, I4: 0, I5: 0, I6: 0, I7: 0, I8: 0, I9: 0 };
const examples = {};
let n = 0;
function note(k, ex) { viol[k]++; if (!examples[k]) examples[k] = ex; }
let calls = 0;
const st = (meds, c, t) => { calls++; return E.assess({ meds, baseline: 70, check: c }, t); };

for (const L of lists) {
  const mp = E.medProfile(L);
  const allLow = L.every((m) => E.CLASSES[E.MEDS[m].cls].risk === 'L');
  // pending (no check)
  for (const t of temps) {
    const r = st(L, null, t); n++;
    if (mp.level >= 2 && E.heatLevel(t) >= 2 && !r.highDay) note('I8', { L, t });
  }
  for (const t of temps) {
    // confusion
    const rc = st(L, Object.assign(makeCheck(0, 0), { confusion: true }), t); n++;
    if (rc.status !== 'emergency') note('I1', { L, t, s: rc.status });
    for (const ck of checks) {
      const r = st(L, ck.c, t); n++;
      const R = RANK[r.status];
      if (r.status !== 'green' && r.reasons.length === 0) note('I7', { L, t, ck: ck.m, loss: ck.loss });
      if (ck.c.vomDia && mp.highs >= 2 && R < 2) note('I5', { L, t, s: r.status });
      if (allLow && ck.m === 0 && ck.loss === 0 && r.status !== 'green') note('I6', { L, t, s: r.status });
      // I9 (v1.3): on the city's very hot days, 2+ high-risk medicines (or a dangerous mix) -> at least red, even with no symptoms
      if (mp.level >= 2 && E.heatLevel(t) >= 2 && R < 2) note('I9', { L, t, s: r.status });
      // I2: next degree hotter
      if (t < 50) { const r2 = st(L, ck.c, t + 1); if (RANK[r2.status] < R) note('I2', { L, t, ck: ck.m, loss: ck.loss, a: r.status, b: r2.status }); }
      // I3: add one symptom / more weight loss
      for (let b = 0; b < SYM.length; b++) if (!(ck.m & (1 << b))) {
        const r3 = st(L, makeCheck(ck.m | (1 << b), ck.loss), t);
        if (RANK[r3.status] < R) note('I3', { L, t, from: ck.m, add: SYM[b], a: r.status, b: r3.status });
      }
      const li = LOSS.indexOf(ck.loss);
      if (li < LOSS.length - 1) { const r4 = st(L, makeCheck(ck.m, LOSS[li + 1]), t); if (RANK[r4.status] < R) note('I3', { L, t, m: ck.m, moreLoss: LOSS[li + 1], a: r.status, b: r4.status }); }
    }
  }
}
// I4: adding a medicine (checked on all lists of size <=2 extended by one more medicine, subset of the grid)
for (const L of lists.filter((x) => x.length <= 2)) for (const extra of meds) if (!L.includes(extra)) {
  for (const t of [36, 40, 44, 47]) for (const ck of checks.filter((_, i) => i % 7 === 0)) {
    const a = st(L, ck.c, t), b = st(L.concat(extra), ck.c, t); n += 2;
    if (RANK[b.status] < RANK[a.status]) note('I4', { L, extra, t, a: a.status, b: b.status });
  }
}
console.log(JSON.stringify({ city: CITY, maxListSize: MAXK, engineCalls: calls, medicineLists: lists.length, temperatures: temps.length, checkStates: checks.length + 2, evaluations: n, violations: viol, examples }, null, 1));
