import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiDashboardComponent } from './components/api-dashboard/api-dashboard.component';
import { ChartViewComponent } from './components/chart-view/chart-view.component';

const routes: Routes = [
  { path: '', component: ApiDashboardComponent },
  { path: 'chart', component: ChartViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
