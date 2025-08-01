import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BuyNowButtonComponent } from './buy-now-button.component';
import { AddToCartButtonComponent } from './add-to-cart-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-product-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe, BuyNowButtonComponent, AddToCartButtonComponent],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 p-4">
      <div *ngFor="let product of products | slice:0:6" class="border rounded-2xl p-3 md:p-5 bg-gradient-to-b from-yellow-50 to-green-100 shadow-lg hover:shadow-2xl transition flex flex-col gap-2 md:gap-3 relative group h-full">
        <img [src]="getImage(product)" [alt]="product.name" class="w-full h-36 md:h-44 object-cover rounded-xl border border-green-200 cursor-pointer" (click)="goToDetail(product)" />
        <div class="font-bold text-base md:text-lg text-green-800 group-hover:text-green-600 transition cursor-pointer" (click)="goToDetail(product)">{{ product.name }}</div>
        <div class="text-green-700 font-semibold">{{ product.price | number }} đ</div>
        <div class="flex-1"></div>
        <div class="flex gap-2 mt-2">
          <app-buy-now-button class="flex-1"></app-buy-now-button>
          <app-add-to-cart-button class="flex-1"></app-add-to-cart-button>
        </div>
      </div>
      <div *ngIf="products.length === 0" class="col-span-full text-center text-gray-500 py-10">Không có sản phẩm nào.</div>
    </div>
  `
})
export class ShopProductListComponent {
  @Input() products: Product[] = [];

  constructor(private router: Router) {}

  getImage(product: Product): string {
    let imgSrc = product.image;
    if (typeof imgSrc === 'string' && imgSrc.trim().startsWith('[')) {
      try {
        const arr = JSON.parse(imgSrc);
        imgSrc = Array.isArray(arr) && arr.length > 0 ? arr[0] : '';
      } catch {
        imgSrc = '';
      }
    }
    return imgSrc || '/default.png';
  }

  goToDetail(product: Product) {
    if (product && product.slug) {
      this.router.navigate(['/product', product.slug]);
    } else if (product && product._id) {
      this.router.navigate(['/product', product._id]);
    }
  }
}