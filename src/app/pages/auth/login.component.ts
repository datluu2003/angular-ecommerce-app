import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-5">Đăng nhập</h2>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <!-- Email -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              [(ngModel)]="email"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
          </div>

          <!-- Password -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
            <input 
              type="password" 
              name="password"
              [(ngModel)]="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        <!-- Register Link -->
        <p class="text-center mt-4">
          Chưa có tài khoản? 
          <a routerLink="/register" class="text-blue-500 hover:text-blue-600">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Login attempt:', { email: this.email, password: this.password });
    // TODO: Implement login logic
    // Tạm thời chuyển hướng về trang chủ
    this.router.navigate(['/']);
  }
}
