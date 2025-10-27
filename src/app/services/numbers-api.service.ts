import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NumbersApiService {
  constructor(private http: HttpClient) {}

  add(value: number) {
    return this.http.post<{ total: number }>('/api/numbers/add', { value });
  }

  total() {
    return this.http.get<{ total: number }>('/api/numbers/total');
  }
}
