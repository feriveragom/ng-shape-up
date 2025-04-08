import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Si hay un token y la petición no es a un dominio externo
  if (token && req.url.includes('/api')) {
    // Clonamos la petición y añadimos el header de autorización
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq);
  }
  
  // Si no hay token o es una petición externa, la dejamos pasar sin modificar
  return next(req);
}; 