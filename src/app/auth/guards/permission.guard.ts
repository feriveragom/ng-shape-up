import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { map, catchError, of } from 'rxjs';

export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const roleService = inject(RoleService);
    const router = inject(Router);
    
    // Obtener el usuario actual
    const currentUser = authService.getCurrentUser();
    
    // Primero verificar si está autenticado
    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }
    
    // Si no tiene roles asignados, no tiene permisos
    if (!currentUser?.roles || currentUser.roles.length === 0) {
      router.navigate(['/dashboard'], { 
        queryParams: { 
          error: 'No tienes los permisos necesarios para acceder a esta sección.' 
        }
      });
      return false;
    }
    
    // Verificar si tiene alguno de los permisos requeridos
    return roleService.getUserPermissions(currentUser.roles).pipe(
      map(permissions => {
        const hasRequiredPermission = requiredPermissions.some(requiredPermission =>
          permissions.some(p => p.id === requiredPermission)
        );
        
        if (hasRequiredPermission) {
          return true;
        }
        
        // Si no tiene el permiso, redirigir al dashboard con un mensaje
        router.navigate(['/dashboard'], { 
          queryParams: { 
            error: 'No tienes los permisos necesarios para acceder a esta sección.' 
          }
        });
        
        return false;
      }),
      catchError(() => {
        // En caso de error, no permitir acceso y redirigir al dashboard
        router.navigate(['/dashboard'], { 
          queryParams: { 
            error: 'Error al verificar permisos. Por favor intenta más tarde.' 
          }
        });
        
        return of(false);
      })
    );
  };
}; 