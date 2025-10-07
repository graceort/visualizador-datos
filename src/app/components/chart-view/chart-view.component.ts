import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {
  covidLineData!: ChartData<'line'>;
  covidLineOptions!: ChartOptions<'line'>;
  pieData!: ChartData<'pie'>;
  pieOptions!: ChartOptions<'pie'>;
  donutData!: ChartData<'doughnut'>;
  donutOptions!: ChartOptions<'doughnut'>;

  ngOnInit(): void {
    // Línea temporal: Hospitalizaciones vs UCI (COVID)
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const hospitalizaciones = [320, 410, 520, 480, 560, 600, 540, 500, 470, 430, 390, 360];
    const uci = [60, 75, 98, 90, 110, 120, 105, 95, 88, 80, 70, 65];

    this.covidLineData = {
      labels: months,
      datasets: [
        { label: 'Hospitalizaciones', data: hospitalizaciones, fill: false, tension: 0.3 },
        { label: 'UCI', data: uci, fill: false, tension: 0.3, borderDash: [6, 6] }
      ]
    };

    this.covidLineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' }, tooltip: { intersect: false, mode: 'index' } },
      scales: { y: { beginAtZero: true } }
    };

    // Pastel: Confirmados / Recuperados / Fallecidos (ejemplo)
    const covidTotals = [1_250_000, 1_180_000, 36_000];
    this.pieData = {
      labels: ['Confirmados', 'Recuperados', 'Fallecidos'],
      datasets: [{ data: covidTotals }]
    };
    this.pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const label = ctx.label ?? '';
              const value = ctx.parsed ?? 0;
              const total = (ctx.dataset.data as number[]).reduce((a,b)=>a+b,0);
              const pct = total ? (value/total*100).toFixed(1) : '0.0';
              return `${label}: ${value.toLocaleString()} (${pct}%)`;
            }
          }
        }
      }
    };

    // Dona: ≥1 dosis / Esquema completo / Refuerzo (en %)
    const vac = [85, 78, 52];
    this.donutData = {
      labels: ['≥1 dosis', 'Esquema completo', 'Refuerzo'],
      datasets: [{ data: vac }]
    };
    this.donutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: { legend: { position: 'bottom' } }
    };
  }
}
