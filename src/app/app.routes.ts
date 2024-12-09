import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',

    loadComponent: () =>
      import('./pages/home/home.component').then((mod) => mod.HomeComponent),
    // data: { showHero: true },
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (mod) => mod.ProductsComponent
      ),
      // data: { showHero: false },
  },
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then(
        (mod) => mod.ProductDetailComponent
      ),
      // data: { showHero: false },
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((mod) => mod.CartComponent),
    // data: { showHero: false },
  },
  {
    path: 'appointment',
    loadComponent: () =>
      import('./pages/appointment/appointment.component').then(
        (mod) => mod.AppointmentComponent
      ),
      // data: { showHero: false },
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (mod) => mod.ProfileComponent
      ),
      canMatch: [ async () => await inject(AuthService).authGuard()],
    // data: { showHero: false },
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout/checkout.component').then(
        (mod) => mod.CheckoutComponent
      ),
      canMatch: [ async () => await inject(AuthService).authGuard()],
    // data: { showHero: false },
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      // {
      //   path: '',
      //   loadComponent: () => import('./pages/login/login.component').then( m => m.LoginComponent),
      //   pathMatch: 'full'
      // },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/auth/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ],
    canMatch: [ async () => await inject(AuthService).autoLoginGuard()],
    // data: { showHero: false },
  },
  // {
  //   path: '**',
  //   pathMatch: 'full',
  //   redirectTo: 'home',
  // },
];
