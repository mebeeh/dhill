// 50 fictional vignettes for the pharmacist panel (seeded, stratified by city and medicine-risk level). Engine v1.1 output is stored separately from the rating sheet.
const E = require('./engine_v11.js');
let seed = 20261103; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = (a) => a[Math.floor(rnd() * a.length)];
const meds = Object.keys(E.MEDS);
const hi = meds.filter((m) => E.CLASSES[E.MEDS[m].cls].risk === 'H');
const mo = meds.filter((m) => E.CLASSES[E.MEDS[m].cls].risk === 'M');
const lo = meds.filter((m) => E.CLASSES[E.MEDS[m].cls].risk === 'L');
const cities = ['makkah', 'jeddah', 'riyadh', 'madinah'];
const out = [];
for (let i = 0; i < 50; i++) {
  const city = cities[i % 4]; E.setCity(city);
  const L = new Set();
  const tier = i % 5; // 0 low-only, 1 one moderate, 2 one high, 3 two high, 4 triple-whammy style
  L.add(pick(lo));
  if (tier >= 1) L.add(pick(mo));
  if (tier >= 2) L.add(pick(hi));
  if (tier >= 3) { let h; do { h = pick(hi); } while (L.has(h)); L.add(h); }
  if (tier === 4) { L.add(pick(['furosemide', 'hctz', 'indapamide'])); L.add(pick(['lisinopril', 'losartan', 'valsartan', 'perindopril'])); L.add(pick(['ibuprofen', 'diclofenac'])); }
  const th = E.CITY_T[city];
  const t = Math.round((th[0] - 3 + rnd() * 6) * 10) / 10;
  const base = Math.round(55 + rnd() * 35);
  const loss = pick([0, 0, 0, 1, 2, 3.5]);
  const c = { weight: +(base * (1 - loss / 100)).toFixed(1), dizzy: rnd() < 0.25, lowFluids: rnd() < 0.35, lessUrine: rnd() < 0.2, vomDia: rnd() < 0.12, fever: rnd() < 0.08, confusion: rnd() < 0.04 };
  if (rnd() < 0.3) Object.assign(c, { bpLyingSys: 135, bpLyingDia: 80, bpStandSys: rnd() < 0.5 ? 110 : 132, bpStandDia: 78, pulse: rnd() < 0.3 ? 104 : 80 });
  const age = 62 + Math.floor(rnd() * 25);
  const r = E.assess({ meds: [...L], baseline: base, check: c }, t);
  out.push({ id: 'V' + String(i + 1).padStart(2, '0'), city, age, meds: [...L].map((m) => E.MEDS[m].en).join('; '), tmax: t, baseline: base, weight: c.weight,
    findings: ['dizzy','lowFluids','lessUrine','vomDia','fever','confusion'].filter((k) => c[k]).join(', ') || 'none',
    bp: c.bpLyingSys ? `${c.bpLyingSys}/${c.bpLyingDia} lying, ${c.bpStandSys}/${c.bpStandDia} standing, pulse ${c.pulse}` : 'not measured',
    engine: r.status });
}
require('fs').writeFileSync('vignettes.json', JSON.stringify(out, null, 1));
const tally = out.reduce((a, v) => (a[v.engine] = (a[v.engine] || 0) + 1, a), {});
console.log(tally);
