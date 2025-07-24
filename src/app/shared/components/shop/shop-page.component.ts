import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product, Category } from '../../../models/product.model';
import { ShopNavbarComponent } from './shop-navbar.component';
import { ShopFilterComponent } from './shop-filter.component';
import { ShopProductListComponent } from './shop-product-list.component';
import { ShopSearchComponent } from './Shop-Search.Component';
import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, ShopNavbarComponent, ShopFilterComponent, ShopProductListComponent, ShopSearchComponent],
  template: `
    <div class="min-h-screen bg-white max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 ">
        <h1 class="text-7xl font-extrabold text-green-700 mb-4 ml-10 text-left">Shop</h1>
         <div class="w-full flex justify-between items-center mr-5">
            <div class="flex items-center ml-32">
              <app-shop-search
                [searchTerm]="searchTerm"
                (searchTermChange)="onSearchTermChange($event)">
              </app-shop-search>
            </div>

            <div class="flex items-center">
              <app-shop-filter
                [categories]="categories"
                [selectedCategory]="selectedCategory"
                (categoryChange)="onCategoryChange($event)">
              </app-shop-filter>
            </div>
          </div>
        </div>
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/4 w-full flex flex-col gap-4">
          <app-shop-navbar
            [categories]="categories"
            [selectedCategory]="selectedCategory"
            (categoryChange)="onCategoryChange($event)"></app-shop-navbar>
        </div>
        <div class="md:w-3/4 w-full">
          <app-shop-product-list [products]="productsToShow"></app-shop-product-list>
          <div class="flex justify-center mt-6 gap-2" *ngIf="totalPages > 1">
            <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1" class="px-3 py-1 rounded border border-green-500 text-green-700 bg-white hover:bg-green-100 disabled:opacity-50">&lt;</button>
            <button *ngFor="let page of [].constructor(totalPages); let i = index"
              (click)="goToPage(i+1)"
              [class.bg-green-500]="currentPage === (i+1)"
              [class.text-black]="currentPage === (i+1)"
              [class.border-black]="currentPage === (i+1)"
              class="px-3 py-1 rounded border border-green-500 text-green-700 bg-white hover:bg-green-100">
              {{ i+1 }}
            </button>
            <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages" class="px-3 py-1 rounded border border-green-500 text-green-700 bg-white hover:bg-green-100 disabled:opacity-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShopPageComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: string | null = null;
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  searchTermSubject = new Subject<string>();
  private filterSubject = new Subject<void>(); // Subject dùng để debounce filter




  normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  // Phân trang
  currentPage = 1;
  pageSize = 6;
  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
  }
  get productsToShow() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();

    // Debounce việc lọc
    this.filterSubject.pipe(
      debounceTime(400)
    ).subscribe(() => {
      this.filterProducts(); // Chỉ lọc sau 400ms không nhập
    });

    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        this.cdr.detectChanges();
      }
    });
  }

  loadData() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.data || [];
        this.filterProducts();
        this.cdr.detectChanges();
      }
    });
  }

  onCategoryChange(categoryId: string | null) {
    this.selectedCategory = categoryId;
    this.filterProducts();
    this.currentPage = 1;
  }

  filterProducts() {
    let result = this.products;

    if (this.selectedCategory) {
      result = result.filter(p =>
        p.category &&
        (typeof p.category === 'string'
          ? p.category === this.selectedCategory
          : p.category._id === this.selectedCategory)
      );
    }

    if (this.searchTerm.trim()) {
      const keyword = this.normalizeText(this.searchTerm);

      result = result.filter(p => {
        const name = this.normalizeText(p.name || '');
        const desc = this.normalizeText(p.description || '');
        return name.includes(keyword) || desc.includes(keyword);
      });
    }

    this.filteredProducts = result;
    this.currentPage = 1;
  }


  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  debouncedFilter() {
    this.filterSubject.next(); // Kích hoạt debounce
  }
  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.filterProducts();
  }

  
} 