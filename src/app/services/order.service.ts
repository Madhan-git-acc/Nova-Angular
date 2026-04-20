// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}
  placeOrder(data: any) { return this.http.post(this.apiUrl, data); }
  getOrders() { return this.http.get<any[]>(this.apiUrl); }
}