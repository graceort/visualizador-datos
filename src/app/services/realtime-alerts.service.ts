import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RealtimeAlertsService {
  private hub?: signalR.HubConnection;
  private _sum$ = new BehaviorSubject<number>(0);
  sum$ = this._sum$.asObservable();

  async connect(): Promise<void> {
    if (this.hub?.state === signalR.HubConnectionState.Connected) return;

    this.hub = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/alerts') // proxificado a la API
      .withAutomaticReconnect()
      .build();

    this.hub.on('sumUpdated', (total: number) => {
      this._sum$.next(total);
      console.log('[SignalR] sumUpdated:', total);
    });

    await this.hub.start();
    console.log('[SignalR] connected');
  }
}
