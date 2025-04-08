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
    const adminExists = this.users.some(u => u.email === 'feriveragom@gmail.com');
    
    // Si no existe, lo creamos
    if (!adminExists) {
      this.users.push({
        id: '0',
        email: 'feriveragom@gmail.com',
        name: 'Admin',
        password: 'feriveragom',
        token: 'admin-token',
        roles: [UserRole.ADMIN]
      });
      console.log('Admin user created:', this.users);
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
    // Verificar si el email ya existe
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('El email ya está registrado'));
    }

    // Crear nuevo usuario INCLUYENDO la contraseña
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: userData.email,
      name: userData.name,
      password: userData.password,
      token: `token-${Date.now()}`,
      roles: [UserRole.USER] // Rol por defecto
    };

    // Agregar a la lista de usuarios
    this.users.push(newUser);
    console.log('Usuario registrado:', newUser);
    console.log('Lista actualizada de usuarios:', this.users);

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
      u.email === credentials.email && 
      credentials.password === credentials.password // Usar contraseña del usuario
    );

    if (user) {
      return of({ ...user });
    } else {
      return throwError(() => new Error('Email o contraseña incorrectos'));
    }
  }

  // Solicitar recuperación de contraseña
  forgotPassword(request: ForgotPasswordRequest): Observable<{email: string, password: string} | null> {
    console.log('Buscando email:', request.email);
    console.log('Lista de usuarios:', this.users);
    
    // Buscar el usuario por email
    const user = this.users.find(u => 
      u.email.toLowerCase() === request.email.toLowerCase()
    );
    
    console.log('Usuario encontrado:', user);
    
    if (user) {
      // Si existe, devolver sus credenciales
      return of({
        email: user.email,
        password: user.password || 'Sin contraseña guardada'
      }).pipe(
        delay(500)
      );
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
        console.log('Contraseña reseteada para:', request.email);
      })
    );
  }

  // Método para verificar si un usuario tiene un rol específico
  hasRole(user: User | null, role: UserRole): boolean {
    return !!user?.roles?.includes(role);
  }

  // Método para verificar si el usuario actual tiene un rol
  currentUserHasRole(role: UserRole): boolean {
    const currentUser = this.currentUserSubject.value;
    return this.hasRole(currentUser, role);
  }

  // Método para obtener todos los usuarios (solo para admins)
  getAllUsers(): Observable<User[]> {
    // Verificar si el usuario actual es admin
    if (!this.currentUserHasRole(UserRole.ADMIN)) {
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
  updateUserRoles(userId: string, roles: UserRole[]): Observable<User> {
    // Verificar si el usuario actual es admin
    if (!this.currentUserHasRole(UserRole.ADMIN)) {
      return throwError(() => new Error('No tienes permiso para modificar roles'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
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
    
    console.log('Roles actualizados:', this.users[userIndex]);
    return of(this.users[userIndex]).pipe(delay(500));
  }

  // Añadir este método público
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 