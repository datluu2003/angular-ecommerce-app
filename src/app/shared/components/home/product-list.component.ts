import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="flex flex-col gap-16 items-center pb-16 bg-gradient-to-b from-white to-green-50 min-h-screen">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="flex justify-center text-3xl md:text-4xl font-bold pt-8 mb-8 text-green-700 drop-shadow">Sản phẩm Hot</h2>
        <ul *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 list-none p-0">
          <li *ngFor="let product of hotProducts"
              class="border rounded-2xl p-3 md:p-5 bg-gradient-to-b from-yellow-50 to-green-100 shadow-lg hover:shadow-2xl transition flex flex-col gap-2 md:gap-3 relative group h-full">
            <img [src]="getImage(product)" [alt]="product.name" class="w-full h-36 md:h-44 object-cover rounded-xl border border-green-200" />
            <div class="font-bold text-base md:text-lg text-green-800 group-hover:text-green-600 transition">{{ product.name }}</div>
            <div class="text-green-700 font-semibold">{{ product.price | currency:'VND' }}</div>
            <div class="flex-1"></div>
            <button class="mt-2 py-2 rounded-xl bg-gradient-to-r from-green-400 to-lime-500 text-white font-bold shadow hover:from-lime-500 hover:to-green-600 transition w-full">Mua ngay</button>
          </li>
        </ul>
      </div>
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="flex justify-center text-3xl md:text-4xl font-bold mb-8 text-green-700 drop-shadow">Tất cả sản phẩm</h2>
        <div *ngIf="loading" class="text-lg pl-4 md:pl-14">Loading...</div>
        <ul *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 list-none p-0">
          <li *ngFor="let product of products"
              class="border rounded-2xl p-3 md:p-5 bg-gradient-to-b from-yellow-50 to-green-100 shadow-lg hover:shadow-2xl transition flex flex-col gap-2 md:gap-3 relative group h-full">
            <img [src]="getImage(product)" [alt]="product.name" class="w-full h-36 md:h-44 object-cover rounded-xl border border-green-200" />
            <div class="font-bold text-base md:text-lg text-green-800 group-hover:text-green-600 transition">{{ product.name }}</div>
            <div class="text-green-700 font-semibold">{{ product.price | currency:'VND' }}</div>
            <div class="flex-1"></div>
            <button class="mt-2 py-2 rounded-xl bg-gradient-to-r from-green-400 to-lime-500 text-white font-bold shadow hover:from-lime-500 hover:to-green-600 transition w-full">Mua ngay</button>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  hotProducts: Product[] = [];
  loading = true;

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.data || [];
        this.hotProducts = this.getRandomProducts(this.products, 8);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getRandomProducts(arr: any, n: number): Product[] {
    if (!Array.isArray(arr)) return [];
    return arr.slice().sort(() => Math.random() - 0.5).slice(0, n);
  }

  getImage(product: Product): string {
    // Trả về ảnh đầu tiên nếu là mảng, hoặc chuỗi ảnh, hoặc ảnh mặc định
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
}
