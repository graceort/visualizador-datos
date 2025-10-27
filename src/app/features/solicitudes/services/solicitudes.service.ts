import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Solicitud {
  id: number; cliente: string; tipo: string; estado: string;
}

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private base = '/api';
  constructor(private http: HttpClient) {}
  listar() { return this.http.get<Solicitud[]>(`${this.base}/solicitudes`); }
}
