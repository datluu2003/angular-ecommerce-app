import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg mt-10 mb-10">
        <!-- Header -->
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-green-800">Đăng ký tài khoản</h2>
          <p class="text-gray-600 mt-2">Tạo tài khoản mới chỉ trong vài giây!</p>
        </div>

        <!-- Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <!-- Name Field -->
          <div class="mb-2.5">
            <label for="name" class="block text-sm font-semibold text-gray-600 mb-2">
              Họ tên
            </label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': registerForm.get('name')?.invalid && (registerForm.get('name')?.dirty || registerForm.get('name')?.touched)}"
            >
            <div *ngIf="registerForm.get('name')?.invalid && (registerForm.get('name')?.dirty || registerForm.get('name')?.touched)" class="text-red-500 text-sm mt-1">
              <div *ngIf="registerForm.get('name')?.errors?.['required']">Họ tên là bắt buộc</div>
              <div *ngIf="registerForm.get('name')?.errors?.['minlength']">Họ tên phải có ít nhất 2 ký tự</div>
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
              formControlName="email"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': registerForm.get('email')?.invalid && (registerForm.get('email')?.dirty || registerForm.get('email')?.touched)}"
            >
            <div *ngIf="registerForm.get('email')?.invalid && (registerForm.get('email')?.dirty || registerForm.get('email')?.touched)" class="text-red-500 text-sm mt-1">
              <div *ngIf="registerForm.get('email')?.errors?.['required']">Email là bắt buộc</div>
              <div *ngIf="registerForm.get('email')?.errors?.['email']">Email không hợp lệ</div>
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
              formControlName="password"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)}"
            >
            <div *ngIf="registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)" class="text-red-500 text-sm mt-1">
              <div *ngIf="registerForm.get('password')?.errors?.['required']">Mật khẩu là bắt buộc</div>
              <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Mật khẩu phải có ít nhất 6 ký tự</div>
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
              formControlName="confirmPassword"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              [ngClass]="{'border-red-500': (registerForm.get('confirmPassword')?.invalid && (registerForm.get('confirmPassword')?.dirty || registerForm.get('confirmPassword')?.touched)) || registerForm.errors?.['passwordMismatch']}"
            >
            <div *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.dirty" class="text-red-500 text-sm mt-1">
              Mật khẩu xác nhận không khớp
            </div>
            <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required'] && (registerForm.get('confirmPassword')?.dirty || registerForm.get('confirmPassword')?.touched)" class="text-red-500 text-sm mt-1">
              Xác nhận mật khẩu là bắt buộc
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="registerForm.invalid"
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: (res: { token: string; user: any }) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          this.errorMsg = err.error?.message || 'Đăng ký thất bại';
          this.loading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
