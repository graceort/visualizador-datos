import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealtimeDemoComponent } from './components/realtime-demo/realtime-demo.component';

const routes: Routes = [
  { path: '', component: RealtimeDemoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealtimeRoutingModule {}
