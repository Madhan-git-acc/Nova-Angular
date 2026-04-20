// services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private countSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart() { return this.http.get<any[]>(this.apiUrl); }

  addToCart(data: any) {
    return this.http.post(this.apiUrl, data).pipe(
      tap(() => this.countSubject.next(this.countSubject.value + 1)));
  }

  removeItem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.countSubject.next(Math.max(0, this.countSubject.value - 1))));
  }

  clearCart() { return this.http.delete(this.apiUrl); }
}