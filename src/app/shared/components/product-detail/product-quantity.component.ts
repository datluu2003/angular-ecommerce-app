import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-quantity',
  standalone: true,
  template: `
    <div class="flex items-center gap-1 justify-center md:justify-start">
      <button (click)="decrease()" class="w-7 h-7 rounded-full bg-gray-100 text-base font-bold flex items-center justify-center">-</button>
      <span class="text-base font-semibold w-6 text-center">{{ quantity }}</span>
      <button (click)="increase()" class="w-7 h-7 rounded-full bg-gray-100 text-base font-bold flex items-center justify-center">+</button>
    </div>
  `
})
export class ProductQuantityComponent {
  @Input() quantity: number = 1;
  @Output() quantityChange = new EventEmitter<number>();

  increase() {
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }

  decrease() {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }
}
