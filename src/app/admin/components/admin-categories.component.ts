// ...existing code...

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-categories w-full px-2 md:px-4">
      <h1 class="text-2xl font-bold mb-6 text-center">Quản lý Danh mục</h1>
      <div class="mb-4 flex justify-between items-center">
        <div class="flex-1 max-w-md"></div>
        <button
          (click)="showAddModal = true"
          class="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Thêm Danh mục
        </button>
      </div>
      <div class="overflow-x-auto">
        <table
          class="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden"
        >
          <thead class="bg-gray-50">
            <tr>
              <th
                class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
              >
                Tên danh mục
              </th>
              <th
                class="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
              >
                Ảnh
              </th>
              <th
                class="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let cat of categories"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="border border-gray-200 px-4 py-3 font-medium">
                {{ cat.name }}
              </td>
              <td class="border border-gray-200 px-4 py-3">
                <img
                  [src]="getCategoryImage(cat.image)"
                  alt="{{ cat.name }}"
                  class="w-12 h-12 object-cover rounded-lg border shadow-sm"
                  (error)="onImageError($event)"
                />
              </td>
              <td class="border border-gray-200 px-4 py-3 text-center">
                <button
                  (click)="editCategory(cat)"
                  class="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-150 mr-2"
                >
                  Sửa
                </button>
                <button
                  (click)="deleteCategory(cat)"
                  class="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors duration-150"
                >
                  Xóa
                </button>
              </td>
            </tr>
            <tr *ngIf="categories.length === 0">
              <td colspan="3" class="text-center py-8 text-gray-500 bg-gray-50">
                Không có danh mục nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal thêm danh mục -->
      <div
        *ngIf="showAddModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <h2 class="text-xl font-bold mb-4">Thêm danh mục mới</h2>
          <form (ngSubmit)="addCategory()">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Tên danh mục</label>
              <input
                [(ngModel)]="newCategory.name"
                name="name"
                class="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Ảnh (file)</label>
              <input
                type="file"
                accept="image/*"
                (change)="onFileSelected($event)"
                class="w-full px-3 py-2 border rounded"
                required
              />
              <div *ngIf="imagePreview" class="mt-2">
                <img [src]="imagePreview" alt="Preview" class="w-20 h-20 object-cover rounded border" />
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                (click)="closeAddModal()"
                class="bg-gray-200 px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="bg-blue-600 text-white px-4 py-2 rounded"
                [disabled]="isAdding"
              >
                <span *ngIf="isAdding" class="animate-pulse">Đang lưu...</span>
                <span *ngIf="!isAdding">Lưu</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal sửa danh mục -->
      <div
        *ngIf="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <h2 class="text-xl font-bold mb-4">Sửa danh mục</h2>
          <form (ngSubmit)="updateCategory()">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Tên danh mục</label>
              <input
                [(ngModel)]="selectedCategory.name"
                name="editName"
                class="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Ảnh (URL)</label>
              <input
                [(ngModel)]="selectedCategory.image"
                name="editImage"
                class="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                (click)="closeEditModal()"
                class="bg-gray-200 px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="bg-orange-500 text-white px-4 py-2 rounded"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategoriesComponent implements OnInit {
  isAdding = false;
  imageFile: File | null = null;
  imagePreview: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.imageFile);
    } else {
      this.imageFile = null;
      this.imagePreview = null;
    }
  }
  // Trả về url ảnh đúng cho danh mục
  getCategoryImage(image: any): string {
    if (!image) return '/public/default.png';
    if (Array.isArray(image)) {
      return image[0] || '/public/default.png';
    }
    try {
      const arr = JSON.parse(image);
      if (Array.isArray(arr) && arr.length > 0) return arr[0];
    } catch {}
    return image;
  }
  categories: any[] = [];
  showAddModal = false;
  showEditModal = false;
  newCategory: any = { name: '', image: '' };
  selectedCategory: any = null;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.categories = [];
        this.cdr.detectChanges();
      },
    });
  }

  addCategory(): void {
  if (!this.newCategory.name || !this.imageFile || this.isAdding) return;
  this.isAdding = true;
  const formData = new FormData();
  formData.append('name', this.newCategory.name);
  formData.append('image', this.imageFile);
  this.categoryService.createCategory(formData).subscribe({
      next: (res) => {
        this.categories.unshift(res.data);
        this.closeAddModal();
        this.isAdding = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        let msg = 'Lỗi khi thêm danh mục!';
        if (err?.error?.message) msg += '\n' + err.error.message;
        alert(msg);
        this.isAdding = false;
        this.cdr.detectChanges();
      },
    });
  }

  editCategory(cat: any): void {
    this.selectedCategory = { ...cat };
    this.showEditModal = true;
  }

  updateCategory(): void {
    if (!this.selectedCategory?._id) return;
    this.categoryService
      .updateCategory(this.selectedCategory._id, this.selectedCategory)
      .subscribe({
        next: (res) => {
          const idx = this.categories.findIndex((c) => c._id === res.data._id);
          if (idx > -1) this.categories[idx] = res.data;
          this.closeEditModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          let msg = 'Lỗi khi cập nhật danh mục!';
          if (err?.error?.message) msg += '\n' + err.error.message;
          alert(msg);
          this.cdr.detectChanges();
        },
      });
  }

  deleteCategory(cat: any): void {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) return;
    this.categoryService.deleteCategory(cat._id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c._id !== cat._id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        let msg = 'Lỗi khi xóa danh mục!';
        if (err?.error?.message) msg += '\n' + err.error.message;
        alert(msg);
        this.cdr.detectChanges();
      },
    });
  }

  closeAddModal(): void {
  this.showAddModal = false;
  this.newCategory = { name: '', image: '' };
  this.imageFile = null;
  this.imagePreview = null;
  this.isAdding = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCategory = null;
  }

  // Hiển thị ảnh mặc định nếu ảnh bị lỗi, tránh lặp vô hạn
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (!target.src.includes('/public/default.png')) {
      target.src = '/public/default.png';
    }
  }
}
