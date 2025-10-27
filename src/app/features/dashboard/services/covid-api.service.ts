import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CovidApiService {
  private readonly base = 'https://disease.sh/v3/covid-19';
  private readonly noCache = new HttpHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  constructor(private http: HttpClient) {}

  getGlobal(): Observable<any> {
    const t = Date.now();
    return this.http.get<any>(`${this.base}/all?t=${t}`, { headers: this.noCache });
  }

  getCountry(country: string): Observable<any> {
    const t = Date.now();
    return this.http.get<any>(`${this.base}/countries/${encodeURIComponent(country)}?strict=true&t=${t}`, { headers: this.noCache });
  }

  getCountries(): Observable<any[]> {
    const t = Date.now();
    return this.http.get<any[]>(`${this.base}/countries?t=${t}`, { headers: this.noCache });
  }

  getHistorical(country: string, lastdays: number | 'all' = 180): Observable<{
    dates: string[]; cases: number[]; deaths: number[]; recovered: number[];
  }> {
    const t = Date.now();
    return this.http.get<any>(`${this.base}/historical/${encodeURIComponent(country)}?lastdays=${lastdays}&t=${t}`, { headers: this.noCache })
      .pipe(map((res) => {
        const tline = res?.timeline ?? {};
        const toSeries = (obj: Record<string, number> = {}) => {
          const entries = Object.entries(obj).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
          return { dates: entries.map(([d]) => d), values: entries.map(([, v]) => v) };
        };
        const sCases = toSeries(tline.cases);
        const sDeaths = toSeries(tline.deaths);
        const sRecov  = toSeries(tline.recovered);
        return { dates: sCases.dates, cases: sCases.values, deaths: sDeaths.values, recovered: sRecov.values };
      }));
  }
}
