import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="admin-users">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý Users</h1>
        <button 
          (click)="showAddUserModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Thêm User</span>
        </button>
      </div>
      
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterUsers()"
              placeholder="Tìm theo tên, email..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select 
              [(ngModel)]="selectedRole"
              (ngModelChange)="filterUsers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select 
              [(ngModel)]="selectedStatus"
              (ngModelChange)="filterUsers()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button 
              (click)="resetFilters()"
              class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img [src]="user.avatar || '/default.png'" [alt]="user.Username" class="h-10 w-10 rounded-full">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.Username }}</div>
                      <div class="text-sm text-gray-500">{{ user.phone_number || 'Chưa có SĐT' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ user.role === 'admin' ? 'Admin' : 'Member' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.createdAt | date:'dd/MM/yyyy' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    (click)="editUser(user)"
                    class="text-blue-600 hover:text-blue-900">
                    Sửa
                  </button>
                  <button 
                    (click)="deleteUser(user._id!)"
                    class="text-red-600 hover:text-red-900">
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-6 py-3 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} đến {{ Math.min(currentPage * itemsPerPage, totalItems) }} trong {{ totalItems }} kết quả
            </div>
            <div class="flex space-x-2">
              <button 
                [disabled]="currentPage === 1"
                (click)="changePage(currentPage - 1)"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                Trước
              </button>
              <span class="px-3 py-1 text-sm">{{ currentPage }}</span>
              <button 
                [disabled]="currentPage >= totalPages"
                (click)="changePage(currentPage + 1)"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add/Edit User Modal -->
      <div *ngIf="showAddUserModal || showEditUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 class="text-lg font-semibold mb-4">
            {{ showAddUserModal ? 'Thêm User Mới' : 'Chỉnh sửa User' }}
          </h2>
          
          <form [formGroup]="userForm" (ngSubmit)="saveUser()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <input 
                  type="text" 
                  formControlName="Username"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  formControlName="phone_number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  formControlName="role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div *ngIf="showAddUserModal">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input 
                  type="password" 
                  formControlName="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Hủy
              </button>
              <button 
                type="submit"
                [disabled]="userForm.invalid"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                {{ showAddUserModal ? 'Thêm' : 'Cập nhật' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  
  users: any[] = [];
  filteredUsers: any[] = [];
  
  // Filters
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  
  // Modals
  showAddUserModal = false;
  showEditUserModal = false;
  currentEditUser: any = null;
  
  // Form
  userForm: FormGroup;
  
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      role: ['member', Validators.required],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    // Mock data - replace with actual API call
    this.users = [
      {
        _id: '1',
        Username: 'admin',
        email: 'admin@gmail.com',
        phone_number: '0123456789',
        role: 'admin',
        avatar: '',
        createdAt: new Date()
      },
      {
        _id: '2', 
        Username: 'user1',
        email: 'user1@gmail.com',
        phone_number: '0987654321',
        role: 'member',
        avatar: '',
        createdAt: new Date()
      }
    ];
    
    this.totalItems = this.users.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.filterUsers();
  }
  
  filterUsers(): void {
    let filtered = [...this.users];
    
    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(user => 
        user.Username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    // Role filter
    if (this.selectedRole) {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }
    
    // Pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUsers = filtered.slice(startIndex, endIndex);
    
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.filterUsers();
  }
  
  changePage(page: number): void {
    this.currentPage = page;
    this.filterUsers();
  }
  
  editUser(user: any): void {
    this.currentEditUser = user;
    this.userForm.patchValue({
      Username: user.Username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role
    });
    this.showEditUserModal = true;
  }
  
  deleteUser(userId: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa user này?')) {
      // Call delete API
      this.toastService.showToast('success', 'Xóa user thành công!');
      this.loadUsers();
    }
  }
  
  saveUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      
      if (this.showAddUserModal) {
        // Add new user
        console.log('Adding new user:', userData);
        this.toastService.showToast('success', 'Thêm user thành công!');
      } else {
        // Update existing user
        console.log('Updating user:', userData);
        this.toastService.showToast('success', 'Cập nhật user thành công!');
      }
      
      this.closeModal();
      this.loadUsers();
    }
  }
  
  closeModal(): void {
    this.showAddUserModal = false;
    this.showEditUserModal = false;
    this.currentEditUser = null;
    this.userForm.reset({
      Username: '',
      email: '',
      phone_number: '',
      role: 'member',
      password: ''
    });
  }
  
  // Helper for template
  Math = Math;
}
