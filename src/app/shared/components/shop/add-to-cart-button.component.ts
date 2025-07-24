import { Component } from '@angular/core';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  template: `<button class="w-full py-2.5 px-2 rounded bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium text-[12.5px] shadow hover:from-blue-500 hover:to-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:text-white active:text-white transition">Thêm giỏ hàng</button>`
})
export class AddToCartButtonComponent {} 