import { Component, Input } from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="w-full text-center md:text-left">
      <h1 class="text-lg md:text-xl font-bold text-gray-900 mb-1">{{ product?.name }}</h1>
      <div class="text-pink-600 text-base md:text-lg font-semibold mb-1">{{ product?.price | currency:'VND' }}</div>
      <div class="text-gray-700 mb-1 text-xs md:text-sm">{{ product?.description }}</div>
      <div *ngIf="product?.quantity === 0" class="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">Hết hàng</div>
    </div>
  `
})
export class ProductInfoComponent {
  @Input() product: any;
}
