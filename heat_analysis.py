"""Heat-calendar simulation for Dhill (Filter 2, Test 3).
Input: Meteostat daily bulk files, e.g. https://bulk.meteostat.net/v2/daily/41030.csv.gz (Makkah), 41024 (Jeddah), 40438 (Riyadh), 40430 (Madinah).
Counts days per year at or above the live engine's fixed 43 C cut-off (v1.0) and at or above each city's own 95th percentile (v1.1),
and re-derives the percentiles from 2016-2020 to test them out of sample on 2021-2025."""
import pandas as pd, numpy as np, json, sys
cols = ['date','tavg','tmin','tmax','prcp','snow','wdir','wspd','wpgt','pres','tsun']
st = {'Makkah': 41030, 'Jeddah': 41024, 'Riyadh': 40438, 'Madinah': 40430}
out = {}
for n, s in st.items():
    df = pd.read_csv(f'm_{s}.csv.gz', header=None, names=cols, parse_dates=['date'])
    te = df[(df.date >= '2021-01-01') & (df.date <= '2025-12-31')]
    tr = df[(df.date >= '2016-01-01') & (df.date <= '2020-12-31')]
    p_in = np.percentile(te.tmax, [90, 95, 97.5]).round(1).tolist()
    p_out = np.percentile(tr.tmax.dropna(), [90, 95, 97.5]).round(1).tolist()
    run = mx = 0
    for v in (te.tmax >= 43).tolist():
        run = run + 1 if v else 0; mx = max(mx, run)
    out[n] = {'v10_days_per_year': round((te.tmax >= 43).sum() / 5, 1), 'longest_run_ge43': mx,
              'v11_thresholds_P90_P95_P97.5': p_in, 'v11_days_per_year': round((te.tmax >= p_in[1]).sum() / 5, 1),
              'thresholds_from_2016_2020': p_out, 'out_of_sample_days_per_year_2021_2025': round((te.tmax >= p_out[1]).sum() / 5, 1)}
print(json.dumps(out, indent=1))
