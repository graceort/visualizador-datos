import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Si tienes estos componentes, importa y usa.
// De lo contrario, deja rutas vacías o crea un Home mínimo.
const routes: Routes = [
  // { path: '', component: HomeComponent },
  // { path: 'dashboard', component: ApiDashboardComponent },
  // { path: 'charts', component: ChartViewComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
