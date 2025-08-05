import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MiniCartComponent } from './cart/mini-cart.component';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, CommonModule, MiniCartComponent, ClickOutsideDirective],
  template: `
    <header class="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-lg shadow-black/5">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
      <nav class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3 group">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span class="text-white font-bold text-lg">L</span>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Logo
            </span>
          </div>
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <a routerLink="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
              Home
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a routerLink="/shop" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
              Shop
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
              About
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
              Services
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
              Contact
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          <!-- Action Icons & Mobile Menu -->
          <div class="flex items-center space-x-4">
            <!-- Cart Icon with Badge -->
            <div class="relative" (clickOutside)="closeMiniCart()">
              <button 
                (click)="toggleMiniCart()"
                class="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.67 5.73a1 1 0 00.96 1.27h9.42a1 1 0 00.96-1.27L15 13M9 19.5a1.5 1.5 0 003 0M20 19.5a1.5 1.5 0 003 0"/>
                </svg>
                <!-- Badge -->
                <span 
                  *ngIf="totalItems > 0"
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                >
                  {{ totalItems }}
                </span>
              </button>
              <!-- Mini Cart Dropdown -->
              <app-mini-cart [isOpen]="miniCartOpen"></app-mini-cart>
            </div>

            <!-- User Profile Icon -->
            <div class="relative" *ngIf="!isLoggedIn">
              <button routerLink="/login" class="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </button>
            </div>

            <!-- User Dropdown when logged in -->
            <div class="relative" *ngIf="isLoggedIn" (clickOutside)="closeUserDropdown()">
              <button 
                (click)="toggleUserDropdown()"
                class="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <img 
                  [src]="currentUser?.avatar || '/default.png'" 
                  [alt]="currentUser?.Username || currentUser?.username"
                  class="w-8 h-8 rounded-full border-2 border-gray-200"
                />
                <span class="hidden md:block font-medium">{{ currentUser?.Username || currentUser?.username }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- User Dropdown Menu -->
              <div *ngIf="userDropdownOpen" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div class="p-4 border-b border-gray-200">
                  <p class="font-medium text-gray-900">{{ currentUser?.Username || currentUser?.username }}</p>
                  <p class="text-sm text-gray-500">{{ currentUser?.email }}</p>
                  <span class="inline-block mt-1 px-2 py-1 text-xs rounded-full" 
                        [ngClass]="currentUser?.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'">
                    {{ currentUser?.role === 'admin' ? 'Quản trị viên' : 'Thành viên' }}
                  </span>
                </div>
                <div class="py-2">
                  <a routerLink="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Hồ sơ cá nhân
                  </a>
                  <a *ngIf="currentUser?.role === 'admin'" routerLink="/admin" class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Quản trị
                  </a>
                  <button 
                    (click)="logout()"
                    class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            <!-- Login/Register buttons when not logged in -->
            <div class="hidden md:flex items-center space-x-2" *ngIf="!isLoggedIn">
              <button routerLink="/login" class="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Đăng nhập
              </button>
              <button routerLink="/register" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Đăng ký
              </button>
            </div>

            <!-- Search Icon -->
            <div class="relative">
              <button class="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>

            <!-- Mobile menu button -->
            <button
              class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              (click)="mobileOpen = !mobileOpen"
              aria-label="Toggle mobile menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- Mobile Navigation -->
        <div
          class="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg animate-slide-down"
          [ngClass]="{ 'block': mobileOpen, 'hidden': !mobileOpen }"
        >
          <div class="px-4 py-6 space-y-4">
            <a routerLink="/" class="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">Home</a>
            <a routerLink="/shop" class="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">Shop</a>
            <a href="#" class="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">About</a>
            <a href="#" class="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">Services</a>
            <a href="#" class="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">Contact</a>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  mobileOpen = false;
  miniCartOpen = false;
  userDropdownOpen = false;
  totalItems = 0;
  isLoggedIn = false;
  currentUser: User | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to cart items
    const cartSub = this.cartService.cartItems$.subscribe(() => {
      this.totalItems = this.cartService.getTotalItems();
      this.cdr.markForCheck();
    });
    
    // Subscribe to auth state
    const authSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.cdr.markForCheck();
    });
    
    // Subscribe to current user
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.cdr.markForCheck();
    });

    this.subscriptions.push(cartSub, authSub, userSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleCart(): void {
    this.cartService.toggleCart();
    this.miniCartOpen = false; // Close mini cart when opening full cart
  }

  toggleMiniCart(): void {
    this.miniCartOpen = !this.miniCartOpen;
    this.userDropdownOpen = false; // Close user dropdown
  }

  closeMiniCart(): void {
    this.miniCartOpen = false;
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
    this.miniCartOpen = false; // Close mini cart
  }

  closeUserDropdown(): void {
    this.userDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.userDropdownOpen = false;
  }
}
