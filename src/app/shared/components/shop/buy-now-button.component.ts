import { Component } from '@angular/core';

@Component({
  selector: 'app-buy-now-button',
  standalone: true,
  template: `<button class="w-full py-2.5 px-2 rounded bg-gradient-to-r from-green-400 to-lime-500 text-white font-medium text-[12.5px] shadow hover:from-lime-500 hover:to-green-600 focus:bg-green-600 active:bg-green-700 focus:text-white active:text-white transition">Mua ngay</button>`
})
export class BuyNowButtonComponent {} 