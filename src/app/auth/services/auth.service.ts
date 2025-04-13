import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole, ShapeUpGroup, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../models/user.model';

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
        password: 'feriveragom',
        token: 'admin-token',
        roles: [UserRole.ADMIN, UserRole.USER], // Superadmin tiene ambos roles
        groups: [ShapeUpGroup.TEAM_LEAD] // Por defecto, asignamos el grupo TEAM_LEAD al superadmin
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
      roles: [UserRole.USER], // Rol por defecto
      groups: [] // Sin grupos por defecto
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
      u.username === credentials.username && 
      credentials.password === credentials.password // Usar contraseña del usuario
    );

    if (user) {
      // Verificar si el usuario está habilitado (tiene el rol USER)
      if (!user.roles?.includes(UserRole.USER)) {
        return throwError(() => new Error('Usuario deshabilitado. Contacte al administrador.'));
      }
      return of({ ...user });
    } else {
      return throwError(() => new Error('Username o contraseña incorrectos'));
    }
  }

  // Solicitar recuperación de contraseña
  forgotPassword(request: ForgotPasswordRequest): Observable<{username: string, password?: string, isDisabled?: boolean} | null> {
    console.log('Buscando username:', request.username);
    console.log('Lista de usuarios:', this.users);
    
    // Buscar el usuario por username
    const user = this.users.find(u => 
      u.username.toLowerCase() === request.username.toLowerCase()
    );
    
    console.log('Usuario encontrado:', user);
    
    if (user) {
      // Verificar si el usuario está deshabilitado (no tiene el rol USER)
      const isDisabled = !user.roles?.includes(UserRole.USER);
      
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
        console.log('Contraseña reseteada para:', request.username);
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

  // Métodos para gestión de grupos Shape Up

  // Verificar si un usuario pertenece a un grupo
  hasGroup(user: User | null, group: ShapeUpGroup): boolean {
    return !!user?.groups?.includes(group);
  }

  // Verificar si el usuario actual pertenece a un grupo
  currentUserHasGroup(group: ShapeUpGroup): boolean {
    const currentUser = this.currentUserSubject.value;
    return this.hasGroup(currentUser, group);
  }

  // Obtener todos los grupos de un usuario
  getUserGroups(userId: string): Observable<ShapeUpGroup[]> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return throwError(() => new Error('Usuario no encontrado'));
    }
    return of(user.groups || []).pipe(delay(300));
  }

  // Actualizar los grupos de un usuario (solo admins)
  updateUserGroups(userId: string, groups: ShapeUpGroup[]): Observable<User> {
    // Verificar si el usuario actual es admin
    if (!this.currentUserHasRole(UserRole.ADMIN)) {
      return throwError(() => new Error('No tienes permiso para modificar grupos'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
    }
    
    // Actualizar grupos del usuario
    this.users[userIndex] = {
      ...this.users[userIndex],
      groups: [...groups]
    };
    
    // Si es el usuario actual, actualizar también en el subject
    if (this.currentUserSubject.value?.id === userId) {
      this.currentUserSubject.next({...this.users[userIndex]});
      localStorage.setItem('currentUser', JSON.stringify(this.users[userIndex]));
    }
    
    console.log('Grupos actualizados:', this.users[userIndex]);
    return of(this.users[userIndex]).pipe(delay(500));
  }

  // Añadir un grupo a un usuario
  addGroupToUser(userId: string, group: ShapeUpGroup): Observable<User> {
    // Verificar si el usuario actual es admin
    if (!this.currentUserHasRole(UserRole.ADMIN)) {
      return throwError(() => new Error('No tienes permiso para modificar grupos'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
    }
    
    // Si el usuario ya tiene este grupo, no hacemos nada
    if (this.users[userIndex].groups?.includes(group)) {
      return of(this.users[userIndex]);
    }
    
    // Clonar el array de grupos actual o crear uno nuevo
    const updatedGroups = [...(this.users[userIndex].groups || []), group];
    
    // Actualizar el usuario
    this.users[userIndex] = {
      ...this.users[userIndex],
      groups: updatedGroups
    };
    
    // Si es el usuario actual, actualizar también en el subject
    if (this.currentUserSubject.value?.id === userId) {
      this.currentUserSubject.next({...this.users[userIndex]});
      localStorage.setItem('currentUser', JSON.stringify(this.users[userIndex]));
    }
    
    console.log('Grupo añadido:', this.users[userIndex]);
    return of(this.users[userIndex]).pipe(delay(500));
  }

  // Quitar un grupo a un usuario
  removeGroupFromUser(userId: string, group: ShapeUpGroup): Observable<User> {
    // Verificar si el usuario actual es admin
    if (!this.currentUserHasRole(UserRole.ADMIN)) {
      return throwError(() => new Error('No tienes permiso para modificar grupos'));
    }
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
    }
    
    // Si el usuario no tiene grupos o no tiene este grupo, no hacemos nada
    if (!this.users[userIndex].groups || !this.users[userIndex].groups.includes(group)) {
      return of(this.users[userIndex]);
    }
    
    // Filtrar los grupos para quitar el especificado
    const updatedGroups = this.users[userIndex].groups.filter(g => g !== group);
    
    // Actualizar el usuario
    this.users[userIndex] = {
      ...this.users[userIndex],
      groups: updatedGroups
    };
    
    // Si es el usuario actual, actualizar también en el subject
    if (this.currentUserSubject.value?.id === userId) {
      this.currentUserSubject.next({...this.users[userIndex]});
      localStorage.setItem('currentUser', JSON.stringify(this.users[userIndex]));
    }
    
    console.log('Grupo eliminado:', this.users[userIndex]);
    return of(this.users[userIndex]).pipe(delay(500));
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
    
    // Si el usuario es el superadmin, no permitir cambios en sus roles
    if (this.users[userIndex].username === 'superadmin') {
      return throwError(() => new Error('No se pueden modificar los roles del superadmin'));
    }
    
    // Si el usuario tiene el rol ADMIN, asegurarse de que también tenga USER
    if (roles.includes(UserRole.ADMIN) && !roles.includes(UserRole.USER)) {
      roles.push(UserRole.USER);
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