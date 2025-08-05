import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-orders">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        <div class="flex space-x-2">
          <select class="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đã gửi</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-600">Chức năng quản lý đơn hàng đang được phát triển...</p>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {

  ngOnInit(): void {
    // Implementation
  }
}
