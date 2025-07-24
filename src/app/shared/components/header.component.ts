import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink],
  template: `
    <header class="relative bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-lg shadow-black/5">
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
            <div class="relative">
              <button class="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.67 5.73a1 1 0 00.96 1.27h9.42a1 1 0 00.96-1.27L15 13M9 19.5a1.5 1.5 0 003 0M20 19.5a1.5 1.5 0 003 0"/>
                </svg>
                <!-- Badge -->
                <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  3
                </span>
              </button>
            </div>

            <!-- User Profile Icon -->
            <div class="relative">
              <button routerLink="/login" class="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
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
export class HeaderComponent {
  mobileOpen = false;
}
