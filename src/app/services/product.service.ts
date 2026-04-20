// services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}

  getAll(filters: any = {}) {
    let params = new HttpParams();
    Object.keys(filters).forEach(k => {
      if (filters[k] !== null && filters[k] !== undefined)
        params = params.set(k, filters[k]);
    });
    return this.http.get<any>(this.apiUrl, { params });
  }

  getById(id: number) { return this.http.get<any>(`${this.apiUrl}/${id}`); }
  getFeatured() { return this.http.get<any[]>(`${this.apiUrl}/featured`); }
}