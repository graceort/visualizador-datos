import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ApiDashboardComponent } from './components/api-dashboard/api-dashboard.component';
import { ChartViewComponent } from './components/chart-view/chart-view.component';

import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    ApiDashboardComponent,
    ChartViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,     // para [(ngModel)] si lo usas en esta feature
    TableModule,     // <p-table>
    ChartModule,     // <p-chart>
    DashboardRoutingModule
  ]
})
export class DashboardModule {}
