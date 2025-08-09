import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="pagination-custom">
      <button (click)="goToPage(1)" [disabled]="currentPage === 1">«</button>
      <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">‹</button>
      <ng-container *ngFor="let page of pages">
        <button
          (click)="goToPage(page)"
          [class.current]="page === currentPage"
        >{{ page }}</button>
      </ng-container>
      <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">›</button>
      <button (click)="goToPage(totalPages)" [disabled]="currentPage === totalPages">»</button>
    </nav>
  `,
  styles: [
    `
    .pagination-custom {
      display: flex;
      justify-content: center;
      gap: 4px;
      margin: 12px 0;
    }
    .pagination-custom button {
      background: #f3f4f6;
      color: #2563eb;
      border-radius: 6px;
      padding: 0.25rem 0.75rem;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s, color 0.2s;
    }
    .pagination-custom button.current {
      background: #2563eb;
      color: #fff;
      font-weight: bold;
      border: 2px solid #1e40af;
      z-index: 2;
    }
    .pagination-custom button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    `
  ]
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
  }

  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}
