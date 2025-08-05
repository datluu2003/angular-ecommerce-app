import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../shared/components/header.component';
import { FooterComponent } from '../shared/components/footer.component';
import { ToastContainerComponent } from '../shared/components/toast/toast-container.component';
import { CartComponent } from '../shared/components/cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    ToastContainerComponent,
    CartComponent,
  ],
  templateUrl: './app.html'
})
export class App {
  protected title = 'my-first-angular-app';
  outletKey = '';
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.outletKey = event.urlAfterRedirects;
        this.isAdminRoute = this.outletKey.startsWith('/admin');
      }
    });
    // Khởi tạo giá trị ban đầu
    this.isAdminRoute = this.router.url.startsWith('/admin');
  }
}
