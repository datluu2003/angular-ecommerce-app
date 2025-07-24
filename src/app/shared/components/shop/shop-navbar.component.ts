import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="flex flex-wrap gap-3 py-4">
      <button
        class="px-4 py-2 rounded-lg font-semibold border border-green-500 text-green-700 bg-white hover:bg-green-100 transition focus:outline-none focus:ring-2 focus:ring-green-400"
        [class.bg-green-500]="selectedCategory === null"
        [class.text-black]="selectedCategory === null"
        [class.border-black]="selectedCategory === null"
        (click)="selectCategory(null)"
      >Tất cả</button>
      <button
        *ngFor="let cat of categories"
        class="px-4 py-2 rounded-lg font-semibold border border-green-500 text-green-700 bg-white hover:bg-green-100 transition focus:outline-none focus:ring-2 focus:ring-green-400"
        [class.bg-green-500]="selectedCategory === cat._id"
        [class.text-black]="selectedCategory === cat._id"
        [class.border-black]="selectedCategory === cat._id"
        (click)="selectCategory(cat._id)"
      >{{ cat.name }}</button>
    </nav>
  `
})
export class ShopNavbarComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategory: string|null = null;
  @Output() categoryChange = new EventEmitter<string|null>();

  selectCategory(id: string|null) {
    this.categoryChange.emit(id);
  }
} 