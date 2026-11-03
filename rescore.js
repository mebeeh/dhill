// Re-score the 50 vignettes with a given engine, rebuilding each case exactly as vignettes.js did (same seed).
const ENG = process.argv[2];
const E = require(ENG); if (process.argv[3]) E.setOpt(JSON.parse(process.argv[3]));
let seed = 20261103; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = (a) => a[Math.floor(rnd() * a.length)];
const B = require('./engine_v11.js'); // same medicine list order as when the cases were generated
const meds = Object.keys(B.MEDS);
const hi = meds.filter((m) => B.CLASSES[B.MEDS[m].cls].risk === 'H'), mo = meds.filter((m) => B.CLASSES[B.MEDS[m].cls].risk === 'M'), lo = meds.filter((m) => B.CLASSES[B.MEDS[m].cls].risk === 'L');
const cities = ['makkah', 'jeddah', 'riyadh', 'madinah']; const out = {};
for (let i = 0; i < 50; i++) {
  const city = cities[i % 4]; E.setCity(city); B.setCity(city);
  const L = new Set(); const tier = i % 5;
  L.add(pick(lo)); if (tier >= 1) L.add(pick(mo)); if (tier >= 2) L.add(pick(hi));
  if (tier >= 3) { let h; do { h = pick(hi); } while (L.has(h)); L.add(h); }
  if (tier === 4) { L.add(pick(['furosemide', 'hctz', 'indapamide'])); L.add(pick(['lisinopril', 'losartan', 'valsartan', 'perindopril'])); L.add(pick(['ibuprofen', 'diclofenac'])); }
  const th = B.CITY_T[city]; const t = Math.round((th[0] - 3 + rnd() * 6) * 10) / 10; const base = Math.round(55 + rnd() * 35);
  const loss = pick([0, 0, 0, 1, 2, 3.5]);
  const c = { weight: +(base * (1 - loss / 100)).toFixed(1), dizzy: rnd() < 0.25, lowFluids: rnd() < 0.35, lessUrine: rnd() < 0.2, vomDia: rnd() < 0.12, fever: rnd() < 0.08, confusion: rnd() < 0.04 };
  if (rnd() < 0.3) Object.assign(c, { bpLyingSys: 135, bpLyingDia: 80, bpStandSys: rnd() < 0.5 ? 110 : 132, bpStandDia: 78, pulse: rnd() < 0.3 ? 104 : 80 });
  rnd(); // age draw
  out['V' + String(i + 1).padStart(2, '0')] = E.assess({ meds: [...L], baseline: base, check: c }, t).status;
}
console.log(JSON.stringify(out));
