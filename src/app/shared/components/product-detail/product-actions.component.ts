import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-actions',
  standalone: true,
  template: `
    <div class="flex gap-2 justify-center md:justify-start">
      <button (click)="addToCart.emit()" class="flex-1 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow transition text-xs md:text-sm">Thêm vào giỏ hàng</button>
      <button (click)="buyNow.emit()" class="flex-1 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow transition text-xs md:text-sm">Mua ngay</button>
    </div>
  `
})
export class ProductActionsComponent {
  @Input() product: any;
  @Input() quantity: number = 1;
  @Output() addToCart = new EventEmitter<void>();
  @Output() buyNow = new EventEmitter<void>();
}
