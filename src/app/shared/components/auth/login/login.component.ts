import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-green-800">Đăng nhập</h2>
          <p class="text-gray-600 mt-2">Chào mừng bạn đã quay trở lại!</p>
        </div>

        <!-- Form -->
        <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
          <!-- Email Field -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-semibold text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="loginData.email"
              #email="ngModel"
              required
              email
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': email.invalid && (email.dirty || email.touched)}"
            >
            <div *ngIf="email.invalid && (email.dirty || email.touched)" class="text-red-500 text-sm mt-1">
              <div *ngIf="email.errors?.['required']">Email là bắt buộc</div>
              <div *ngIf="email.errors?.['email']">Email không hợp lệ</div>
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
              name="password"
              [(ngModel)]="loginData.password"
              #password="ngModel"
              required
              minlength="6"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': password.invalid && (password.dirty || password.touched)}"
            >
            <div *ngIf="password.invalid && (password.dirty || password.touched)" class="text-red-500 text-sm mt-1">
              <div *ngIf="password.errors?.['required']">Mật khẩu là bắt buộc</div>
              <div *ngIf="password.errors?.['minlength']">Mật khẩu phải có ít nhất 6 ký tự</div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loginForm.invalid"
            class="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Đăng nhập
          </button>
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
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form submitted', this.loginData);
    }
  }
}
