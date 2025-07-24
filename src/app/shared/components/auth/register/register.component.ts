import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg mt-10 mb-10">
        <!-- Header -->
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-green-800">Đăng ký tài khoản</h2>
          <p class="text-gray-600 mt-2">Tạo tài khoản mới chỉ trong vài giây!</p>
        </div>

        <!-- Form -->
        <form #registerForm="ngForm" (ngSubmit)="onSubmit(registerForm)">
          <!-- Name Field -->
          <div class="mb-2.5">
            <label for="name" class="block text-sm font-semibold text-gray-600 mb-2">
              Họ tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="registerData.name"
              #name="ngModel"
              required
              minlength="2"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': name.invalid && (name.dirty || name.touched)}"
            >
            <div *ngIf="name.invalid && (name.dirty || name.touched)" class="text-red-500 text-sm mt-1">
              <div *ngIf="name.errors?.['required']">Họ tên là bắt buộc</div>
              <div *ngIf="name.errors?.['minlength']">Họ tên phải có ít nhất 2 ký tự</div>
            </div>
          </div>

          <!-- Email Field -->
          <div class="mb-2.5">
            <label for="email" class="block text-sm font-semibold text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="registerData.email"
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
          <div class="mb-2.5">
            <label for="password" class="block text-sm font-semibold text-gray-600 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="registerData.password"
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

          <!-- Confirm Password Field -->
          <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-600 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="registerData.confirmPassword"
              #confirmPassword="ngModel"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': confirmPassword.invalid && (confirmPassword.dirty || confirmPassword.touched)}"
            >
            <div *ngIf="password.value !== confirmPassword.value && confirmPassword.dirty" class="text-red-500 text-sm mt-1">
              Mật khẩu xác nhận không khớp
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="registerForm.invalid || (password.value !== confirmPassword.value)"
            class="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Đăng ký
          </button>
        </form>

        <!-- Login Link -->
        <div class="text-center mt-10">
          <span class="text-gray-600">Đã có tài khoản? </span>
          <a routerLink="/login" class="text-green-600 font-semibold hover:text-green-700">Đăng nhập</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onSubmit(form: any) {
    if (form.valid && this.registerData.password === this.registerData.confirmPassword) {
      console.log('Form submitted', this.registerData);
    }
  }
}
