import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CheckoutCartSummaryComponent } from './checkout-cart-summary.component';
import { OrderSuccessComponent } from './order-success.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckoutCartSummaryComponent, OrderSuccessComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div *ngIf="!showOrderSuccess">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Thanh toán đơn hàng</h2>
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Form nhập liệu bên trái -->
            <div class="lg:w-2/3">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-6 border-b border-gray-200">
                  <h3 class="text-xl font-semibold text-gray-900">Thông tin giao hàng</h3>
                </div>
                <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input type="text" formControlName="fullName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập họ tên">
                      <div *ngIf="checkoutForm.get('fullName')?.invalid && checkoutForm.get('fullName')?.touched" class="text-red-500 text-xs mt-1">Vui lòng nhập họ tên</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" formControlName="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập email">
                      <div *ngIf="checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched" class="text-red-500 text-xs mt-1">Email không hợp lệ</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input type="tel" formControlName="phone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập số điện thoại">
                      <div *ngIf="checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched" class="text-red-500 text-xs mt-1">SĐT không hợp lệ</div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                      <input type="text" formControlName="city" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập tỉnh/thành phố">
                      <div *ngIf="checkoutForm.get('city')?.invalid && checkoutForm.get('city')?.touched" class="text-red-500 text-xs mt-1">Vui lòng nhập tỉnh/thành phố</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                      <input type="text" formControlName="district" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập quận/huyện">
                      <div *ngIf="checkoutForm.get('district')?.invalid && checkoutForm.get('district')?.touched" class="text-red-500 text-xs mt-1">Vui lòng nhập quận/huyện</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                      <input type="text" formControlName="ward" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập phường/xã">
                      <div *ngIf="checkoutForm.get('ward')?.invalid && checkoutForm.get('ward')?.touched" class="text-red-500 text-xs mt-1">Vui lòng nhập phường/xã</div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng</label>
                    <input type="text" formControlName="address" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập địa chỉ cụ thể">
                    <div *ngIf="checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched" class="text-red-500 text-xs mt-1">Vui lòng nhập địa chỉ cụ thể</div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                    <div class="flex space-x-4">
                      <label class="flex items-center cursor-pointer">
                        <input type="radio" formControlName="paymentMethod" value="cod" class="form-radio text-blue-600">
                        <span class="ml-2">Thanh toán khi nhận hàng (COD)</span>
                      </label>
                      <label class="flex items-center cursor-pointer">
                        <input type="radio" formControlName="paymentMethod" value="bank" class="form-radio text-green-600">
                        <span class="ml-2">Chuyển khoản ngân hàng</span>
                      </label>
                      <label class="flex items-center cursor-pointer">
                        <input type="radio" formControlName="paymentMethod" value="momo" class="form-radio text-pink-600">
                        <span class="ml-2">Ví MoMo</span>
                      </label>
                    </div>
                    <div *ngIf="checkoutForm.get('paymentMethod')?.invalid && checkoutForm.get('paymentMethod')?.touched" class="text-red-500 text-xs mt-1">Vui lòng chọn phương thức thanh toán</div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tuỳ chọn)</label>
                    <textarea formControlName="note" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Ghi chú cho đơn hàng..."></textarea>
                  </div>
                  <div class="flex justify-end">
                    <button type="submit" [disabled]="checkoutForm.invalid" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition">Xác nhận thanh toán</button>
                  </div>
                </form>
              </div>
            </div>
            <!-- Thông tin sản phẩm bên phải -->
            <div class="lg:w-1/3">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
                <app-checkout-cart-summary [cartItems]="cartItems"></app-checkout-cart-summary>
              </div>
            </div>
          </div>
        </div>
      </div>
      <app-order-success *ngIf="showOrderSuccess"></app-order-success>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  showOrderSuccess = false;

  constructor(private fb: FormBuilder, private router: Router, private cartService: CartService) {
    const nav = this.router.getCurrentNavigation();
    this.cartItems = nav?.extras.state?.['cart'] || [];
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      city: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      address: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      note: ['']
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const orderData = {
        customerInfo: {
          fullName: this.checkoutForm.value.fullName,
          email: this.checkoutForm.value.email,
          phone: this.checkoutForm.value.phone,
          address: this.checkoutForm.value.address,
          city: this.checkoutForm.value.city,
          district: this.checkoutForm.value.district,
          ward: this.checkoutForm.value.ward
        },
        items: this.cartItems,
        paymentMethod: this.checkoutForm.value.paymentMethod,
        notes: this.checkoutForm.value.note
      };
      fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
        .then(res => res.json())
        .then(data => {
          this.cartService.clearCart();
          this.showOrderSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 5000);
        })
        .catch(err => {
          alert('Có lỗi xảy ra khi đặt hàng!');
        });
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}


