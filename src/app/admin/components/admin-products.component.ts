import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductService } from '../../services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  template: `
    <div class="admin-products w-full px-2 md:px-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Quản lý Sản phẩm</h1>
      
      <!-- Search Bar -->
      <div class="mb-4 flex justify-between items-center">
        <div class="flex-1 max-w-md">
          <input 
            [value]="searchTerm"
            (input)="onSearchTermChange($event)"
            placeholder="Tìm kiếm sản phẩm..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button 
          (click)="showAddModal = true" 
          class="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Thêm sản phẩm
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead class="bg-gray-50">
            <tr>
              <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Ảnh</th>
              <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Tên</th>
              <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Danh mục</th>
              <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Giá</th>
              <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Số lượng</th>
              <th class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Trạng thái</th>
              <th class="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of filteredProducts | paginate: { itemsPerPage: itemsPerPage, currentPage: currentPage }" 
                class="hover:bg-gray-50 transition-colors duration-150">
              <td class="border border-gray-200 px-4 py-3">
                <img [src]="getImageUrl(product.image)" 
                     alt="{{ product.name }}" 
                     class="w-12 h-12 object-cover rounded-lg border shadow-sm" 
                     (error)="onImageError($event)" />
              </td>
              <td class="border border-gray-200 px-4 py-3 font-medium">{{ product.name }}</td>
              <td class="border border-gray-200 px-4 py-3">{{ product.category?.name }}</td>
              <td class="border border-gray-200 px-4 py-3 text-green-600 font-semibold">
                {{ product.price | number:'1.0-0' }}đ
              </td>
              <td class="border border-gray-200 px-4 py-3">{{ product.quantity }}</td>
              <td class="border border-gray-200 px-4 py-3">
                <span class="px-2 py-1 rounded text-xs font-medium"
                      [class]="getStatusClass(product.status)">
                  {{ product.status }}
                </span>
              </td>
              <td class="border border-gray-200 px-4 py-3 text-center">
                <button (click)="editProduct(product)" 
                        class="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-150 mr-2">
                  Sửa
                </button>
                <button (click)="deleteProduct(product)" 
                        class="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors duration-150">
                  Xóa
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredProducts.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-500 bg-gray-50">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8-5 5-5-5"></path>
                  </svg>
                  Không có sản phẩm nào.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Page Info - Above Pagination -->
      <div class="flex justify-between items-center mt-4 mb-2">
        <div class="text-sm text-gray-600">
          Hiển thị {{ getStartIndex() }}-{{ getEndIndex() }} trong tổng số {{ filteredProducts.length }} sản phẩm
        </div>
        <div class="text-sm text-gray-500">
          Trang {{ currentPage }} / {{ getTotalPages() }}
        </div>
      </div>

      <!-- Custom Pagination -->
      <div class="flex justify-center items-center mb-8">
        <div class="flex items-center space-x-1">
          <!-- Previous Button -->
          <button 
            [disabled]="currentPage <= 1"
            (click)="currentPage = currentPage - 1; applyFilters()"
            class="pagination-btn pagination-arrow"
            [class.disabled]="currentPage <= 1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <!-- Page Numbers -->
          <ng-container *ngFor="let page of getVisiblePages()">
            <button 
              *ngIf="page !== '...'"
              (click)="currentPage = +page; applyFilters()"
              [class.active]="currentPage === +page"
              class="pagination-btn pagination-number">
              {{ page }}
            </button>
            <span *ngIf="page === '...'" class="pagination-dots">...</span>
          </ng-container>

          <!-- Next Button -->
          <button 
            [disabled]="currentPage >= getTotalPages()"
            (click)="currentPage = currentPage + 1; applyFilters()"
            class="pagination-btn pagination-arrow"
            [class.disabled]="currentPage >= getTotalPages()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal thêm sản phẩm - IMPROVED -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Thêm sản phẩm mới
            </h2>
            <button (click)="closeAddModal()" class="text-white hover:text-gray-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form [formGroup]="addProductForm" (ngSubmit)="addProduct()" class="p-6">
              <!-- Two Column Layout -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="text-red-500">*</span> Tên sản phẩm
                    </label>
                    <input formControlName="name" placeholder="Nhập tên sản phẩm" class="form-input" />
                    <div *ngIf="addProductForm.get('name')?.invalid && addProductForm.get('name')?.touched" class="text-xs text-red-500 mt-1">
                      Tên sản phẩm là bắt buộc.
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="text-red-500">*</span> Danh mục
                    </label>
                    <select formControlName="category" class="form-input">
                      <option value="">Chọn danh mục</option>
                      <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
                    </select>
                    <div *ngIf="addProductForm.get('category')?.invalid && addProductForm.get('category')?.touched" class="text-xs text-red-500 mt-1">
                      Danh mục là bắt buộc.
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                      <label class="form-label">
                        <span class="text-red-500">*</span> Giá (đ)
                      </label>
                      <input formControlName="price" type="number" min="0" placeholder="0" class="form-input" />
                      <div *ngIf="addProductForm.get('price')?.invalid && addProductForm.get('price')?.touched" class="text-xs text-red-500 mt-1">
                        <span *ngIf="addProductForm.get('price')?.errors?.['required']">Giá sản phẩm là bắt buộc.</span>
                        <span *ngIf="addProductForm.get('price')?.errors?.['min']">Giá sản phẩm phải >= 0.</span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">
                        <span class="text-red-500">*</span> Số lượng
                      </label>
                      <input formControlName="stock" type="number" min="0" placeholder="0" class="form-input" />
                      <div *ngIf="addProductForm.get('stock')?.invalid && addProductForm.get('stock')?.touched" class="text-xs text-red-500 mt-1">
                        <span *ngIf="addProductForm.get('stock')?.errors?.['required']">Số lượng là bắt buộc.</span>
                        <span *ngIf="addProductForm.get('stock')?.errors?.['min']">Số lượng phải >= 0.</span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="text-red-500">*</span> Trạng thái
                    </label>
                    <select formControlName="status" class="form-input">
                      <option value="">Chọn trạng thái</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngừng hoạt động</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="draft">Nháp</option>
                    </select>
                    <div *ngIf="addProductForm.get('status')?.invalid && addProductForm.get('status')?.touched" class="text-xs text-red-500 mt-1">
                      Trạng thái là bắt buộc.
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="form-label">Ảnh sản phẩm</label>
                    <div class="image-upload-container">
                      <input type="file" (change)="onImageSelect($event)" 
                             accept="image/*" class="hidden" #fileInput />
                      <div class="image-upload-area" (click)="fileInput.click()">
                        <div *ngIf="!newProduct.imagePreview" class="upload-placeholder">
                          <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          <p class="text-sm text-gray-500">Nhấn để chọn ảnh</p>
                        </div>
                        <div *ngIf="newProduct.imagePreview" class="relative">
                          <img [src]="newProduct.imagePreview" alt="Preview" 
                               class="w-full h-32 object-cover rounded-lg" />
                          <button type="button" (click)="removeImage($event)" 
                                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Mô tả sản phẩm</label>
                    <textarea formControlName="description" placeholder="Nhập mô tả chi tiết sản phẩm..." class="form-input resize-none" rows="4"></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
            <button type="button" (click)="closeAddModal()" 
                    class="btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Hủy
            </button>
            <button type="submit" form="addProductForm" (click)="addProduct()" 
                    class="btn-primary" [disabled]="isAdding">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span *ngIf="isAdding" class="animate-pulse">Đang lưu...</span>
              <span *ngIf="!isAdding">Lưu sản phẩm</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal sửa sản phẩm - IMPROVED -->
      <div *ngIf="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Chỉnh sửa sản phẩm
            </h2>
            <button (click)="closeEditModal()" class="text-white hover:text-gray-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form [formGroup]="editProductForm" (ngSubmit)="updateProduct()" class="p-6">
              <!-- Two Column Layout -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="text-red-500">*</span> Tên sản phẩm
                    </label>
                    <input formControlName="name" placeholder="Tên sản phẩm" class="form-input" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="text-red-500">*</span> Danh mục
                    </label>
                    <select formControlName="category" class="form-input">
                      <option value="">Chọn danh mục</option>
                      <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                      <label class="form-label">
                        <span class="text-red-500">*</span> Giá (đ)
                      </label>
                      <input formControlName="price" type="number" placeholder="Giá" class="form-input" />
                    </div>

                    <div class="form-group">
                      <label class="form-label">
                        <span class="text-red-500">*</span> Số lượng
                      </label>
                      <input formControlName="quantity" type="number" placeholder="Số lượng" class="form-input" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="text-red-500">*</span> Trạng thái
                    </label>
                    <select formControlName="status" class="form-input">
                      <option value="">Chọn trạng thái</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngừng hoạt động</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="draft">Nháp</option>
                    </select>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-4">
                  <div class="form-group">
                    <label class="form-label">Ảnh hiện tại</label>
                    <div class="current-image-container mb-2">
                      <img [src]="getImageUrl(selectedProduct.image)" 
                           alt="Current image" 
                           class="w-full h-32 object-cover rounded-lg border-2 border-gray-200" />
                    </div>
                    <label class="form-label">Chọn ảnh mới</label>
                    <input type="file" (change)="onEditImageSelect($event)" accept="image/*" class="w-full px-3 py-2 border rounded" />
                    <div *ngIf="selectedProduct.imagePreview" class="mt-2">
                      <img [src]="selectedProduct.imagePreview" alt="Preview" class="w-full h-32 object-cover rounded-lg border" />
                      <button type="button" (click)="removeEditImage($event)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Mô tả sản phẩm</label>
                    <textarea formControlName="description" placeholder="Mô tả chi tiết sản phẩm..." class="form-input resize-none" rows="4"></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
            <button type="button" (click)="closeEditModal()" 
                    class="btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Hủy
            </button>
            <button type="submit" (click)="updateProduct()" 
                    class="btn-primary bg-orange-500 hover:bg-orange-600" [disabled]="isUpdating">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    /* Custom Pagination Styles */
    .pagination-btn {
      @apply px-3 py-2 text-sm font-medium transition-all duration-200 border border-gray-300 bg-white text-gray-700;
    }
    
    .pagination-btn:hover:not(.disabled) {
      @apply bg-blue-50 border-blue-300 text-blue-600;
    }
    
    .pagination-arrow {
      @apply rounded-l-lg rounded-r-lg flex items-center justify-center w-10 h-10;
    }
    
    .pagination-number {
      @apply rounded-lg min-w-[40px] h-10 flex items-center justify-center;
    }
    
    .pagination-number.active {
      @apply bg-blue-600 border-blue-600 text-white font-semibold shadow-md;
    }
    
    .pagination-btn.disabled {
      @apply opacity-50 cursor-not-allowed bg-gray-100 text-gray-400;
    }
    
    .pagination-dots {
      @apply px-3 py-2 text-gray-500 font-medium;
    }
    
    /* Table Enhancements */
    .admin-products table {
      border-spacing: 0;
    }
    
    .status-active {
      @apply bg-green-100 text-green-800;
    }
    
    .status-inactive {
      @apply bg-red-100 text-red-800;
    }
    
    .status-pending {
      @apply bg-yellow-100 text-yellow-800;
    }
    
    .status-draft {
      @apply bg-gray-100 text-gray-800;
    }

    /* Form Styles */
    .form-group {
      @apply space-y-2;
    }

    .form-label {
      @apply block text-sm font-semibold text-gray-700;
    }

    .form-input {
      @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white;
    }

    .form-input:focus {
      @apply shadow-md;
    }

    /* Button Styles */
    .btn-primary {
      @apply bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center shadow-md hover:shadow-lg;
    }

    .btn-secondary {
      @apply bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center;
    }

    /* Image Upload Styles */
    .image-upload-container {
      @apply w-full;
    }

    .image-upload-area {
      @apply w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200;
    }

    .upload-placeholder {
      @apply flex flex-col items-center justify-center text-center;
    }

    .current-image-container {
      @apply w-full;
    }

    /* Modal Improvements */
    .modal-backdrop {
      backdrop-filter: blur(4px);
    }
    
    /* Responsive improvements */
    /* Responsive improvements: dùng CSS thuần thay vì @apply để tránh lỗi Tailwind */
    @media (max-width: 768px) {
      .grid.grid-cols-1.lg\:grid-cols-2 {
        grid-template-columns: 1fr !important;
      }
    }

    /* Scrollbar styling */
    .overflow-y-auto {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e0 #f7fafc;
    }

    .overflow-y-auto::-webkit-scrollbar {
      width: 6px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
      background: #f7fafc;
      border-radius: 3px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background: #a0aec0;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminProductsComponent implements OnInit {
  // Xử lý sự kiện tìm kiếm sản phẩm
  onSearchTermChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.value || '';
    this.searchTerm = value;
    this.currentPage = 1;
    this.applyFilters();
  }
  addProductForm!: FormGroup;
  editProductForm!: FormGroup;
  onEditImageSelect(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProduct.imagePreview = e.target.result;
        this.selectedProduct.newImage = file;
      };
      reader.readAsDataURL(file);
    }
  }

  removeEditImage(event?: any) {
    this.selectedProduct.imagePreview = null;
    this.selectedProduct.newImage = null;
    if (event) event.stopPropagation();
  }
  isAdding = false;
  isUpdating = false;
  editProduct(product: any): void {
    // Gọi API lấy chi tiết sản phẩm qua slug để bảo mật id
    this.productService.getProductBySlug(product.slug).subscribe({
      next: (res: any) => {
        const prod = res.data || res;
        this.selectedProduct = {
          _id: prod._id,
          name: prod.name ?? '',
          category: prod.category?._id ?? prod.category ?? '',
          price: prod.price ?? 0,
          quantity: prod.quantity ?? 0,
          status: prod.status ?? '',
          image: Array.isArray(prod.image) ? prod.image[0] : prod.image || '',
          description: prod.description ?? '',
        };
        // Đồng bộ dữ liệu vào form sửa
        this.editProductForm.patchValue({
          name: this.selectedProduct.name,
          category: this.selectedProduct.category,
          price: this.selectedProduct.price,
          quantity: this.selectedProduct.quantity,
          status: this.selectedProduct.status,
          description: this.selectedProduct.description,
          image: this.selectedProduct.image
        });
        this.showEditModal = true;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Lỗi khi lấy chi tiết sản phẩm!');
      }
    });
  }

  deleteProduct(product: any): void {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) return;
    this.productService.deleteProduct(product._id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p._id !== product._id);
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[deleteProduct] error:', err);
        let msg = 'Lỗi khi xóa sản phẩm!';
        if (err?.error?.message) msg += '\n' + err.error.message;
        if (err?.error?.error) msg += '\n' + JSON.stringify(err.error.error);
        alert(msg);
      }
    });
  }

  addProduct(): void {
    if (this.isAdding) return;
    if (this.addProductForm.invalid) {
      this.addProductForm.markAllAsTouched();
      return;
    }
    this.isAdding = true;
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('category', this.newProduct.category);
    formData.append('price', this.newProduct.price);
    formData.append('quantity', this.newProduct.stock ?? this.newProduct.quantity ?? 0);
    formData.append('status', this.newProduct.status);
    formData.append('description', this.newProduct.description ?? '');
    if (this.newProduct.image) {
      formData.append('image', this.newProduct.image);
    }
    this.productService.createProduct(formData).subscribe({
      next: (res) => {
        const prod = res.data;
        prod.image = Array.isArray(prod.image) ? prod.image[0] : prod.image || 'assets/default.png';
        prod.quantity = prod.quantity ?? prod.stock ?? 0;
        prod.status = prod.status ?? '';
        prod.category = prod.category ?? null;
        this.products.unshift(prod);
        this.showAddModal = false;
        this.resetNewProduct();
        this.applyFilters();
        this.isAdding = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let msg = 'Lỗi khi thêm sản phẩm!';
        if (err?.error?.message) msg += '\n' + err.error.message;
        if (err?.error?.error) msg += '\n' + JSON.stringify(err.error.error);
        // Không alert khi lỗi validate phía client
        this.isAdding = false;
      }
    });
  }

  updateProduct(): void {
    if (!this.selectedProduct?._id || this.isUpdating) return;
    this.isUpdating = true;
    if (this.selectedProduct.newImage) {
      const formData = new FormData();
      formData.append('name', this.selectedProduct.name);
      formData.append('category', typeof this.selectedProduct.category === 'string' ? this.selectedProduct.category : this.selectedProduct.category?._id);
      formData.append('price', this.selectedProduct.price);
      formData.append('quantity', this.selectedProduct.quantity);
      formData.append('status', this.selectedProduct.status);
      formData.append('description', this.selectedProduct.description ?? '');
      formData.append('image', this.selectedProduct.newImage);
      this.productService.updateProduct(this.selectedProduct._id, formData).subscribe({
        next: (res) => {
          const prod = res.data;
          prod.image = Array.isArray(prod.image) ? prod.image[0] : prod.image || 'assets/default.png';
          prod.quantity = prod.quantity ?? prod.stock ?? 0;
          prod.status = prod.status ?? '';
          prod.category = prod.category ?? null;
          const idx = this.products.findIndex(p => p._id === prod._id);
          if (idx > -1) this.products[idx] = prod;
          this.showEditModal = false;
          this.selectedProduct = null;
          this.applyFilters();
          this.cdr.detectChanges();
          this.isUpdating = false;
        },
        error: () => { alert('Lỗi khi cập nhật sản phẩm!'); this.isUpdating = false; }
      });
    } else {
      const productToUpdate = {
        ...this.selectedProduct,
        category: typeof this.selectedProduct.category === 'string' ? 
          this.categories.find(c => c._id === this.selectedProduct.category) : this.selectedProduct.category
      };
      this.productService.updateProduct(this.selectedProduct._id, productToUpdate).subscribe({
        next: (res) => {
          const prod = res.data;
          prod.image = Array.isArray(prod.image) ? prod.image[0] : prod.image || 'assets/default.png';
          prod.quantity = prod.quantity ?? prod.stock ?? 0;
          prod.status = prod.status ?? '';
          prod.category = prod.category ?? null;
          const idx = this.products.findIndex(p => p._id === prod._id);
          if (idx > -1) this.products[idx] = prod;
          this.showEditModal = false;
          this.selectedProduct = null;
          this.applyFilters();
          this.cdr.detectChanges();
          this.isUpdating = false;
        },
        error: () => { alert('Lỗi khi cập nhật sản phẩm!'); this.isUpdating = false; }
      });
    }
  }
  resetNewProduct(): void {
    this.newProduct = { name: '', category: '', price: 0, quantity: 0, status: '', image: '', description: '' };
  }
  // Các hàm bổ sung để Angular không báo lỗi template
  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  getImageUrl(img: any): string {
    if (!img) return 'assets/default.png';
    if (typeof img === 'string' && img.startsWith('[')) {
      try {
        const arr = JSON.parse(img);
        if (Array.isArray(arr) && arr.length > 0) return arr[0];
      } catch { return 'assets/default.png'; }
    }
    if (Array.isArray(img)) return img[0] || 'assets/default.png';
    return img;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default.png';
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'active':
      case 'hoạt động':
      case 'có sẵn':
        return 'status-active';
      case 'inactive':
      case 'ngừng hoạt động':
      case 'hết hàng':
        return 'status-inactive';
      case 'pending':
      case 'chờ duyệt':
        return 'status-pending';
      case 'draft':
      case 'nháp':
        return 'status-draft';
      default:
        return 'status-draft';
    }
  }

  getStartIndex(): number {
    return Math.min((this.currentPage - 1) * this.itemsPerPage + 1, this.filteredProducts.length);
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  getVisiblePages(): (number | string)[] {
    const totalPages = this.getTotalPages();
    const current = this.currentPage;
    const delta = 2;
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);
    if (current > delta + 2) {
      pages.push('...');
    }
    const start = Math.max(2, current - delta);
    const end = Math.min(totalPages - 1, current + delta);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (current < totalPages - delta - 1) {
      pages.push('...');
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
  }

  closeAddModal(): void {
  this.showAddModal = false;
  this.resetNewProduct();
  this.isAdding = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedProduct = null;
  }

  onImageSelect(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProduct.imagePreview = e.target.result;
        this.newProduct.image = file;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event?: any) {
    this.newProduct.imagePreview = null;
    this.newProduct.image = null;
    if (event) event.stopPropagation();
  }
  showAddModal = false;
  showEditModal = false;
  newProduct: any = { name: '', category: '', price: 0, quantity: 0, status: '', image: '' };
  selectedProduct: any = null;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  products: any[] = [];
  filteredProducts: any[] = [];
  isLoading: boolean = false;
  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      description: [''],
      image: ['']
    });
    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      description: [''],
      image: ['']
    });
    this.getCategories();
    this.getProducts();
  }

  getCategories(): void {
    this.productService.getCategories().subscribe({
      next: (res: any) => { this.categories = res.data || []; },
      error: () => { this.categories = []; }
    });
  }

  getProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = (res.data || []).map((product: any) => ({
          ...product,
          image: Array.isArray(product.image) ? product.image[0] : product.image || 'assets/default.png',
          quantity: product.quantity ?? product.stock ?? 0,
          status: product.status ?? '',
          category: product.category ?? null
        }));
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; alert('Lỗi khi lấy danh sách sản phẩm!'); }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      if (!this.searchTerm) return true;
      return product.name?.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
    
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > totalPages && totalPages > 0) {
      this.currentPage = totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    this.cdr.detectChanges();
  }
}