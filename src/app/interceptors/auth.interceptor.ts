import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for login/register endpoints
    const skipAuth = this.shouldSkipAuth(req.url);
    
    if (skipAuth) {
      // ...existing code...
      return next.handle(req);
    }

    // Check if token is valid before adding to request
    const token = this.authService.getToken();
    let authReq = req;
    
    if (token && this.authService.isTokenValid()) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    } else if (token && !this.authService.isTokenValid()) {
      // Token exists but expired
      this.authService.logout();
      return throwError(() => new Error('Token expired'));
    } else {
      // ...existing code...
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          // Don't show toast for login requests
          if (!this.shouldSkipAuth(error.url || '')) {
            this.toastService.showToast('error', 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            this.authService.logout();
          }
        } else if (error.status === 403) {
          this.toastService.showToast('error', 'Bạn không có quyền thực hiện hành động này.');
        } else if (error.status === 0) {
          // Network error or CORS
          this.toastService.showToast('error', 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.');
        } else if (error.status >= 500) {
          this.toastService.showToast('error', 'Lỗi server. Vui lòng thử lại sau.');
        } else if (error.status === 400) {
          // Bad request - might have specific error message from server
          const errorMessage = error.error?.message || 'Dữ liệu không hợp lệ.';
          this.toastService.showToast('error', errorMessage);
        }
        
        return throwError(() => error);
      })
    );
  }

  private shouldSkipAuth(url: string): boolean {
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
      '/public',
      '/assets'
    ];
    
    return publicEndpoints.some(endpoint => url.includes(endpoint));
  }
}