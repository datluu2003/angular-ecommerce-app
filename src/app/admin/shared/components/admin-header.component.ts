import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-header',
  standalone: true,
  template: `
    <header class="w-full bg-slate-900 text-slate-200 py-4 px-6 flex items-center justify-between border-b border-slate-800 shadow-lg">
      <div class="flex items-center gap-4">
        <img src="/assets/admin-avatar.png" alt="Avatar" class="w-10 h-10 rounded-full border border-slate-700" />
        <div>
          <span class="font-bold text-lg">{{ adminName || 'Admin' }}</span>
          <span class="ml-2 text-xs text-green-400">Online</span>
        </div>
      </div>
      <nav class="flex items-center gap-4">
          <!-- Removed 'Về giao diện Client' button -->
          <button class="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition" (click)="logout()" aria-label="Đăng xuất">
            <span class="material-icons">logout</span>
          </button>
      </nav>
    </header>
  `
})
export class AdminHeaderComponent {
  adminName = '';
  constructor(private router: Router) {
    // Giả lập lấy tên admin, bạn có thể truyền qua Input hoặc lấy từ service
    this.adminName = localStorage.getItem('adminName') || 'Admin';
  }
  goToClient() {
    this.router.navigate(['/']);
  }
  logout() {
    localStorage.removeItem('adminName');
    this.router.navigate(['/auth/login']);
  }
}