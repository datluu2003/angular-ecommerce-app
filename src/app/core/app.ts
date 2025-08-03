import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../shared/components/header.component';
import { FooterComponent } from '../shared/components/footer.component';
import { ToastContainerComponent } from '../shared/components/toast/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.html'
})
export class App {
  protected title = 'my-first-angular-app';
  outletKey = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.outletKey = event.urlAfterRedirects;
      }
    });
  }
}
