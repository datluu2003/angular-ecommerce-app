import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-checkout-cart-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Sản phẩm trong đơn hàng</h3>
        <div *ngIf="isArray(cartItems) && cartItems.length > 0; else emptyCart">
          <div *ngFor="let item of cartItems" class="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div class="flex items-center gap-4">
              <img [src]="item.image" [alt]="item.name" class="w-16 h-16 object-cover rounded-lg border shadow-sm" />
              <div>
                <div class="font-semibold text-gray-900 text-base mb-1">{{ item.name }}</div>
                <div class="text-sm text-gray-500">Số lượng: <span class="font-medium text-gray-700">{{ item.quantity }}</span></div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-green-600">{{ formatPrice(item.price * item.quantity) }}₫</div>
            </div>
          </div>
          <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <span class="text-base font-semibold text-gray-900">Tổng cộng:</span>
            <span class="text-2xl font-bold text-green-600">{{ formatPrice(getTotalPrice()) }}₫</span>
          </div>
        </div>
        <ng-template #emptyCart>
          <div class="text-gray-500 text-center py-8">Không có sản phẩm nào trong đơn hàng.</div>
        </ng-template>
      </div>
    </div>
  `
})
export class CheckoutCartSummaryComponent {
  isArray(arr: any): boolean {
    return Array.isArray(arr);
  }
  @Input() cartItems: CartItem[] = [];

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
