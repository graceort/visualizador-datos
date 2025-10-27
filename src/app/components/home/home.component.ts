import { Component, OnInit } from '@angular/core';
import { RealtimeAlertsService } from '../../services/realtime-alerts.service';
import { NumbersApiService } from '../../services/numbers-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  sum = 0;

  constructor(
    private realtime: RealtimeAlertsService,
    private api: NumbersApiService
  ) {}

  async ngOnInit() {
    await this.realtime.connect();
    this.realtime.sum$.subscribe(total => this.sum = total);

    // inicial: leer total existente
    this.api.total().subscribe(r => this.sum = r.total);
  }

  add(v: number) {
    this.api.add(v).subscribe(); // el sum se actualizará por SignalR
  }
}
