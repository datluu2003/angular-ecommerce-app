import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50" *ngIf="isOpen">
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Giỏ hàng</h3>
        
        <!-- Empty State -->
        <div *ngIf="cartItems.length === 0" class="text-center py-6">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v5a2 2 0 002 2h7a2 2 0 002-2v-5m-9 0h9"></path>
          </svg>
          <p class="text-gray-500">Giỏ hàng trống</p>
        </div>

        <!-- Cart Items -->
        <div *ngIf="cartItems.length > 0" class="space-y-3 max-h-60 overflow-y-auto">
          <div 
            *ngFor="let item of cartItems.slice(0, 3); trackBy: trackByCartItem"
            class="flex items-center space-x-3"
          >
            <img 
              [src]="item.image" 
              [alt]="item.name"
              class="w-12 h-12 object-cover rounded border"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
              <p class="text-xs text-gray-500">{{ formatPrice(item.price) }}₫ x {{ item.quantity }}</p>
            </div>
            <div class="text-sm font-medium text-gray-900">
              {{ formatPrice(item.price * item.quantity) }}₫
            </div>
          </div>
          
          <div *ngIf="cartItems.length > 3" class="text-center text-sm text-gray-500 py-2">
            +{{ cartItems.length - 3 }} sản phẩm khác
          </div>
        </div>

        <!-- Footer -->
        <div *ngIf="cartItems.length > 0" class="border-t border-gray-200 pt-4 mt-4">
          <div class="flex justify-between items-center mb-3">
            <span class="font-medium text-gray-900">Tổng cộng:</span>
            <span class="font-bold text-green-600">{{ formatPrice(getTotalPrice()) }}₫</span>
          </div>
          <button 
            routerLink="/cart"
            (click)="viewCart()"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Xem giỏ hàng
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MiniCartComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  cartItems: CartItem[] = [];
  private subscription?: Subscription;

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router
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

  viewCart(): void {
    this.router.navigate(['/cart']);
    this.isOpen = false;
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
  }
}
