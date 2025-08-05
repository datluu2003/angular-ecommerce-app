import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../admin/shared/components/admin-header.component';
import { AdminFooterComponent } from '../admin/shared/components/admin-footer.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminHeaderComponent, AdminFooterComponent],
  template: `
    <div class="admin-layout">
      <admin-header></admin-header>
      <router-outlet></router-outlet>
      <admin-footer></admin-footer>
    </div>
  `
})
export class AdminLayoutComponent {}
