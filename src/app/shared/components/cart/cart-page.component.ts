import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>
        
        <!-- Empty State -->
        <div *ngIf="cartItems.length === 0" class="text-center py-16">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v5a2 2 0 002 2h7a2 2 0 002-2v-5m-9 0h9"></path>
          </svg>
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
          <p class="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
          <button 
            routerLink="/shop" 
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <!-- Cart Content -->
        <div *ngIf="cartItems.length > 0" class="flex flex-col lg:flex-row gap-8">
          <!-- Cart Items -->
          <div class="lg:w-2/3">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">Sản phẩm trong giỏ ({{ cartItems.length }})</h2>
              </div>
              <div class="divide-y divide-gray-200">
                <div 
                  *ngFor="let item of cartItems; trackBy: trackByCartItem" 
                  class="p-6 flex items-center space-x-4"
                >
                  <!-- Product Image -->
                  <img 
                    [src]="item.image" 
                    [alt]="item.name"
                    class="w-20 h-20 object-cover rounded-lg border"
                  />
                  
                  <!-- Product Info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-gray-900 mb-1">{{ item.name }}</h3>
                    <p *ngIf="item.description" class="text-gray-600 text-sm mb-2">{{ item.description }}</p>
                    <div class="flex items-center space-x-4">
                      <span class="text-lg font-semibold text-green-600">
                        {{ formatPrice(item.price) }}₫
                      </span>
                      <span *ngIf="item.originalPrice && item.originalPrice > item.price" 
                            class="text-sm text-gray-500 line-through">
                        {{ formatPrice(item.originalPrice) }}₫
                      </span>
                    </div>
                  </div>
                  
                  <!-- Quantity Controls -->
                  <div class="flex items-center space-x-3">
                    <button 
                      (click)="decreaseQuantity(item)"
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      [disabled]="item.quantity <= 1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
                    <button 
                      (click)="increaseQuantity(item)"
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Item Total -->
                  <div class="text-right">
                    <div class="text-lg font-semibold text-gray-900">
                      {{ formatPrice(item.price * item.quantity) }}₫
                    </div>
                  </div>
                  
                  <!-- Remove Button -->
                  <button 
                    (click)="removeFromCart(item)"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa sản phẩm"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Cart Actions -->
              <div class="p-6 border-t border-gray-200 flex justify-between items-center">
                <button 
                  (click)="clearCart()"
                  class="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Xóa tất cả
                </button>
                <button 
                  routerLink="/shop" 
                  class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="lg:w-1/3">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                
                <div class="space-y-3 mb-4">
                  <div class="flex justify-between text-gray-600">
                    <span>Tạm tính ({{ getTotalItems() }} sản phẩm)</span>
                    <span>{{ formatPrice(getSubtotal()) }}₫</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span class="text-green-600">Miễn phí</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>Thuế VAT (10%)</span>
                    <span>{{ formatPrice(getVAT()) }}₫</span>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 pt-4 mb-6">
                  <div class="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Tổng cộng</span>
                    <span class="text-green-600">{{ formatPrice(getTotalPrice()) }}₫</span>
                  </div>
                </div>
                
                <button 
                  (click)="proceedToCheckout()"
                  class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Tiến hành thanh toán
                </button>
                
                <div class="mt-4 text-center">
                  <p class="text-sm text-gray-500">
                    Bảo mật thanh toán với SSL
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Promo Code -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <div class="p-6">
                <h4 class="font-medium text-gray-900 mb-3">Mã giảm giá</h4>
                <div class="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Nhập mã giảm giá"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private subscription?: Subscription;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = [...items];
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  trackByCartItem(index: number, item: CartItem): string {
    return item.id;
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
    this.toastService.showToast(
      'success',
      `Đã xóa "${item.name}" khỏi giỏ hàng`
    );
  }

  clearCart(): void {
    if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      this.cartService.clearCart();
      this.toastService.showToast('success', 'Đã xóa tất cả sản phẩm khỏi giỏ hàng');
    }
  }

  getTotalItems(): number {
    return this.cartService.getTotalItems();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getVAT(): number {
    return this.getSubtotal() * 0.1; // 10% VAT
  }

  getTotalPrice(): number {
    return this.getSubtotal() + this.getVAT();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
  }

  proceedToCheckout(): void {
    // Implement checkout logic here
    this.toastService.showToast('info', 'Chức năng thanh toán đang được phát triển!');
  }
}
