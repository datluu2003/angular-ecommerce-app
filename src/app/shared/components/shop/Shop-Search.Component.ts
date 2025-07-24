import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-shop-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="flex gap-2">
      <input
        [formControl]="searchControl"
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  `
})
export class ShopSearchComponent implements OnInit {
  @Output() searchTermChange = new EventEmitter<string>();
  @Input() searchTerm: string = '';

  searchControl = new FormControl('');

  ngOnInit() {
    // Đặt giá trị ban đầu
    this.searchControl.setValue(this.searchTerm, {emitEvent: false});
    
    this.searchControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe(value => {
        const safeValue = value ?? '';
        if(safeValue.trim().length >= 2 || safeValue.trim() === ''){
          this.searchTermChange.emit(safeValue.trim());
        }
      });
  }
}
