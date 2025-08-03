import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="mt-2">
      <h2 class="text-xs font-bold text-gray-700 mb-1">
        Sản phẩm liên quan
      </h2>
      
      <!-- Products list -->
      <ng-container *ngIf="products?.length; else noRelated">
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div *ngFor="let p of products" 
               (click)="onProductClick(p)" 
               class="min-w-[140px] max-w-[160px] bg-white rounded-xl shadow p-3 flex flex-col items-center border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer select-none transform hover:scale-105" 
               tabindex="0">
            <img [src]="getImage(p)" 
                 [alt]="p.name" 
                 (error)="handleImageError($event)"
                 class="w-24 h-24 object-cover rounded-lg mb-2 transition-transform duration-300 hover:scale-110" 
                 loading="lazy" />
            <div class="font-medium text-gray-800 text-xs md:text-sm text-center line-clamp-2 h-10 hover:text-pink-600 transition-colors">
              {{ p.name }}
            </div>
            <div class="text-pink-600 font-semibold text-xs md:text-base">
              {{ p.price | currency:'VND' }}
            </div>
          </div>
        </div>
      </ng-container>
      
      <ng-template #noRelated>
        <div class="text-gray-400 italic text-xs py-4">
          Không có sản phẩm liên quan.
        </div>
      </ng-template>
    </div>
  `
})
export class RelatedProductsComponent {
  @Input() products: Product[] = [];
  @Output() productClick = new EventEmitter<Product>();

  constructor(private router: Router) {}

  onProductClick(product: Product): void {
    if (product) {
      // Emit event cho parent component xử lý
      this.productClick.emit(product);
      
      // Fallback: nếu parent không handle, tự navigate
      setTimeout(() => {
        this.goToDetail(product);
      }, 100);
    }
  }

  private goToDetail(product: Product): void {
    if (product && product.slug) {
      this.router.navigate(['/product', product.slug]);
    } else if (product && product._id) {
      this.router.navigate(['/product', product._id]);
    }
  }

  handleImageError(event: any): void {
    event.target.src = '/default.png';
  }

  getImage(product: Product): string {
    if (!product) return '/default.png';
    
    // Ưu tiên image_cover, fallback về image
    let imgSrc = product.image_cover || product.image;
    
    if (Array.isArray(imgSrc)) {
      return imgSrc.length > 0 ? imgSrc[0] : '/default.png';
    }
    if (typeof imgSrc === 'string' && imgSrc.trim().startsWith('[')) {
      try {
        const arr = JSON.parse(imgSrc);
        return Array.isArray(arr) && arr.length > 0 ? arr[0] : '/default.png';
      } catch {
        return '/default.png';
      }
    }
    return imgSrc || '/default.png';
  }
}