import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    // Usar el método público en lugar de acceder directamente a la propiedad privada
    const currentUser = authService.getCurrentUser();

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasRequiredRole = allowedRoles.some(role => 
      authService.hasRole(currentUser, role)
    );

    if (hasRequiredRole) {
      return true;
    }

    // Si el usuario está autenticado pero no tiene el rol, redirigir al dashboard
    if (authService.isAuthenticated()) {
      router.navigate(['/dashboard']);
    } else {
      // Si no está autenticado, redirigir al login
      router.navigate(['/auth/login']);
    }
    
    return false;
  };
}; 