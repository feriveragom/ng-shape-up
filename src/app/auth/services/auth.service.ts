import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observable para rastrear el estado de autenticación
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Simulación de usuarios (en una app real esto estaría en el backend)
  private users: User[] = []; // Arreglo vacío, sin usuario demo

  constructor(private router: Router) {
    // Verificamos si ya tenemos un administrador por defecto
    const adminExists = this.users.some(u => u.username === 'superadmin');
    
    // Si no existe, lo creamos
    if (!adminExists) {
      this.users.push({
        id: '0',
        username: 'superadmin',
        password: 'superadmin',
        token: 'admin-token',
        roles: [UserRole.ADMINISTRADOR, UserRole.INVITADO] // Superadmin con rol Administrador
      });
    }
    
    // Restaurar usuario de sesión si existe
    this.checkAuthStatus();
  }

  // Verificar si hay un usuario en localStorage
  checkAuthStatus(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
    }
  }

  // Método para iniciar sesión
  login(credentials: LoginRequest): Observable<User> {
    // Simulando una respuesta del servidor con delay
    return this.validateUser(credentials)
      .pipe(
        delay(800), // Simulando latencia de red
        tap(user => {
          this.setSession(user);
          this.currentUserSubject.next(user);
        })
      );
  }

  // Método para registro
  register(userData: RegisterRequest): Observable<User> {
    // Verificar si el username ya existe
    const existingUser = this.users.find(u => u.username === userData.username);
    if (existingUser) {
      return throwError(() => new Error('El username ya está registrado'));
    }

    // Verificar si intenta registrarse con el nombre del superadmin
    if (userData.username === 'superadmin') {
      return throwError(() => new Error('Este nombre de usuario está reservado'));
    }

    // Crear nuevo usuario INCLUYENDO la contraseña
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      username: userData.username,
      password: userData.password,
      token: `token-${Date.now()}`,
      roles: [UserRole.INVITADO] // Rol Invitado por defecto
    };

    // Agregar a la lista de usuarios
    this.users.push(newUser);

    // Retornar respuesta simulada
    return of(newUser).pipe(
      delay(800), // Simulando latencia
      tap(user => {
        this.setSession(user);
        this.currentUserSubject.next(user);
      })
    );
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Obtener token (útil para interceptores)
  getToken(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  // Métodos privados auxiliares
  private setSession(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private validateUser(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => 
      u.username === credentials.username && 
      credentials.password === credentials.password // Usar contraseña del usuario
    );

    if (user) {
      // Verificar si el usuario está habilitado (tiene el rol INVITADO)
      if (!user.roles?.includes(UserRole.INVITADO)) {
        return throwError(() => new Error('Usuario deshabilitado. Contacte al administrador.'));
      }
      return of({ ...user });
    } else {
      return throwError(() => new Error('Username o contraseña incorrectos'));
    }
  }

  // Solicitar recuperación de contraseña
  forgotPassword(request: ForgotPasswordRequest): Observable<{username: string, password?: string, isDisabled?: boolean} | null> {
        
    // Buscar el usuario por username
    const user = this.users.find(u => 
      u.username.toLowerCase() === request.username.toLowerCase()
    );
    
    if (user) {
      // Verificar si el usuario está deshabilitado (no tiene el rol INVITADO)
      const isDisabled = !user.roles?.includes(UserRole.INVITADO);
      
      if (isDisabled) {
        // Si el usuario está deshabilitado, devolver sólo el username y un indicador
        return of({
          username: user.username,
          isDisabled: true
        }).pipe(
          delay(500)
        );
      } else {
        // Si el usuario está habilitado, devolver sus credenciales
        return of({
          username: user.username,
          password: user.password || 'Sin contraseña guardada'
        }).pipe(
          delay(500)
        );
      }
    } else {
      // Si no existe, devolver null
      return of(null).pipe(
        delay(500)
      );
    }
  }

  // Resetear contraseña con token
  resetPassword(request: ResetPasswordRequest): Observable<void> {
    // En una app real, verificaríamos el token y cambiaríamos la contraseña
    return of(undefined).pipe(
      delay(800),  // Simulamos latencia
      tap(() => {
        
      })
    );
  }

  // Método para verificar si un usuario tiene un rol específico
  hasRole(user: User | null, role: string): boolean {
    return !!user?.roles?.includes(role);
  }

  // Método para verificar si el usuario actual tiene un rol
  currentUserHasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.value;
    return this.hasRole(currentUser, role);
  }

  // Método para obtener todos los usuarios (solo para admins)
  getAllUsers(): Observable<User[]> {
    // Verificar si el usuario actual es admin
    if (!this.currentUserHasRole(UserRole.ADMINISTRADOR)) {
      return throwError(() => new Error('No tienes permiso para ver esta información'));
    }
    
    // Copiar usuarios ocultando contraseñas por seguridad
    const safeUsers = this.users.map(user => ({
      ...user,
      password: undefined
    }));
    
    return of(safeUsers).pipe(delay(800));
  }

  // Método para actualizar roles
  updateUserRoles(userId: string, roles: string[]): Observable<User> {
    // Verificar si el usuario actual es admin
    if (!this.currentUserHasRole(UserRole.ADMINISTRADOR)) {
      return throwError(() => new Error('No tienes permiso para modificar roles'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
    }
    
    // Si el usuario es el superadmin, no permitir cambios en sus roles
    if (this.users[userIndex].username === 'superadmin') {
      return throwError(() => new Error('No se pueden modificar los roles del superadmin'));
    }
    
    // Actualizar roles del usuario
    this.users[userIndex] = {
      ...this.users[userIndex],
      roles: [...roles]
    };
    
    // Si es el usuario actual, actualizar también en el subject
    if (this.currentUserSubject.value?.id === userId) {
      this.currentUserSubject.next({...this.users[userIndex]});
      localStorage.setItem('currentUser', JSON.stringify(this.users[userIndex]));
    }
    
    return of(this.users[userIndex]).pipe(delay(500));
  }

  // Añadir este método público
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Método para crear usuarios desde el panel de administración
  createUser(userData: RegisterRequest): Observable<User> {
    // Verificar si el usuario actual es admin
    if (!this.currentUserHasRole(UserRole.ADMINISTRADOR)) {
      return throwError(() => new Error('No tienes permiso para crear usuarios'));
    }

    // Verificar si el username ya existe
    const existingUser = this.users.find(u => u.username === userData.username);
    if (existingUser) {
      return throwError(() => new Error('El username ya está registrado'));
    }

    // Verificar si intenta registrarse con el nombre del superadmin
    if (userData.username === 'superadmin') {
      return throwError(() => new Error('Este nombre de usuario está reservado'));
    }

    // Crear nuevo usuario INCLUYENDO la contraseña
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      username: userData.username,
      password: userData.password,
      token: `token-${Date.now()}`,
      roles: [UserRole.INVITADO] // Rol Invitado por defecto
    };

    // Agregar a la lista de usuarios
    this.users.push(newUser);

    // Retornar respuesta simulada SIN cambiar el usuario autenticado
    return of(newUser).pipe(
      delay(800) // Simulando latencia
    );
  }
} 