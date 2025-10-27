import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AlertsStoreService, EstadoRow } from '../../services/alerts-store.service';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-realtime-demo',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './realtime-demo.component.html',
  styleUrls: ['./realtime-demo.component.scss']
})
export class RealtimeDemoComponent implements OnInit, OnDestroy {
  private store = inject(AlertsStoreService);
  private sub?: Subscription;

  rows: Array<EstadoRow & { recent: boolean; cambio: number }> = [];

  ngOnInit(): void {
    this.sub = this.store.rows$
      .pipe(
        map(rows =>
          rows.map(r => {
            const recent = Date.now() - r.updatedAt < 5000; // 5s resaltado
            const cambio = (r.prev ?? r.valor) !== r.valor ? (r.valor - (r.prev ?? r.valor)) : 0;
            return { ...r, recent, cambio };
          })
        )
      )
      .subscribe(rows => (this.rows = rows));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
