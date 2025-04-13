import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { permissionGuard } from './auth/guards/permission.guard';

export const routes: Routes = [
  // Ruta pública por defecto
  {
    path: '',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },

  // Rutas de autenticación agrupadas
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/pages/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      }
    ]
  },

  // Rutas protegidas con lazy loading
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        canActivate: [permissionGuard(['INVITADO'])],
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'user-management',
        canActivate: [permissionGuard(['ADMINISTRACION_TOTAL'])],
        loadComponent: () => import('./features/user-management/user-management.component').then(m => m.UserManagementComponent)
      }
    ]
  },

  // Ruta para página no encontrada
  {
    path: '**',
    redirectTo: ''
  }
];
