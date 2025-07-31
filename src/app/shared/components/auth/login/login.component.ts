import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-green-800">Đăng nhập</h2>
          <p class="text-gray-600 mt-2">Chào mừng bạn đã quay trở lại!</p>
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- Email Field -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-semibold text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)}"
            >
            <div *ngIf="loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)" class="text-red-500 text-sm mt-1">
              <div *ngIf="loginForm.get('email')?.errors?.['required']">Email là bắt buộc</div>
              <div *ngIf="loginForm.get('email')?.errors?.['email']">Email không hợp lệ</div>
            </div>
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-semibold text-gray-600 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)}"
            >
            <div *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)" class="text-red-500 text-sm mt-1">
              <div *ngIf="loginForm.get('password')?.errors?.['required']">Mật khẩu là bắt buộc</div>
              <div *ngIf="loginForm.get('password')?.errors?.['minlength']">Mật khẩu phải có ít nhất 6 ký tự</div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loginForm.invalid || loading"
            class="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <span *ngIf="!loading">Đăng nhập</span>
            <span *ngIf="loading">Đang xử lý...</span>
          </button>
          <div *ngIf="errorMsg" class="text-red-500 text-center mt-2">{{ errorMsg }}</div>
        </form>

        <!-- Register Link -->
        <div class="text-center mt-6">
          <span class="text-gray-600">Chưa có tài khoản? </span>
          <a routerLink="/register" class="text-green-600 font-semibold hover:text-green-700">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: { token: string; user: any }) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          this.errorMsg = err.error?.message || 'Đăng nhập thất bại';
          this.loading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
