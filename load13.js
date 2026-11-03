// Alert load of engine v1.3 on real weather 2021-2025, for symptom-free patients (what the colour does on heat alone).
const E = require('./engine_v13.js'); const S = require('./series_2021_2025.json');
const profiles = {
  'low-risk only (statin, PPI)': ['atorvastatin', 'omeprazole'],
  'one moderate (metformin)': ['metformin'],
  'one high-risk (furosemide)': ['furosemide'],
  'two high-risk (furosemide + lisinopril)': ['furosemide', 'lisinopril'],
  'dangerous mix (HCTZ + losartan + diclofenac)': ['hctz', 'losartan', 'diclofenac'],
};
const out = {};
for (const city of Object.keys(S)) {
  E.setCity(city); const T = S[city].tmax; const yrs = T.length / 365.25; out[city] = { days_with_data: T.length };
  for (const [name, meds] of Object.entries(profiles)) {
    const c = { green: 0, amber: 0, red: 0, emergency: 0 };
    for (const t of T) c[E.assess({ meds, baseline: 70, check: { weight: 70 } }, t).status]++;
    out[city][name] = { amber_per_year: +(c.amber / yrs).toFixed(0), red_per_year: +(c.red / yrs).toFixed(0) };
  }
  // look-ahead: days per year on which a pre-heat call is opened for a high-risk patient (tomorrow or day after very hot, today not)
  let pre = 0; for (let i = 0; i < T.length - 2; i++) { const o = E.outlook({ meds: ['furosemide', 'lisinopril'] }, [T[i], T[i + 1], T[i + 2]]); if (o.preCall && E.heatLevel(T[i]) < 2) pre++; }
  out[city].preheat_heads_up_per_year = +(pre / yrs).toFixed(0);
  out[city].very_hot_days_per_year = +(T.filter((t) => E.heatLevel(t) >= 2).length / yrs).toFixed(0);
  out[city].days_38_plus_per_year = +(T.filter((t) => t >= 38).length / yrs).toFixed(0);
}
console.log(JSON.stringify(out, null, 1));
require('fs').writeFileSync('load13.json', JSON.stringify(out, null, 1));
