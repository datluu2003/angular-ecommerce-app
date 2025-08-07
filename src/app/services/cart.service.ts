import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  description?: string;
  originalPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  // Cart open/close state
  private isCartOpenSubject = new BehaviorSubject<boolean>(false);
  public isCartOpen$ = this.isCartOpenSubject.asObservable();

  constructor() {
    // Load cart from localStorage nếu đang ở trình duyệt
    this.loadCartFromStorage();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  addToCart(product: any, quantity: number): CartItem {
    const existingItemIndex = this.cartItems.findIndex(item => item.id === product._id);
    
    if (existingItemIndex > -1) {
      // If item exists, update quantity
      this.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: this.getProductImage(product),
        slug: product.slug,
        description: product.description || '',
        originalPrice: product.originalPrice || undefined
      };
      this.cartItems.push(newItem);
    }

    this.saveCartToStorage();
    this.cartItemsSubject.next([...this.cartItems]);
    
    // Return the added/updated item for toast display
    const updatedItem = this.cartItems.find(item => item.id === product._id)!;
    return updatedItem;
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.saveCartToStorage();
    this.cartItemsSubject.next([...this.cartItems]);
  }

  updateQuantity(productId: string, quantity: number): void {
    const itemIndex = this.cartItems.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItems[itemIndex].quantity = quantity;
        this.saveCartToStorage();
        this.cartItemsSubject.next([...this.cartItems]);
      }
    }
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
    this.cartItemsSubject.next([]);
  }

  openCart(): void {
    this.isCartOpenSubject.next(true);
  }

  closeCart(): void {
    this.isCartOpenSubject.next(false);
  }

  toggleCart(): void {
    this.isCartOpenSubject.next(!this.isCartOpenSubject.value);
  }

  isCartOpen(): boolean {
    return this.isCartOpenSubject.value;
  }

  private getProductImage(product: any): string {
    if (!product) return '/default.png';
    let imgSrc = product.image;
    if (Array.isArray(imgSrc)) {
      imgSrc = imgSrc.length > 0 ? imgSrc[0] : '';
    } else if (typeof imgSrc === 'string' && imgSrc.trim().startsWith('[')) {
      try {
        const arr = JSON.parse(imgSrc);
        imgSrc = Array.isArray(arr) && arr.length > 0 ? arr[0] : '';
      } catch {
        imgSrc = '';
      }
    }
    return imgSrc || '/default.png';
  }

  private saveCartToStorage(): void {
    if (this.isBrowser()) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  private loadCartFromStorage(): void {
    if (this.isBrowser()) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          this.cartItems = JSON.parse(savedCart);
          this.cartItemsSubject.next([...this.cartItems]);
        } catch (error) {
          // ...existing code...
          this.cartItems = [];
        }
      }
    }
  }
}
