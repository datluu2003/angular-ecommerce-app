import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div class="bg-white rounded-lg shadow-lg p-8 border border-green-200 text-center">
        <svg class="mx-auto mb-4" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2l4-4" />
          <circle cx="12" cy="12" r="10" stroke="green" stroke-width="2" fill="white" />
        </svg>
        <h2 class="text-2xl font-bold text-green-700 mb-2">Đặt hàng thành công!</h2>
        <p class="text-gray-700 mb-4">Cảm ơn bạn đã mua hàng. Bạn sẽ được chuyển về trang chủ sau vài giây...</p>
        <button (click)="goHome()" class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Về trang chủ ngay</button>
      </div>
    </div>
  `
})
export class OrderSuccessComponent {
  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 5000);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
