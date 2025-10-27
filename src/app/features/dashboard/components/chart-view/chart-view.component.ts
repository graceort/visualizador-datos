import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {

  // Barras apiladas: meses vs estados
  stackedData: any = {};
  stackedOptions!: ChartOptions<'bar'>;   // non-null assertion

  // Línea: días vs un indicador distinto (p.ej. alertas diarias)
  lineData: any = {};
  lineOptions!: ChartOptions<'line'>;     // non-null assertion

  ngOnInit(): void {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

    // Datos diferentes por estado (barras apiladas)
    const pendientes = [12, 9, 14, 8, 11, 7];
    const aprobados  = [7, 10, 6, 12, 9, 13];
    const enRevision = [4, 5, 3, 6, 5, 4];

    this.stackedData = {
      labels: months,
      datasets: [
        { label: 'Pendiente',   data: pendientes,  backgroundColor: 'rgba(244,67,54,0.7)' },
        { label: 'Aprobado',    data: aprobados,   backgroundColor: 'rgba(76,175,80,0.7)' },
        { label: 'En revisión', data: enRevision,  backgroundColor: 'rgba(33,150,243,0.7)' }
      ]
    };

    this.stackedOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx) => {
              const estado = ctx.dataset.label || 'Estado';
              const valor = (ctx.parsed as any)?.y ?? ctx.parsed;
              return `${estado}: ${valor}`;
            },
            title: (items) => items?.[0]?.label ?? ''
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true }
      }
    };

    // Línea con otra métrica (distinta a la de barras)
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const tendencia = [5, 8, 6, 9, 12, 10, 7];

    this.lineData = {
      labels: days,
      datasets: [
        {
          label: 'Alertas diarias',
          data: tendencia,
          fill: false,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    };

    this.lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx) => {
              const valor = (ctx.parsed as any)?.y ?? ctx.parsed;
              return `Valor: ${valor}`;
            },
            title: (items) => items?.[0]?.label ?? ''
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    };
  }
}
