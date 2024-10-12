import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
{
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
},
  {
    path: 'home',
    
    loadComponent: () =>
      import('./pages/home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then((mod) => mod.ProductsComponent),
  },
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then((mod) => mod.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((mod) => mod.CartComponent),
  },
  {
    path: 'appointment',
    loadComponent: () =>
      import('./pages/appointment/appointment.component').then((mod) => mod.AppointmentComponent),
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
        loadComponent: () => import('./pages/auth/login/login.component').then( m => m.LoginComponent)
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/auth/signup/signup.component').then( m => m.SignupComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then( m => m.ForgotPasswordComponent)
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home'
  },
];
