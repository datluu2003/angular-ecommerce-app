import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ProductInfoComponent } from './product-info.component';
import { ProductQuantityComponent } from './product-quantity.component';
import { ProductActionsComponent } from './product-actions.component';
import { RelatedProductsComponent } from './related-products.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ProductInfoComponent,
    ProductQuantityComponent,
    ProductActionsComponent,
    RelatedProductsComponent
  ],
  template: `
    <div class="container mx-auto pt-16 pb-8 px-1 md:px-0 min-h-screen mb-24">
      <!-- Loading overlay -->
      <div *ngIf="loading" class="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
        <div class="text-gray-500 text-lg">Đang tải dữ liệu sản phẩm...</div>
      </div>
      
      <!-- Error state -->
      <div *ngIf="error && !loading && !product" class="flex justify-center items-center min-h-[300px]">
        <div class="text-red-500 text-lg">{{ error }}</div>
      </div>
      
      <!-- Product content -->
      <div *ngIf="product" class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch"
           [class.opacity-75]="loading">
        <!-- Product Image Only (Left) -->
        <div class="flex flex-col items-center md:items-start h-full">
          <div class="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-3xl shadow-2xl border-2 border-pink-200 flex items-center justify-center p-8 md:p-12 min-h-[340px] min-w-[340px] md:min-h-[400px] md:min-w-[400px] self-start">
            <img [src]="getImage(product)" alt="{{ product?.name }}" class="rounded-2xl shadow-lg w-64 h-64 md:w-80 md:h-80 object-cover border border-gray-200 bg-gray-50" />
          </div>
        </div>
        <!-- Info, Actions, Related (Right) -->
        <div class="flex flex-col gap-6">
          <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-5">
            <app-product-info [product]="product"></app-product-info>
            <app-product-quantity [(quantity)]="quantity"></app-product-quantity>
            <app-product-actions [product]="product" [quantity]="quantity" (addToCart)="onAddToCart()" (buyNow)="onBuyNow()"></app-product-actions>
          </div>
          <div class="bg-white rounded-xl shadow p-4">
            <app-related-products [products]="relatedProducts"></app-related-products>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: any = null;
  quantity = 1;
  relatedProducts: any[] = [];
  loading = false;
  error: string | null = null;
  
  private routeSubscription?: Subscription;
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // Unsubscribe từ subscription cũ nếu có
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      
      if (slug) {
        this.loadProduct(slug);
      } else {
        this.resetComponent();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadProduct(slug: string): void {
    // Chỉ set loading = true, giữ nguyên product cũ để tránh giật
    this.loading = true;
    this.error = null;
    
    console.log('Loading product with slug:', slug);

    this.productService.getProductBySlug(slug).subscribe({
      next: (res) => {
        console.log('Product service response:', res);
        
        if (res && (res.data || res._id || res.name)) {
          const productData = res.data || res;
          console.log('Product data:', productData);
          
          // Update tất cả cùng lúc để tránh multiple re-render
          this.product = productData;
          this.quantity = 1;
          this.loading = false;
          this.error = null;
          this.relatedProducts = []; // Reset related products
          
          // Single change detection
          this.cdr.detectChanges();
          
          // Load related products (không ảnh hưởng đến main product display)
          this.loadRelatedProducts(res, productData);
        } else {
          console.log('Invalid product data structure');
          this.loading = false;
          this.error = 'Không tìm thấy sản phẩm hoặc dữ liệu không hợp lệ.';
          this.product = null;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.loading = false;
        this.error = 'Có lỗi khi tải dữ liệu sản phẩm.';
        this.product = null;
        this.relatedProducts = [];
        this.cdr.detectChanges();
      }
    });
  }

  private loadRelatedProducts(res: any, productData: any): void {
    if (Array.isArray(res.relatedProducts) && res.relatedProducts.length > 0) {
      this.relatedProducts = res.relatedProducts;
      this.cdr.detectChanges();
    } else if (productData && productData.category) {
      this.productService.getProducts().subscribe({
        next: (allRes) => {
          const allProducts = Array.isArray(allRes.data) ? allRes.data : [];
          this.relatedProducts = allProducts.filter((p: any) => {
            const pCat = typeof p.category === 'object' && p.category ? p.category._id : p.category;
            const mainCat = typeof productData.category === 'object' && productData.category ? productData.category._id : productData.category;
            return pCat === mainCat && p._id !== productData._id;
          }).slice(0, 8);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.relatedProducts = [];
          this.cdr.detectChanges();
        }
      });
    } else {
      this.relatedProducts = [];
      this.cdr.detectChanges();
    }
  }

  private resetComponent(): void {
    this.product = null;
    this.relatedProducts = [];
    this.quantity = 1;
    this.loading = false;
    this.error = 'Không tìm thấy sản phẩm.';
    this.cdr.detectChanges();
  }

  getImage(product: any): string {
    if (!product) return '/default.png';
    let imgSrc = product.image;
    if (Array.isArray(imgSrc)) {
      imgSrc = imgSrc.length > 0 ? imgSrc[0] : '';
    } else if (typeof imgSrc === 'string' && imgSrc.trim().startsWith('[')) {
      try {
        const arr = JSON.parse(imgSrc);
        imgSrc = Array.isArray(arr) && arr.length > 0 ? arr[0] : '';
      } catch {
        imgSrc = '';
      }
    }
    return imgSrc || '/default.png';
  }

  onAddToCart() {
    // TODO: Thêm logic thêm vào giỏ hàng
  }

  onBuyNow() {
    // TODO: Thêm logic mua ngay
  }
}