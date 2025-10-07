import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CovidApiService {
  private readonly base = 'https://disease.sh/v3/covid-19';

  constructor(private http: HttpClient) {}

  // Totales globales
  getGlobal(): Observable<any> {
    return this.http.get<any>(`${this.base}/all`);
  }

  // Resumen por país (ej. Ecuador)
  getCountry(country: string): Observable<any> {
    return this.http.get<any>(`${this.base}/countries/${encodeURIComponent(country)}?strict=true`);
  }

  // Resumen de muchos países
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/countries`);
  }

  // Serie histórica de un país (cases, deaths, recovered)
  // lastdays: número o 'all' (p.ej. 180)
  getHistorical(country: string, lastdays: number | 'all' = 180): Observable<{
    dates: string[];
    cases: number[];
    deaths: number[];
    recovered: number[];
  }> {
    return this.http.get<any>(`${this.base}/historical/${encodeURIComponent(country)}?lastdays=${lastdays}`).pipe(
      map((res) => {
        const t = res?.timeline ?? {};
        const toSeries = (obj: Record<string, number> = {}) => {
          const entries = Object.entries(obj).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
          return {
            dates: entries.map(([d]) => d),
            values: entries.map(([, v]) => v),
          };
        };
        const sCases = toSeries(t.cases);
        const sDeaths = toSeries(t.deaths);
        const sRecov  = toSeries(t.recovered);
        // usar las fechas de casos como referencia
        return {
          dates: sCases.dates,
          cases: sCases.values,
          deaths: sDeaths.values,
          recovered: sRecov.values
        };
      })
    );
  }
}
