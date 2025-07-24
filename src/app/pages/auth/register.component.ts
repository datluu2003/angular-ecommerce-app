import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-5">Đăng ký tài khoản</h2>
        
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <!-- Name -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Họ tên</label>
            <input 
              type="text" 
              name="name"
              [(ngModel)]="name"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
          </div>

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
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
            <input 
              type="password" 
              name="password"
              [(ngModel)]="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
          </div>

          <!-- Confirm Password -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            >
          </div>

          <!-- Submit Button -->
          <button 
            type="submit"
            class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Đăng ký
          </button>
        </form>

        <!-- Login Link -->
        <p class="text-center mt-4">
          Đã có tài khoản? 
          <a routerLink="/login" class="text-blue-500 hover:text-blue-600">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    console.log('Register attempt:', {
      name: this.name,
      email: this.email,
      password: this.password
    });
    
    // TODO: Implement register logic
    // Tạm thời chuyển hướng về trang đăng nhập
    this.router.navigate(['/login']);
  }
}
