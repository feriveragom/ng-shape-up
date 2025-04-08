import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';
import { UserRole } from './auth/models/user.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  
  // Rutas protegidas
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  
  // Ruta de gestión de usuarios (solo admin)
  {
    path: 'user-management',
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.ADMIN] },
    loadComponent: () => import('./features/user-management/user-management.component')
      .then(m => m.UserManagementComponent)
  },
  
  // Ruta por defecto (redirige a home)
  {
    path: '**',
    redirectTo: ''
  }
];
