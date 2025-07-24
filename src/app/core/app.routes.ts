import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../shared/components/home/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'shop',
    loadComponent: () => import('../shared/components/shop/shop-page.component').then(m => m.ShopPageComponent),
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'login',
    loadComponent: () => import('../shared/components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('../shared/components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  // Có thể thêm các route khác ở đây
];
