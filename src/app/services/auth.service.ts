import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, LoginForm, RegisterForm } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // URL của API auth của bạn

  constructor(private http: HttpClient) {}

  login(loginData: LoginForm): Observable<{token: string; user: User}> {
    return this.http.post<{token: string; user: User}>(`${this.apiUrl}/login`, loginData);
  }

  register(registerData: RegisterForm): Observable<{token: string; user: User}> {
    return this.http.post<{token: string; user: User}>(`${this.apiUrl}/register`, registerData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
