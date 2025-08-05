import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-50 overflow-hidden" *ngIf="isOpen">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="closeCart()"></div>
      
      <!-- Cart Panel -->
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Giỏ hàng ({{ cartItems.length }})</h2>
          <button 
            (click)="closeCart()"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Empty Cart -->
        <div *ngIf="cartItems.length === 0" class="flex flex-col items-center justify-center h-96 p-8">
          <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v5a2 2 0 002 2h7a2 2 0 002-2v-5m-9 0h9"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
          <p class="text-gray-500 text-center">Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
        </div>

        <!-- Cart Items -->
        <div *ngIf="cartItems.length > 0" class="flex-1 overflow-y-auto p-4 space-y-4">
          <div 
            *ngFor="let item of cartItems; trackBy: trackByCartItem"
            class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <!-- Product Image -->
            <div class="flex-shrink-0">
              <img 
                [src]="item.image" 
                [alt]="item.name"
                class="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ formatPrice(item.price) }}₫</p>
              
              <!-- Quantity Controls -->
              <div class="flex items-center mt-2 space-x-2">
                <button 
                  (click)="decreaseQuantity(item)"
                  class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                  [disabled]="item.quantity <= 1"
                  [class.opacity-50]="item.quantity <= 1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                
                <span class="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded">{{ item.quantity }}</span>
                
                <button 
                  (click)="increaseQuantity(item)"
                  class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Remove Button -->
            <button 
              (click)="removeFromCart(item)"
              class="flex-shrink-0 p-2 text-red-400 hover:text-red-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3a1 1 0 11-2 0V6a1 1 0 011-1zM10 13a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clip-rule="evenodd"></path>
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Cart Footer -->
        <div *ngIf="cartItems.length > 0" class="border-t border-gray-200 p-4 space-y-4">
          <!-- Total -->
          <div class="flex justify-between items-center">
            <span class="text-base font-medium text-gray-900">Tổng cộng:</span>
            <span class="text-xl font-bold text-green-600">{{ formatPrice(getTotalPrice()) }}₫</span>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2">
            <button 
              (click)="proceedToCheckout()"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Thanh toán
            </button>
            
            <button 
              (click)="clearCart()"
              class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  isOpen = false;
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

    // Subscribe to cart open state
    this.cartService.isCartOpen$.subscribe((isOpen: boolean) => {
      this.isOpen = isOpen;
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

  closeCart(): void {
    this.cartService.closeCart();
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
    this.toastService.showToast('success', 'Đã xóa sản phẩm', `${item.name} đã được xóa khỏi giỏ hàng`);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.toastService.showToast('success', 'Đã xóa tất cả', 'Giỏ hàng đã được làm trống');
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  proceedToCheckout(): void {
    // TODO: Implement checkout logic
    this.toastService.showToast('info', 'Chức năng đang phát triển', 'Tính năng thanh toán sẽ sớm có');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
  }
}
