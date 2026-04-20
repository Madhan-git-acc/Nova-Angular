// services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  
  // Store full cart items and derived count
  private itemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.itemsSubject.asObservable();
  cartCount$ = this.itemsSubject.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );

  constructor(private http: HttpClient) {}

  // Fetch cart from server and update subject
  loadCart(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(items => {
      this.itemsSubject.next(items);
    });
  }

  // Get cart once (for components that need immediate snapshot)
  getCart(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      tap(() => this.loadCart()) // reload after add
    );
  }

  removeItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadCart()) // reload after remove
    );
  }

  clearCart(): void {
    this.itemsSubject.next([]); // clear local state immediately
    // Optionally call backend clear if you have an endpoint
    // this.http.delete(this.apiUrl).subscribe();
  }
}