import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

export type EstadoRow = {
  id: number;
  estado: string;   // nombre del estado (p.ej. Antioquia / Pendiente / etc.)
  valor: number;    // valor métrico asociado
  prev?: number;    // valor previo
  updatedAt: number;// timestamp del último cambio
};

@Injectable({ providedIn: 'root' })
export class AlertsStoreService {
  private rowsSubject = new BehaviorSubject<EstadoRow[]>([
    { id: 1, estado: 'Estado A', valor: 120, updatedAt: Date.now() },
    { id: 2, estado: 'Estado B', valor: 95,  updatedAt: Date.now() },
    { id: 3, estado: 'Estado C', valor: 60,  updatedAt: Date.now() },
    { id: 4, estado: 'Estado D', valor: 150, updatedAt: Date.now() }
  ]);
  rows$ = this.rowsSubject.asObservable();

  constructor() {
    // Simula cambios cada 3s en una fila aleatoria (no toca BD real)
    interval(3000).subscribe(() => {
      const current = [...this.rowsSubject.value];
      const idx = Math.floor(Math.random() * current.length);
      const row = { ...current[idx] };
      row.prev = row.valor;
      const delta = Math.floor(Math.random() * 21) - 10; // -10..+10
      row.valor = Math.max(0, row.valor + delta);
      row.updatedAt = Date.now();
      current[idx] = row;
      this.rowsSubject.next(current);
    });
  }
}
