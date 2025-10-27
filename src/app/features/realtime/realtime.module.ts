import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeRoutingModule } from './realtime-routing.module';

// Standalone: se importa, no se declara
import { RealtimeDemoComponent } from './components/realtime-demo/realtime-demo.component';

@NgModule({
  imports: [
    CommonModule,
    RealtimeRoutingModule,
    RealtimeDemoComponent   // 👈 standalone component
  ]
})
export class RealtimeModule {}
