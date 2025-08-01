import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="mt-2">
      <h2 class="text-xs font-bold text-gray-700 mb-1">Sản phẩm liên quan</h2>
      <ng-container *ngIf="products?.length; else noRelated">
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div *ngFor="let p of products" (click)="goToDetail(p)" class="min-w-[140px] max-w-[160px] bg-white rounded-xl shadow p-3 flex flex-col items-center border border-gray-200 hover:shadow-lg transition cursor-pointer select-none" tabindex="0">
            <img [src]="getImage(p)" alt="{{ p.name }}" (error)="img.src='/default.png'" #img class="w-24 h-24 object-cover rounded-lg mb-2" />
            <div class="font-medium text-gray-800 text-xs md:text-sm text-center line-clamp-2 h-10">{{ p.name }}</div>
            <div class="text-pink-600 font-semibold text-xs md:text-base">{{ p.price | currency:'VND' }}</div>
          </div>
        </div>
      </ng-container>
      <ng-template #noRelated>
        <div class="text-gray-400 italic text-xs">Không có sản phẩm liên quan.</div>
      </ng-template>
    </div>
  `
})
export class RelatedProductsComponent {
  @Input() products: any[] = [];

  constructor(private router: Router) {}

  goToDetail(product: any) {
    if (product && product.slug) {
      this.router.navigate(['/product', product.slug]);
    } else if (product && product._id) {
      this.router.navigate(['/product', product._id]);
    }
  }

  getImage(product: any): string {
    if (!product) return '';
    let imgSrc = product.image;
    if (Array.isArray(imgSrc)) {
      return imgSrc.length > 0 ? imgSrc[0] : '';
    }
    if (typeof imgSrc === 'string' && imgSrc.trim().startsWith('[')) {
      try {
        const arr = JSON.parse(imgSrc);
        return Array.isArray(arr) && arr.length > 0 ? arr[0] : '';
      } catch {
        return '';
      }
    }
    return imgSrc || '';
  }
}

