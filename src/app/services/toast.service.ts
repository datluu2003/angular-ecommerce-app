import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { CartItem } from './cart.service';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  product?: CartItem;
  duration: number;
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastData[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  
  // Lưu reference của các timeout để có thể clear khi cần
  private timeoutRefs = new Map<string, any>();

  constructor(private ngZone: NgZone) {}

  public getToastCount(): number {
    return this.toastsSubject.value.length;
  }

  showCartToast(product: CartItem): void {
    const currentToasts = this.toastsSubject.value;
    const existingIndex = currentToasts.findIndex(
      t => t.product && t.product.id === product.id
    );

    const uniqueId = `cart-${product.id}`;

    if (existingIndex > -1) {
      // Nếu đã có toast, cập nhật dữ liệu
      const updatedToast = { ...currentToasts[existingIndex] };
      updatedToast.product = product;
      updatedToast.show = true;
      updatedToast.title = 'Đã thêm vào giỏ hàng!';
      currentToasts[existingIndex] = updatedToast;
      this.toastsSubject.next([...currentToasts]);
      
      // QUAN TRỌNG: Reset lại timeout cho toast này
      if (this.timeoutRefs.has(uniqueId)) {
        clearTimeout(this.timeoutRefs.get(uniqueId));
      }
      
      // Sử dụng rxjs timer thay vì setTimeout
      const subscription = timer(updatedToast.duration).subscribe(() => {
        this.removeToast(uniqueId);
        this.timeoutRefs.delete(uniqueId);
      });
      
      this.timeoutRefs.set(uniqueId, subscription);
    } else {
      // Tạo toast mới
      const toast: ToastData = {
        id: uniqueId,
        type: 'success',
        title: 'Đã thêm vào giỏ hàng!',
        product: product,
        duration: 3000,
        show: true
      };
      
      this.toastsSubject.next([...currentToasts, toast]);
      
      // Sử dụng rxjs timer thay vì setTimeout  
      const subscription = timer(toast.duration).subscribe(() => {
        this.removeToast(toast.id);
        this.timeoutRefs.delete(toast.id);
      });
      
      this.timeoutRefs.set(toast.id, subscription);
    }
  }

  showToast(type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string, duration: number = 3000): void {
    // Kiểm tra toast cảnh báo thao tác quá nhanh
    if (type === 'warning' && message === 'Bạn đang thao tác quá nhanh') {
      const currentToasts = this.toastsSubject.value;
      const exists = currentToasts.some(
        t => t.type === 'warning' && t.message === 'Bạn đang thao tác quá nhanh' && t.show
      );
      if (exists) return;
    }

    const uniqueId = `toast-${type}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const toast: ToastData = {
      id: uniqueId,
      type,
      title,
      message,
      duration,
      show: true
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Sử dụng rxjs timer thay vì setTimeout
    const subscription = timer(duration).subscribe(() => {
      this.removeToast(toast.id);
      this.timeoutRefs.delete(toast.id);
    });
    
    this.timeoutRefs.set(toast.id, subscription);
  }

removeToast(id: string): void {
  const currentToasts = this.toastsSubject.value;
  const idx = currentToasts.findIndex(toast => toast.id === id);
  if (idx > -1) {
    // Clear subscription nếu có
    if (this.timeoutRefs.has(id)) {
      const subscription = this.timeoutRefs.get(id);
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      } else if (subscription) {
        clearTimeout(subscription);
      }
      this.timeoutRefs.delete(id);
    }
    
    // Bước 1: Trigger animation bằng cách set show = false
    const updatedToasts = [...currentToasts];
    updatedToasts[idx] = { ...updatedToasts[idx], show: false };
    this.toastsSubject.next(updatedToasts);
    
    // Bước 2: Xóa toast sau khi animation hoàn tất
    const removeSubscription = timer(500).subscribe(() => {
      const finalToasts = this.toastsSubject.value.filter(toast => toast.id !== id);
      this.toastsSubject.next(finalToasts);
      removeSubscription.unsubscribe();
    });
  }
}

  clearAllToasts(): void {
    // Clear tất cả subscriptions
    this.timeoutRefs.forEach(ref => {
      if (ref && ref.unsubscribe) {
        ref.unsubscribe();
      } else if (ref) {
        clearTimeout(ref);
      }
    });
    this.timeoutRefs.clear();
    
    this.toastsSubject.next([]);
  }
  
  getActiveTimeouts(): number {
    return this.timeoutRefs.size;
  }
}