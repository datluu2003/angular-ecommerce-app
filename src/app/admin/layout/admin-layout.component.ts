import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminHeaderComponent } from '../shared/components/admin-header.component';
import { AdminFooterComponent } from '../shared/components/admin-footer.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AdminHeaderComponent, AdminFooterComponent],
  template: `
    <div class="admin-layout min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <!-- Admin Header -->
      <admin-header></admin-header>
      <!-- Mobile Menu Overlay -->
      <div *ngIf="isMobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" (click)="toggleMobileMenu()"></div>
      <!-- Sidebar -->
      <aside [class]="getSidebarClasses()">
        <nav class="mt-6 px-3">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item group flex items-center px-3 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-xl mb-2">
            <span class="font-medium truncate">Dashboard</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="active" class="nav-item group flex items-center px-3 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-600/20 hover:to-amber-600/20 rounded-xl mb-2">
            <span class="font-medium truncate">Quản lý Sản phẩm</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item group flex items-center px-3 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-green-600/20 hover:to-emerald-600/20 rounded-xl mb-2">
            <span class="font-medium truncate">Quản lý Users</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-item group flex items-center px-3 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-rose-600/20 rounded-xl mb-2">
            <span class="font-medium truncate">Quản lý Đơn hàng</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active" class="nav-item group flex items-center px-3 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 rounded-xl mb-2">
            <span class="font-medium truncate">Quản lý Danh mục</span>
          </a>
        </nav>
      </aside>
      <!-- Main Content Area -->
      <main [class]="getMainClasses()">
        <!-- Page Content -->
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </main>
      <!-- Admin Footer -->
      <admin-footer></admin-footer>
    </div>
  `,
  styles: [`
    .admin-layout {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .nav-item.active {
      /* Sử dụng class trực tiếp trong template thay vì @apply */
    }
  `]
})
export class AdminLayoutComponent implements OnDestroy {
  // Responsive state
  isCollapsed = false;
  isMobileMenuOpen = false;
  isDesktop = true;
  
  // Current admin user
  currentAdmin: any = null;
  
  // Statistics counters
  userCount = 1250;
  productCount = 89;
  orderCount = 234;
  todayRevenue = 15750000;
  newOrders = 12;
  onlineUsers = 48;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.checkScreenSize();
    this.loadCurrentAdmin();
    
    // Listen to window resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', () => this.checkScreenSize());
    }
  }

  // Screen size detection
  checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      this.isDesktop = window.innerWidth >= 1024;
      if (this.isDesktop) {
        this.isMobileMenuOpen = false;
      } else {
        this.isCollapsed = false;
      }
    }
  }

  // Sidebar controls
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // CSS class getters
  getSidebarClasses(): string {
    return `fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-50 transition-all duration-300 ease-in-out ${
      this.isCollapsed ? 'w-20' : 'w-64'
    } ${
      this.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`;
  }

  getMainClasses(): string {
    return `transition-all duration-300 ease-in-out min-h-screen ${
      this.isDesktop 
        ? this.isCollapsed 
          ? 'ml-20' 
          : 'ml-64'
        : 'ml-0'
    }`;
  }

  // Page title management
  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/admin/dashboard')) return 'Dashboard';
    if (url.includes('/admin/users')) return 'Quản lý Users';
    if (url.includes('/admin/products')) return 'Quản lý Sản phẩm';
    if (url.includes('/admin/categories')) return 'Quản lý Danh mục';
    if (url.includes('/admin/orders')) return 'Quản lý Đơn hàng';
    return 'Admin Panel';
  }

  getPageDescription(): string {
    const url = this.router.url;
    if (url.includes('/admin/dashboard')) return 'Tổng quan hệ thống và thống kê';
    if (url.includes('/admin/users')) return 'Quản lý tài khoản người dùng';
    if (url.includes('/admin/products')) return 'Quản lý sản phẩm và kho hàng';
    if (url.includes('/admin/categories')) return 'Quản lý danh mục sản phẩm';
    if (url.includes('/admin/orders')) return 'Quản lý đơn hàng và thanh toán';
    return 'Hệ thống quản trị';
  }

  // Utility methods
  getCurrentDateTime(): string {
    return new Date().toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  loadCurrentAdmin(): void {
    this.currentAdmin = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
