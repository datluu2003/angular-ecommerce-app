import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-2 flex items-center gap-2">
      <label for="category-select" class="font-semibold text-green-700">Lọc theo danh mục:</label>
      <select id="category-select" class="border rounded px-3 py-2" [value]="selectedCategory" (change)="onChange($event)">
        <option value="">Tất cả</option>
        <option *ngFor="let cat of categories" [value]="cat._id">{{ cat.name }}</option>
      </select>
    </div>
  `
})
export class ShopFilterComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategory: string|null = null;
  @Output() categoryChange = new EventEmitter<string|null>();

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryChange.emit(value || null);
  }
} 