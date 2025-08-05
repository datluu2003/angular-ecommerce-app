import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductService } from '../../services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  template: `
    <div class="admin-products w-full px-2 md:px-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Quản lý Sản phẩm</h1>
      
      <!-- Search Bar -->
      <div class="mb-4 flex justify-between items-center">
        <div class="flex-1 max-w-md">
          <input 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearch()"
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

      <!-- Modal thêm sản phẩm -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Thêm sản phẩm</h2>
          <form (ngSubmit)="addProduct()">
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
              <input [(ngModel)]="newProduct.name" name="name" placeholder="Nhập tên sản phẩm" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />

              <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select [(ngModel)]="newProduct.category" name="category" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                <option value="">Chọn danh mục</option>
                <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
              </select>

              <label class="block text-sm font-medium text-gray-700 mb-1">Giá</label>
              <input [(ngModel)]="newProduct.price" name="price" type="number" min="0" placeholder="Nhập giá sản phẩm" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />

              <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
              <input [(ngModel)]="newProduct.stock" name="stock" type="number" min="0" placeholder="Nhập số lượng" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />

              <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select [(ngModel)]="newProduct.status" name="status" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                <option value="">Chọn trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
                <option value="pending">Chờ duyệt</option>
                <option value="draft">Nháp</option>
              </select>

              <label class="block text-sm font-medium text-gray-700 mb-1">Ảnh sản phẩm</label>
              <input type="file" (change)="onImageSelect($event)" accept="image/*" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <div *ngIf="newProduct.imagePreview" class="mt-2 flex justify-center">
                <img [src]="newProduct.imagePreview" alt="Preview" class="w-24 h-24 object-cover rounded border" />
              </div>

              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
              <textarea [(ngModel)]="newProduct.description" name="description" placeholder="Nhập mô tả sản phẩm" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="3"></textarea>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Lưu
              </button>
              <button type="button" (click)="closeAddModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal sửa sản phẩm -->
      <div *ngIf="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Sửa sản phẩm</h2>
          <form (ngSubmit)="updateProduct()">
            <div class="space-y-4">
              <input [(ngModel)]="selectedProduct.name" name="editName" placeholder="Tên sản phẩm" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              <select [(ngModel)]="selectedProduct.category" name="editCategory" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                <option value="">Chọn danh mục</option>
                <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
              </select>
              <input [(ngModel)]="selectedProduct.price" name="editPrice" type="number" placeholder="Giá" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              <input [(ngModel)]="selectedProduct.stock" name="editStock" type="number" placeholder="Số lượng" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              <input [(ngModel)]="selectedProduct.status" name="editStatus" placeholder="Trạng thái" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div class="flex gap-3 mt-6">
              <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Cập nhật
              </button>
              <button type="button" (click)="closeEditModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
                Hủy
              </button>
            </div>
          </form>
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
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminProductsComponent implements OnInit {
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

  constructor(private productService: ProductService, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void { 
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

  onSearch(): void { 
    this.currentPage = 1; // Reset to first page when searching
    this.applyFilters(); 
  }

  // Pagination Helper Methods
  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  getVisiblePages(): (number | string)[] {
    const totalPages = this.getTotalPages();
    const current = this.currentPage;
    const delta = 2; // Number of pages to show around current page
    
    if (totalPages <= 7) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    if (current > delta + 2) {
      pages.push('...');
    }
    
    // Show pages around current
    const start = Math.max(2, current - delta);
    const end = Math.min(totalPages - 1, current + delta);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (current < totalPages - delta - 1) {
      pages.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  }

  getStartIndex(): number {
    return Math.min((this.currentPage - 1) * this.itemsPerPage + 1, this.filteredProducts.length);
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
  }

  // Status styling helper
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

  addProduct(): void {
    // Tạo FormData để gửi lên backend
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        let msg = 'Lỗi khi thêm sản phẩm!';
        if (err?.error?.message) msg += '\n' + err.error.message;
        if (err?.error?.error) msg += '\n' + JSON.stringify(err.error.error);
        alert(msg);
      }
    });
  }

  editProduct(product: any): void {
    this.selectedProduct = { ...product };
    if (product.category && product.category._id) {
      this.selectedProduct.category = product.category._id;
    }
    this.showEditModal = true;
  }

  updateProduct(): void {
    if (!this.selectedProduct?._id) return;
    
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
      },
      error: () => { alert('Lỗi khi cập nhật sản phẩm!'); }
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
      error: () => { alert('Lỗi khi xóa sản phẩm!'); }
    });
  }

  resetNewProduct(): void { 
    this.newProduct = { name: '', category: '', price: 0, quantity: 0, status: '', image: '', description: '' }; 
  }
  
  closeAddModal(): void { 
    this.showAddModal = false; 
    this.resetNewProduct(); 
  }
  
  closeEditModal(): void { 
    this.showEditModal = false; 
    this.selectedProduct = null; 
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

  // Thêm logic xử lý ảnh vào class
  onImageSelect(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProduct.imagePreview = e.target.result;
        this.newProduct.image = file; // Lưu file để upload
      };
      reader.readAsDataURL(file);
    }
  }
}