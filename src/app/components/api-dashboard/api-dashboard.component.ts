import { Component, OnInit } from '@angular/core';
import { CovidApiService } from '../../services/covid-api.service';
import { forkJoin } from 'rxjs';

interface CovidRow {
  pais: string;
  confirmados: number;
  recuperados: number;
  fallecidos: number;
  tasaLetalidad: number; // %
}

@Component({
  selector: 'app-api-dashboard',
  templateUrl: './api-dashboard.component.html',
  styleUrls: ['./api-dashboard.component.scss']
})
export class ApiDashboardComponent implements OnInit {
  loading = true;

  resumenGlobal = { confirmados: 0, recuperados: 0, fallecidos: 0, tasaLetalidad: 0 };
  rows: CovidRow[] = [];

  constructor(private api: CovidApiService) {}

  ngOnInit(): void {
    // países de ejemplo (ajusta a conveniencia)
    const paises = ['Ecuador', 'Peru', 'Colombia', 'Chile'];

    forkJoin({
      global: this.api.getGlobal(),
      countries: this.api.getCountries()
    }).subscribe(({ global, countries }) => {
      // global
      this.resumenGlobal.confirmados = global?.cases ?? 0;
      this.resumenGlobal.recuperados = global?.recovered ?? 0;
      this.resumenGlobal.fallecidos  = global?.deaths ?? 0;
      this.resumenGlobal.tasaLetalidad = +( (this.resumenGlobal.fallecidos / Math.max(this.resumenGlobal.confirmados, 1)) * 100 ).toFixed(2);

      // tabla: filtrar países seleccionados
      const mapa = new Map<string, any>(
        countries.map(c => [String(c.country).toLowerCase(), c])
      );
      this.rows = paises.map(nombre => {
        const c = mapa.get(nombre.toLowerCase());
        const confirmados = c?.cases ?? 0;
        const recuperados = c?.recovered ?? 0;
        const fallecidos  = c?.deaths ?? 0;
        return {
          pais: nombre,
          confirmados,
          recuperados,
          fallecidos,
          tasaLetalidad: +((fallecidos / Math.max(confirmados, 1)) * 100).toFixed(2)
        };
      });

      this.loading = false;
    }, _ => { this.loading = false; });
  }
}
