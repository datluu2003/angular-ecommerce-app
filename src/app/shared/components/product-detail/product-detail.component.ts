import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, BehaviorSubject, combineLatest, of, EMPTY, Observable } from 'rxjs';
import { switchMap, map, catchError, finalize, distinctUntilChanged, debounceTime, shareReplay } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';
import { ProductInfoComponent } from './product-info.component';
import { ProductQuantityComponent } from './product-quantity.component';
import { ProductActionsComponent } from './product-actions.component';
// Import conditionally - nếu RelatedProductsComponent không standalone thì comment dòng này
// import { RelatedProductsComponent } from './related-products.component';
import { Product } from '../../../models/product.model'; // Đúng path theo cấu trúc dự án

interface LoadingState {
  product: boolean;
  relatedProducts: boolean;
  imageTransition: boolean;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ProductInfoComponent,
    ProductQuantityComponent,
    ProductActionsComponent
    // RelatedProductsComponent // Comment tạm thời
  ],
  template: `
    <div class="container mx-auto pt-16 pb-8 px-1 md:px-0 min-h-screen mb-24">
      <!-- Loading overlay - chỉ hiện khi load lần đầu -->
      <div *ngIf="loadingState.product && !product" 
           class="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
        <div class="flex flex-col items-center gap-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <div class="text-gray-500 text-lg">Đang tải dữ liệu sản phẩm...</div>
        </div>
      </div>
      
      <!-- Error state -->
      <div *ngIf="error && !loadingState.product && !product" 
           class="flex justify-center items-center min-h-[300px]">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button (click)="retryLoad()" 
                  class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
      
      <!-- Product content -->
      <div *ngIf="product" class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch">
        <!-- Product Image (Left) - Optimized transitions -->
        <div class="flex flex-col items-center md:items-start h-full">
          <div class="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-3xl shadow-2xl border-2 border-pink-200 flex items-center justify-center p-8 md:p-12 min-h-[340px] min-w-[340px] md:min-h-[400px] md:min-w-[400px] self-start relative overflow-hidden">
            <!-- Loading skeleton cho image -->
            <div *ngIf="loadingState.imageTransition" 
                 class="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl m-8 md:m-12"></div>
            
            <!-- Main product image với smooth transition -->
            <img [src]="getImage(product)" 
                 [alt]="product.name"
                 (load)="onImageLoad()"
                 (error)="onImageError()"
                 [class.opacity-0]="loadingState.imageTransition"
                 class="rounded-2xl shadow-lg w-64 h-64 md:w-80 md:h-80 object-cover border border-gray-200 bg-gray-50 transition-opacity duration-300 ease-in-out" />
          </div>
        </div>

        <!-- Info, Actions, Related (Right) -->
        <div class="flex flex-col gap-6">
          <!-- Product info card với loading states -->
          <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-5 relative">
            <!-- Subtle loading indicator khi đang update -->
            <div *ngIf="loadingState.product && product" 
                 class="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            
            <app-product-info [product]="product" 
                              [class.transition-opacity]="true"
                              [class.opacity-75]="loadingState.product"></app-product-info>
            
            <app-product-quantity [(quantity)]="quantity" 
                                  [class.pointer-events-none]="loadingState.product"
                                  [class.opacity-50]="loadingState.product"></app-product-quantity>
            
            <app-product-actions [product]="product" 
                                 [quantity]="quantity" 
                                 [class.pointer-events-none]="loadingState.product"
                                 [class.opacity-50]="loadingState.product"
                                 (addToCart)="onAddToCart()" 
                                 (buyNow)="onBuyNow()"></app-product-actions>
          </div>

          <!-- Related products section - temporarily inline -->
          <div class="bg-white rounded-xl shadow p-4 relative">
            <!-- Loading indicator cho related products -->
            <div *ngIf="loadingState.relatedProducts" 
                 class="absolute top-2 right-2 w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
            
            <!-- Inline related products template -->
            <div class="mt-2">
              <h2 class="text-xs font-bold text-gray-700 mb-1">
                Sản phẩm liên quan
              </h2>
              
              <!-- Products list -->
              <ng-container *ngIf="relatedProducts.length; else noRelated">
                <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                     [class.opacity-75]="loadingState.relatedProducts">
                  <div *ngFor="let p of relatedProducts" 
                       (click)="onRelatedProductClick(p)" 
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
                      {{ formatPrice(p.price) }}
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
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  quantity = 1;
  relatedProducts: Product[] = [];
  error: string | null = null;
  private lastAddToCartTime = 0;
  loadingState: LoadingState = {
    product: false,
    relatedProducts: false,
    imageTransition: false
  };

  private routeSubscription?: Subscription;
  private currentSlug$ = new BehaviorSubject<string>('');
  private allProductsCache$?: Observable<any>;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // Khởi tạo cache sau khi component đã được inject đầy đủ
    this.allProductsCache$ = this.productService.getProducts().pipe(shareReplay(1));
    this.setupRouteObserver();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.currentSlug$.complete();
  }

  private setupRouteObserver(): void {
    this.routeSubscription = this.route.paramMap.pipe(
      map(params => params.get('slug') || ''),
      distinctUntilChanged(),
      debounceTime(50) // Tránh multiple calls quá nhanh
    ).subscribe(slug => {
      if (slug) {
        this.currentSlug$.next(slug);
        this.loadProduct(slug);
      } else {
        this.resetComponent();
      }
    });
  }

  private loadProduct(slug: string): void {
    // Chỉ show full loading khi chưa có product nào
    if (!this.product) {
      this.loadingState.product = true;
    } else {
      // Nếu đã có product, chỉ show subtle loading
      this.loadingState.product = true;
      this.loadingState.imageTransition = true;
    }
    
    this.error = null;
    
    console.log('Loading product with slug:', slug);

    this.productService.getProductBySlug(slug).pipe(
      catchError(err => {
        console.error('Error loading product:', err);
        this.error = 'Có lỗi khi tải dữ liệu sản phẩm.';
        return EMPTY;
      }),
      finalize(() => {
        this.loadingState.product = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (res) => {
        console.log('Product service response:', res);
        
        if (res && (res.data || res._id || res.name)) {
          const productData = res.data || res;
          console.log('Product data:', productData);
          
          // Smooth update: chỉ update cần thiết
          const isNewProduct = !this.product || this.product._id !== productData._id;
          
          this.product = productData;
          this.quantity = 1;
          this.error = null;
          
          // Load related products parallel (không block main product)
          this.loadRelatedProductsOptimized(res, productData);
          
          this.cdr.detectChanges();
        } else {
          console.log('Invalid product data structure');
          this.error = 'Không tìm thấy sản phẩm hoặc dữ liệu không hợp lệ.';
          this.product = null;
        }
      }
    });
  }

  private loadRelatedProductsOptimized(res: any, productData: Product): void {
    this.loadingState.relatedProducts = true;
    
    // Nếu API trả về related products
    if (Array.isArray(res.relatedProducts) && res.relatedProducts.length > 0) {
      this.relatedProducts = res.relatedProducts;
      this.loadingState.relatedProducts = false;
      this.cdr.detectChanges();
      return;
    }

    // Sử dụng cache cho performance (khởi tạo cache nếu chưa có)
    if (productData && productData.category) {
      if (!this.allProductsCache$) {
        this.allProductsCache$ = this.productService.getProducts().pipe(shareReplay(1));
      }
      
      this.allProductsCache$.pipe(
        map((allRes: any) => {
          const allProducts: Product[] = Array.isArray(allRes.data) ? allRes.data : [];
          return allProducts.filter((p: Product) => {
            const pCat = typeof p.category === 'object' && p.category ? p.category._id : p.category;
            const mainCat = typeof productData.category === 'object' && productData.category ? productData.category._id : productData.category;
            return pCat === mainCat && p._id !== productData._id;
          }).slice(0, 8);
        }),
        catchError(() => of([])),
        finalize(() => {
          this.loadingState.relatedProducts = false;
          this.cdr.detectChanges();
        })
      ).subscribe((filtered: Product[]) => {
        this.relatedProducts = filtered;
        this.cdr.detectChanges();
      });
    } else {
      this.relatedProducts = [];
      this.loadingState.relatedProducts = false;
      this.cdr.detectChanges();
    }
  }

  private resetComponent(): void {
    this.product = null;
    this.relatedProducts = [];
    this.quantity = 1;
    this.loadingState = { product: false, relatedProducts: false, imageTransition: false };
    this.error = 'Không tìm thấy sản phẩm.';
    this.cdr.detectChanges();
  }

  // Optimized navigation cho related products
  onRelatedProductClick(relatedProduct: Product): void {
    if (!relatedProduct || !relatedProduct.slug) return;
    
    // Prevent default nếu đang loading
    if (this.loadingState.product) return;
    
    // Navigate với smooth transition
    this.router.navigate(['/product', relatedProduct.slug], {
      replaceUrl: false // Giữ history để có thể back
    });
  }

  // Image loading handlers
  onImageLoad(): void {
    this.loadingState.imageTransition = false;
    this.cdr.detectChanges();
  }

  onImageError(): void {
    this.loadingState.imageTransition = false;
    console.warn('Product image failed to load');
    this.cdr.detectChanges();
  }

  handleImageError(event: any): void {
    event.target.src = '/default.png';
  }

  formatPrice(price: number): string {
    if (!price) return '0₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  retryLoad(): void {
    const currentSlug = this.currentSlug$.value;
    if (currentSlug) {
      this.loadProduct(currentSlug);
    }
  }

  getImage(product: Product | null): string {
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
    if (!this.product) {
      this.toastService.showToast('error', 'Lỗi', 'Không tìm thấy thông tin sản phẩm');
      return;
    }

    if (this.quantity <= 0) {
      this.toastService.showToast('warning', 'Cảnh báo', 'Vui lòng chọn số lượng hợp lệ');
      return;
    }

    if (this.loadingState.product) {
      this.toastService.showToast('warning', 'Cảnh báo', 'Vui lòng đợi tải xong sản phẩm');
      return;
    }

    const now = Date.now();
    if (now - this.lastAddToCartTime < 500) {
      this.toastService.showToast('warning', 'Cảnh báo', 'Bạn đang thao tác quá nhanh');
      return;
    }
    this.lastAddToCartTime = now;

    try {
      const cartItem = this.cartService.addToCart(this.product, this.quantity);
      this.toastService.showCartToast(cartItem);
      console.log('Product added to cart:', cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.toastService.showToast('error', 'Lỗi', 'Có lỗi khi thêm sản phẩm vào giỏ hàng');
    }
  }

  onBuyNow() {
    if (this.loadingState.product) {
      this.toastService.showToast('warning', 'Cảnh báo', 'Vui lòng đợi tải xong sản phẩm');
      return;
    }
    // TODO: Implement buy now logic
    console.log('Buy now clicked for:', this.product);
  }
}