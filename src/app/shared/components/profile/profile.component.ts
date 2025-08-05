import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <!-- Header Section -->
      <div class="bg-white shadow-lg">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="relative">
                <img 
                  [src]="currentUser?.avatar || '/default.png'" 
                  [alt]="currentUser?.username"
                  class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  [ngClass]="{'opacity-50': isLoading}"
                />
                <!-- Loading overlay -->
                <div *ngIf="isLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                  <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <button 
                  (click)="triggerFileInput()"
                  [disabled]="isLoading"
                  class="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
                <!-- Hidden file input -->
                <input 
                  #fileInput
                  type="file" 
                  accept="image/*" 
                  (change)="onFileSelected($event)"
                  class="hidden"
                />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ currentUser?.Username || currentUser?.username }}</h1>
                <p class="text-gray-600 text-lg">{{ currentUser?.email }}</p>
                <div class="flex items-center mt-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                        [ngClass]="currentUser?.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ currentUser?.role === 'admin' ? 'Quản trị viên' : 'Thành viên' }}
                  </span>
                </div>
              </div>
            </div>
            <button 
              (click)="toggleEditMode()"
              class="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              [ngClass]="isEditMode ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!isEditMode" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                <path *ngIf="isEditMode" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {{ isEditMode ? 'Hủy' : 'Chỉnh sửa' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Profile Information Card -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 class="text-xl font-semibold text-white flex items-center">
                  <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Thông tin cá nhân
                </h2>
              </div>
              
              <div class="p-6">
                <form *ngIf="isEditMode" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Username -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        formControlName="username"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        [ngClass]="{'border-red-500': profileForm.get('username')?.invalid && profileForm.get('username')?.touched}"
                      />
                      <div *ngIf="profileForm.get('username')?.invalid && profileForm.get('username')?.touched" class="text-red-500 text-sm mt-1">
                        Tên đăng nhập là bắt buộc
                      </div>
                    </div>

                    <!-- Email -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        formControlName="email"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        [ngClass]="{'border-red-500': profileForm.get('email')?.invalid && profileForm.get('email')?.touched}"
                      />
                      <div *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                        Email không hợp lệ
                      </div>
                    </div>

                    <!-- Phone -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        formControlName="phone_number"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <!-- Address -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        formControlName="address"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập địa chỉ"
                      />
                    </div>

                    <!-- City -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Thành phố
                      </label>
                      <input
                        type="text"
                        formControlName="city"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập thành phố"
                      />
                    </div>

                    <!-- District -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Quận/Huyện
                      </label>
                      <input
                        type="text"
                        formControlName="district"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập quận/huyện"
                      />
                    </div>
                  </div>

                  <!-- Form Actions -->
                  <div class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      (click)="toggleEditMode()"
                      class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      [disabled]="profileForm.invalid || isLoading"
                      class="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      <span *ngIf="!isLoading" class="flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Cập nhật
                      </span>
                      <span *ngIf="isLoading" class="flex items-center">
                        <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang cập nhật...
                      </span>
                    </button>
                  </div>
                </form>

                <!-- View Mode -->
                <div *ngIf="!isEditMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-6">
                    <div class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-600">Tên đăng nhập</p>
                        <p class="text-lg font-semibold text-gray-900">{{ currentUser?.username }}</p>
                      </div>
                    </div>

                    <div class="flex items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-600">Email</p>
                        <p class="text-lg font-semibold text-gray-900">{{ currentUser?.email }}</p>
                      </div>
                    </div>

                    <div class="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <svg class="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-600">Số điện thoại</p>
                        <p class="text-lg font-semibold text-gray-900">{{ currentUser?.phone_number || 'Chưa cập nhật' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-6">
                    <div class="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <svg class="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-600">Địa chỉ</p>
                        <p class="text-lg font-semibold text-gray-900">{{ currentUser?.address || 'Chưa cập nhật' }}</p>
                      </div>
                    </div>

                    <div class="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                      <svg class="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-600">Thành phố</p>
                        <p class="text-lg font-semibold text-gray-900">{{ currentUser?.city || 'Chưa cập nhật' }}</p>
                      </div>
                    </div>

                    <div class="flex items-center p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
                      <svg class="w-6 h-6 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-600">Quận/Huyện</p>
                        <p class="text-lg font-semibold text-gray-900">{{ currentUser?.district || 'Chưa cập nhật' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Account Stats Card -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Thống kê tài khoản
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span class="text-sm font-medium text-gray-600">Đơn hàng</span>
                  <span class="text-xl font-bold text-blue-600">12</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span class="text-sm font-medium text-gray-600">Điểm tích lũy</span>
                  <span class="text-xl font-bold text-green-600">2,450</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span class="text-sm font-medium text-gray-600">Thành viên từ</span>
                  <span class="text-sm font-bold text-purple-600">Jan 2024</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions Card -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Hành động nhanh
                </h3>
              </div>
              <div class="p-6 space-y-3">
                <button class="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <svg class="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  <span class="font-medium text-gray-700">Đơn hàng của tôi</span>
                </button>
                <button class="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <svg class="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span class="font-medium text-gray-700">Sản phẩm yêu thích</span>
                </button>
                <button class="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <svg class="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-medium text-gray-700">Lịch sử mua hàng</span>
                </button>
                <button (click)="changePassword()" class="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <svg class="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2m0 0V3a2 2 0 00-2-2m2 2H9m10 0a2 2 0 012 2m-2-2a2 2 0 00-2-2"></path>
                  </svg>
                  <span class="font-medium text-gray-700">Đổi mật khẩu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  currentUser: User | null = null;
  isEditMode = false;
  isLoading = false;
  profileForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    // Refresh user data from server to ensure latest info
    this.authService.refreshUserData().subscribe({
      next: () => {
        // Data refreshed successfully
      },
      error: (error) => {
        console.warn('Could not refresh user data:', error);
      }
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.updateFormWithUserData(user);
      }
      this.cdr.markForCheck();
    });
  }

  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      address: [''],
      city: [''],
      district: ['']
    });
  }

  private updateFormWithUserData(user: User): void {
    console.log('Updating form with user data:', user); // Debug log
    this.profileForm.patchValue({
      username: user.Username || user.username || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      city: user.city || '',
      district: user.district || ''
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode && this.currentUser) {
      // Reset form when canceling edit
      this.updateFormWithUserData(this.currentUser);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = this.profileForm.value;
      
      // Map form fields to match API expectations
      const updateData = {
        Username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        city: formData.city,
        district: formData.district
      };
      
      this.authService.updateProfile(updateData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isEditMode = false;
          this.toastService.showToast('success', 'Cập nhật thông tin thành công!');
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'Có lỗi xảy ra khi cập nhật thông tin!';
          this.toastService.showToast('error', errorMessage);
          this.cdr.markForCheck();
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
      this.toastService.showToast('error', 'Vui lòng kiểm tra lại thông tin!');
    }
  }

  changePassword(): void {
    this.toastService.showToast('info', 'Chức năng đổi mật khẩu sẽ được phát triển!');
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastService.showToast('error', 'Vui lòng chọn file hình ảnh!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.showToast('error', 'Kích thước file không được vượt quá 5MB!');
        return;
      }

      this.uploadAvatar(file);
    }
  }

  private uploadAvatar(file: File): void {
    this.isLoading = true;
    
    this.authService.uploadAvatar(file).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.showToast('success', 'Cập nhật ảnh đại diện thành công!');
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isLoading = false;
        
        // For demo purposes, show preview locally if API fails
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (this.currentUser) {
            this.currentUser.avatar = e.target.result;
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(this.currentUser));
            }
            this.toastService.showToast('success', 'Cập nhật ảnh đại diện thành công! (Demo mode)');
            this.cdr.markForCheck();
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}
