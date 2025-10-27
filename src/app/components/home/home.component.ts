import { Component, OnInit } from '@angular/core';
import 'chart.js/auto';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentYear = new Date().getFullYear();

  stackedData: any = {};
  stackedOptions!: ChartOptions<'bar'>;

  lineData: any = {};
  lineOptions!: ChartOptions<'line'>;

  ngOnInit(): void {
    // Barras apiladas
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const pendientes = [120,90,140,80,110,70,95,88,120,105,98,86];
    const aprobados  = [70,100,60,120,90,130,125,118,110,115,120,130];
    const enRev      = [40,50,30,60,50,40,42,35,38,40,41,39];

    this.stackedData = {
      labels: months,
      datasets: [
        { label:'Pendiente',   data: pendientes,  backgroundColor: 'rgba(244,67,54,0.7)' },
        { label:'Aprobado',    data: aprobados,   backgroundColor: 'rgba(76,175,80,0.7)' },
        { label:'En revisión', data: enRev,       backgroundColor: 'rgba(33,150,243,0.7)' }
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
            title: (items) => items?.[0]?.label ?? '',
            label: (ctx) => `${ctx.dataset.label}: ${(ctx.parsed as any)?.y ?? ctx.parsed}`
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true }
      }
    };

    // Línea (métrica distinta)
    const days = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const tendencia = [5,8,6,9,12,10,7];

    this.lineData = {
      labels: days,
      datasets: [{
        label: 'Alertas diarias',
        data: tendencia,
        fill: false,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3
      }]
    };

    this.lineOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          enabled: true,
          callbacks: {
            title: (items) => items?.[0]?.label ?? '',
            label: (ctx) => `Valor: ${(ctx.parsed as any)?.y ?? ctx.parsed}`
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
