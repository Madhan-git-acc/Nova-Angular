// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser { token: string; email: string; firstName: string; role: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<AuthUser | null>(
    JSON.parse(localStorage.getItem('user') || 'null'));
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, data).pipe(
      tap(u => this.setUser(u)));
  }

  login(data: any) {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, data).pipe(
      tap(u => this.setUser(u)));
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getToken() { return this.userSubject.value?.token; }
  isLoggedIn() { return !!this.userSubject.value; }
  isAdmin() { return this.userSubject.value?.role === 'admin'; }
  private setUser(u: AuthUser) {
    localStorage.setItem('user', JSON.stringify(u));
    this.userSubject.next(u);
  }
}