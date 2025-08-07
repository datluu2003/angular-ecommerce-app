import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

export const routes: Routes = [
  {
    path: 'checkout',
    loadComponent: () => import('../shared/components/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [AuthGuard]
  },
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
    path: 'cart',
    loadComponent: () => import('../shared/components/cart/cart-page.component').then(m => m.CartPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('../shared/components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('../shared/components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('../shared/components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('../admin/admin-routes').then(m => m.adminRoutes),
    canActivate: [AdminGuard]
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('../shared/components/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    runGuardsAndResolvers: 'always'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
