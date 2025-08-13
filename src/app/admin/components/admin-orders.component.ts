import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { OrderType } from '../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  template: `
    <div class="admin-orders w-full px-2 md:px-8 py-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 class="text-3xl font-extrabold text-blue-700 tracking-tight mb-2 md:mb-0">Quản lý Đơn hàng</h1>
        <div class="flex items-center gap-2">
          <label for="statusFilter" class="text-sm font-medium text-gray-600">Lọc trạng thái:</label>
          <select id="statusFilter" [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-blue-400" style="min-width:160px">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao hàng</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div class="overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr class="bg-blue-50">
                <th class="px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase rounded-tl-xl">Mã đơn</th>
                <th class="px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase">Khách hàng</th>
                <th class="px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase">Trạng thái</th>
                <th class="px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase">Tổng tiền</th>
                <th class="px-5 py-3 text-left text-xs font-bold text-blue-700 uppercase rounded-tr-xl">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of filteredOrders | paginate: { itemsPerPage: itemsPerPage, currentPage: currentPage }" class="bg-white hover:bg-blue-50 transition-colors duration-150 shadow-sm rounded-xl">
                <td class="px-5 py-3 font-mono font-semibold text-gray-800">{{ order.orderNumber }}</td>
                <td class="px-5 py-3 text-gray-700 font-medium">{{ order.customerName }}</td>
                <td class="px-5 py-3">
                  <span [ngClass]="getStatusClass(order.orderStatus || '')" class="px-3 py-1 rounded-full text-xs font-semibold">
                    {{ order.orderStatus }}
                  </span>
                </td>
                <td class="px-5 py-3 text-green-600 font-bold">{{ order.totalAmount | number:'1.0-0' }}₫</td>
                <td class="px-5 py-3 text-gray-500">{{ order.createdAt | date:'short' }}</td>
              </tr>
              <tr *ngIf="filteredOrders.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                  <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8-5 5-5-5"></path>
                    </svg>
                    Không có đơn hàng nào.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination-controls (pageChange)="currentPage = $event" class="mt-4"></pagination-controls>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOrdersComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 10;
  statusFilter: string = '';
  filteredOrders: OrderType[] = [];
  getStatusClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipping': return 'bg-cyan-100 text-cyan-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  orders: OrderType[] = [];

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data.orders)) {
          this.orders = [...res.data.orders];
        } else if (Array.isArray(res)) {
          this.orders = [...res];
        } else {
          this.orders = [];
        }
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.orders = [];
        this.applyFilters();
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    if (!this.statusFilter) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => (order.orderStatus || '').toLowerCase() === this.statusFilter);
    }
  }
  }


