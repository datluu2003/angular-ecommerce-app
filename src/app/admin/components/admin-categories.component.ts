import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-categories">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Thêm Danh mục</span>
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-600">Chức năng quản lý danh mục đang được phát triển...</p>
      </div>
    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {

  ngOnInit(): void {
    // Implementation
  }
}
