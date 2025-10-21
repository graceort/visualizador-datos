import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';
import { CovidApiService } from '../../services/covid-api.service';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {
  countries = ['Ecuador', 'Peru', 'Colombia', 'Chile'];
  selected = 'Ecuador';

  covidLineData!: ChartData<'line'>;
  covidLineOptions!: ChartOptions<'line'>;
  pieData!: ChartData<'pie'>;
  pieOptions!: ChartOptions<'pie'>;
  donutData!: ChartData<'doughnut'>;
  donutOptions!: ChartOptions<'doughnut'>;
  loading = true;

  constructor(private api: CovidApiService) {}

  ngOnInit(): void {
    this.fetch();
  }

  onCountryChange(): void {
    this.fetch();
  }

  private fetch(): void {
    const country = this.selected;
    this.loading = true;

    forkJoin({
      hist: this.api.getHistorical(country, 180),
      sum:  this.api.getCountry(country)
    }).subscribe(({ hist, sum }) => {
      // Línea: casos vs muertes
      this.covidLineData = {
        labels: hist.dates,
        datasets: [
          { label: 'Casos',   data: hist.cases,  fill: false, tension: 0.25 },
          { label: 'Muertes', data: hist.deaths, fill: false, tension: 0.25, borderDash: [6, 6] }
        ]
      };
      this.covidLineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' }, tooltip: { intersect: false, mode: 'index' } },
        scales: { y: { beginAtZero: true } }
      };

      // Pastel: casos vs recuperados vs fallecidos
      this.pieData = {
        labels: ['Casos', 'Recuperados', 'Fallecidos'],
        datasets: [{ data: [sum?.cases ?? 0, sum?.recovered ?? 0, sum?.deaths ?? 0] }]
      };
      this.pieOptions = {
        responsive: true, maintainAspectRatio: false,
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

      // Dona: activos vs recuperados vs fallecidos
      const active = sum?.active ?? Math.max((sum?.cases ?? 0) - (sum?.recovered ?? 0) - (sum?.deaths ?? 0), 0);
      this.donutData = {
        labels: ['Activos', 'Recuperados', 'Fallecidos'],
        datasets: [{ data: [active, sum?.recovered ?? 0, sum?.deaths ?? 0] }]
      };
      this.donutOptions = {
        responsive: true, maintainAspectRatio: false,
        cutout: '60%',
        plugins: { legend: { position: 'bottom' } }
      };

      this.loading = false;
    }, _ => { this.loading = false; });
  }
}
