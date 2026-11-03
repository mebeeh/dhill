"""Builds series_2021_2025.json (daily maximum temperature per city, 2021-2025) and climatology.json (mean daily maximum by month, 2016-2025)
from Meteostat bulk daily files: https://bulk.meteostat.net/v2/daily/<station>.csv.gz saved as m_<station>.csv.gz. Data are not redistributed here."""
import pandas as pd, json
cols = ['date', 'tavg', 'tmin', 'tmax', 'prcp', 'snow', 'wdir', 'wspd', 'wpgt', 'pres', 'tsun']
st = {'makkah': 41030, 'jeddah': 41024, 'riyadh': 40438, 'madinah': 40430}
ser, clim = {}, {}
for n, s in st.items():
    df = pd.read_csv(f'm_{s}.csv.gz', header=None, names=cols, parse_dates=['date']).dropna(subset=['tmax'])
    te = df[(df.date >= '2021-01-01') & (df.date <= '2025-12-31')]
    ser[n] = {'dates': te.date.dt.strftime('%Y-%m-%d').tolist(), 'tmax': te.tmax.tolist()}
    cl = df[(df.date >= '2016-01-01') & (df.date <= '2025-12-31')]
    clim[n] = [round(float(cl[cl.date.dt.month == m].tmax.mean())) for m in range(1, 13)]
json.dump(ser, open('series_2021_2025.json', 'w')); json.dump(clim, open('climatology.json', 'w'))
