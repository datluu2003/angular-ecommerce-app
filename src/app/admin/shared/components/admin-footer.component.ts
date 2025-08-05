import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="w-full bg-slate-900 text-slate-200 py-6 border-t border-slate-800 shadow-inner" [ngStyle]="{ 'padding-left': sidebarWidth }">
      <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div class="flex-1 flex items-center justify-start gap-2">
          <img src="/assets/admin-avatar.png" alt="Avatar" class="w-7 h-7 rounded-full border border-slate-700" />
          <span class="font-semibold">{{ adminName || 'Admin' }}</span>
          <span class="flex items-center gap-1 text-green-400 ml-2">
            <span class="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span class="hidden md:inline">Online</span>
          </span>
        </div>
        <div class="flex-1 flex items-center justify-center">
          <span class="text-xs text-slate-400">&copy; {{ year }} Powered by Your Team</span>
        </div>
        <div class="flex-1 flex items-center justify-end">
          <a (click)="goToClient()" class="text-blue-400 hover:text-blue-500 cursor-pointer flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6" /></svg>
            <span class="hidden md:inline">Client</span>
          </a>
        </div>
      </div>
    </footer>
  `
})
export class AdminFooterComponent {
  get sidebarWidth() {
    // Sidebar mặc định là 256px (w-64) hoặc 80px (w-20) nếu collapsed
    // Có thể lấy trạng thái từ localStorage hoặc service nếu cần
    // Ở đây mặc định là 256px
    return '256px';
  }
  year = new Date().getFullYear();
  adminName = '';
  constructor(private router: Router) {
    this.adminName = localStorage.getItem('adminName') || 'Admin';
  }
  goToClient() {
    this.router.navigate(['/']);
  }
}
