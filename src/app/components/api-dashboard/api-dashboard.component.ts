import { Component, OnInit } from '@angular/core';

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
  resumenGlobal = {
    confirmados: 0,
    recuperados: 0,
    fallecidos: 0,
    tasaLetalidad: 0
  };

  rows: CovidRow[] = [];

  ngOnInit(): void {
    // Mock: en producción, reemplazar con ApiService HTTP
    setTimeout(() => {
      const data = {
        global: { confirmados: 1250000, recuperados: 1180000, fallecidos: 36000 },
        detalle: [
          { pais: 'Ecuador',   confirmados: 1140000, recuperados: 1100000, fallecidos: 36000 },
          { pais: 'Perú',      confirmados: 4200000, recuperados: 4100000, fallecidos: 219000 },
          { pais: 'Colombia',  confirmados: 6400000, recuperados: 6270000, fallecidos: 142000 },
          { pais: 'Chile',     confirmados: 5400000, recuperados: 5330000, fallecidos: 64400 }
        ]
      };

      const g = data.global;
      this.resumenGlobal.confirmados = g.confirmados;
      this.resumenGlobal.recuperados = g.recuperados;
      this.resumenGlobal.fallecidos = g.fallecidos;
      this.resumenGlobal.tasaLetalidad = +( (g.fallecidos / g.confirmados) * 100 ).toFixed(2);

      this.rows = data.detalle.map(r => ({
        ...r,
        tasaLetalidad: +( (r.fallecidos / r.confirmados) * 100 ).toFixed(2)
      }));

      this.loading = false;
    }, 400);
  }
}
