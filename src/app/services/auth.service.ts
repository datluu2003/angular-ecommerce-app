import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginForm, RegisterForm, AuthResponse, DecodedToken } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Unified API URL - sử dụng cùng một base URL
  private authApiUrl = 'http://localhost:8080/api/auth';
  private userApiUrl = 'http://localhost:8080/api/users'; // Thay đổi từ 3000 -> 8080
  
  // State management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  login(loginData: LoginForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/login`, loginData).pipe(
      tap(response => {
        if (response.status && response.data) {
          this.setAuthData(response.data.token, response.data.user);
          this.redirectUserByRole(response.data.user.role);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  register(registerData: RegisterForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authApiUrl}/register`, registerData).pipe(
      tap(response => {
        if (response.status && response.data) {
          this.setAuthData(response.data.token, response.data.user);
          this.redirectUserByRole(response.data.user.role);
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = decoded.exp > currentTime;
      
      // Debug log
      console.log('Token check:', {
        currentTime,
        expTime: decoded.exp,
        isValid,
        timeLeft: decoded.exp - currentTime
      });
      
      if (!isValid) {
        console.log('Token expired, logging out...');
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token decode error:', error);
      this.logout();
      return false;
    }
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    const token = localStorage.getItem('token');
    
    // Debug log
    if (token) {
      console.log('Token found:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found in localStorage');
    }
    
    return token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  updateProfile(profileData: any): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Sử dụng userApiUrl thay vì hardcode
    return this.http.put(`${this.userApiUrl}/${currentUser._id}`, profileData)
      .pipe(
        tap((response: any) => {
          if (response.status && response.data) {
            const updatedUser = response.data;
            if (this.isBrowser()) {
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            this.currentUserSubject.next(updatedUser);
          }
        }),
        catchError(error => {
          console.error('Update profile error:', error);
          if (error.status === 401) {
            this.logout();
          }
          throw error;
        })
      );
  }

  uploadAvatar(file: File): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(`${this.userApiUrl}/${currentUser._id}/avatar`, formData)
      .pipe(
        tap((response: any) => {
          if (response.status && response.data) {
            const updatedUser = { ...currentUser, avatar: response.data.avatar };
            if (this.isBrowser()) {
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            this.currentUserSubject.next(updatedUser);
          }
        }),
        catchError(error => {
          console.error('Upload avatar error:', error);
          if (error.status === 401) {
            this.logout();
          }
          throw error;
        })
      );
  }

  refreshUserData(): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get(`${this.userApiUrl}/${currentUser._id}/profile`)
      .pipe(
        tap((response: any) => {
          if (response.status && response.data) {
            const updatedUser = response.data;
            if (this.isBrowser()) {
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            this.currentUserSubject.next(updatedUser);
          }
        }),
        catchError(error => {
          console.error('Refresh user data error:', error);
          if (error.status === 401) {
            this.logout();
          }
          throw error;
        })
      );
  }

  isMember(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'member';
  }

  decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      throw new Error('Invalid token');
    }
  }

  // Method để check token validity trước khi gửi request
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('[isTokenValid] Không có token');
      return false;
    }
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = decoded.exp > currentTime;
      console.log('[isTokenValid] Token:', token.substring(0, 20) + '...');
      console.log('[isTokenValid] Decoded:', decoded);
      console.log('[isTokenValid] currentTime:', currentTime, 'exp:', decoded.exp, 'isValid:', isValid, 'timeLeft:', decoded.exp - currentTime);
      return isValid;
    } catch (err) {
      console.log('[isTokenValid] Decode lỗi:', err);
      return false;
    }
  }

  private setAuthData(token: string, user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    
    console.log('Auth data set:', { user: user.email, role: user.role });
  }

  private checkAuthStatus(): void {
    if (!this.isBrowser()) return;
    
    const token = this.getToken();
    const userStr = localStorage.getItem('user');
    
    console.log('Checking auth status:', { hasToken: !!token, hasUser: !!userStr });
    
    if (token && userStr) {
      try {
        // Check if token is still valid
        if (this.isTokenValid()) {
          const user = JSON.parse(userStr);
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
          console.log('User restored from storage:', user.email);
        } else {
          console.log('Token expired during auth check');
          this.logout();
        }
      } catch (error) {
        console.error('Error restoring user session:', error);
        this.logout();
      }
    } else {
      console.log('No valid session found');
      this.currentUserSubject.next(null);
      this.isLoggedInSubject.next(false);
    }
  }

  private redirectUserByRole(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/shop']);
    }
  }
}