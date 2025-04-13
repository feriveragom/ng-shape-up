import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ShapeUpGroup } from '../models/user.model';

export const groupGuard = (allowedGroups: ShapeUpGroup[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    // Obtener el usuario actual
    const currentUser = authService.getCurrentUser();
    
    // Primero verificar si está autenticado
    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }

    // Verificar si el usuario tiene alguno de los grupos permitidos
    const hasRequiredGroup = allowedGroups.some(group => 
      authService.hasGroup(currentUser, group)
    );

    if (hasRequiredGroup) {
      return true;
    }

    // Si el usuario está autenticado pero no tiene el grupo requerido, 
    // redirigir al dashboard con un mensaje
    router.navigate(['/dashboard'], { 
      queryParams: { 
        error: 'No tienes permiso para acceder a esta sección. Se requiere pertenecer a uno de los grupos especificados.' 
      }
    });
    
    return false;
  };
}; 