import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { permissionGuard } from './permission.guard';
import { UserRole } from '../models/user.model';
import { map, catchError, of } from 'rxjs';

// DEPRECATED: Este guard está obsoleto y se mantiene sólo por compatibilidad.
// Usar permissionGuard en su lugar.
export const roleGuard = (roles: string[]): CanActivateFn => {
  return (route, state) => {
    const roleService = inject(RoleService);
    const authService = inject(AuthService);
    const router = inject(Router);
    
    console.warn('roleGuard está obsoleto. Se recomienda usar permissionGuard directamente.');
    
    // Si el usuario no está autenticado, redirigir al login
    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }
    
    // Obtener los permisos asociados a cada rol
    const requiredPermissions: string[] = [];
    
    // Para cada rol, buscar sus permisos
    if (roles.includes(UserRole.ADMINISTRADOR)) {
      requiredPermissions.push('ADMINISTRACION_TOTAL');
    }
    
    if (roles.includes(UserRole.INVITADO)) {
      requiredPermissions.push('INVITADO');
    }
    
    // Si no se encontraron permisos para los roles especificados, denegar acceso
    if (requiredPermissions.length === 0) {
      console.error('No se encontraron permisos asociados a los roles:', roles);
      router.navigate(['/dashboard'], { 
        queryParams: { 
          error: 'Configuración de permisos incorrecta, contacte al administrador.' 
        }
      });
      return false;
    }
    
    // Verificar los permisos del usuario actual
    const currentUser = authService.getCurrentUser();
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