import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Role, Permission, UserRole } from '../models/user.model';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roles: Role[] = [];
  private permissions: Permission[] = [];
  
  private rolesSubject = new BehaviorSubject<Role[]>([]);
  public roles$ = this.rolesSubject.asObservable();
  
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();
  
  constructor(private permissionService: PermissionService) {
    this.initializeDefaultPermissions();
    this.initializeDefaultRoles();
    
    // Suscribirse a los cambios en los permisos
    this.permissionService.permissions$.subscribe(permissions => {
      console.log('RoleService: Actualizando permisos desde PermissionService', permissions);
      this.permissions = [...permissions];
      this.permissionsSubject.next(this.permissions);
    });
  }
  
  private initializeDefaultPermissions(): void {
    // Cargar todos los permisos del PermissionService
    this.permissionService.getAllPermissions().subscribe(permissions => {
      console.log('RoleService: Cargando permisos iniciales', permissions);
      this.permissions = [...permissions];
      this.permissionsSubject.next(this.permissions);
    });
  }
  
  private initializeDefaultRoles(): void {
    // Creamos los roles por defecto
    this.roles = [
      {
        id: UserRole.ADMINISTRADOR,
        name: 'Administrador',
        description: 'Rol con todos los permisos del sistema',
        permissions: [] // Lo actualizaremos después
      },
      {
        id: UserRole.INVITADO,
        name: 'Invitado',
        description: 'Rol básico para usuarios registrados',
        permissions: [] // Lo actualizaremos después
      }
    ];
    
    // Esperar a que los permisos estén cargados para actualizar los roles
    this.permissionService.getAllPermissions().subscribe(permissions => {
      // Actualizar roles predefinidos con sus permisos
      this.roles.forEach(role => {
        if (role.id === UserRole.ADMINISTRADOR) {
          role.permissions = permissions.filter(p => p.id === 'ADMINISTRACION_TOTAL');
        } else if (role.id === UserRole.INVITADO) {
          role.permissions = permissions.filter(p => p.id === 'INVITADO');
        }
      });
      
      this.rolesSubject.next([...this.roles]);
    });
  }
  
  // Obtener todos los roles
  getAllRoles(): Observable<Role[]> {
    return of(this.roles).pipe(
      delay(300) // Simulamos latencia
    );
  }
  
  // Obtener un rol por su ID
  getRoleById(roleId: string): Observable<Role | undefined> {
    return of(this.roles.find(r => r.id === roleId)).pipe(
      delay(200)
    );
  }
  
  // Obtener todos los permisos
  getAllPermissions(): Observable<Permission[]> {
    return of(this.permissions).pipe(
      delay(300)
    );
  }
  
  // Comprobar si un usuario tiene un permiso específico
  hasPermission(userRoles: string[], permissionId: string): Observable<boolean> {
    return this.getRolesByIds(userRoles).pipe(
      map(roles => {
        const allPermissions = roles.flatMap(role => role.permissions);
        return allPermissions.some(permission => permission.id === permissionId);
      })
    );
  }
  
  // Obtener roles por sus IDs
  getRolesByIds(roleIds: string[]): Observable<Role[]> {
    return of(this.roles.filter(role => roleIds.includes(role.id))).pipe(
      delay(200)
    );
  }
  
  // Obtener todos los permisos de un usuario
  getUserPermissions(userRoles: string[]): Observable<Permission[]> {
    return this.getRolesByIds(userRoles).pipe(
      map(roles => {
        // Aplanamos todos los permisos de todos los roles y eliminamos duplicados
        const permissionsMap = new Map<string, Permission>();
        
        roles.forEach(role => {
          role.permissions.forEach(permission => {
            permissionsMap.set(permission.id, permission);
          });
        });
        
        return Array.from(permissionsMap.values());
      })
    );
  }
  
  // Crear un nuevo rol
  createRole(role: Omit<Role, 'id'>): Observable<Role> {
    // Generar un ID único basado en el nombre
    const roleId = role.name.toUpperCase().replace(/\s+/g, '_');
    
    // Verificar si ya existe un rol con ese ID
    if (this.roles.some(r => r.id === roleId)) {
      return throwError(() => new Error(`Ya existe un rol con el ID ${roleId}`));
    }
    
    const newRole: Role = {
      ...role,
      id: roleId,
      permissions: [] // Iniciar sin permisos
    };
    
    // Crear una copia del array antes de modificarlo
    this.roles = [...this.roles, newRole];
    
    // Emitir una copia del array actualizado
    this.rolesSubject.next([...this.roles]);
    
    return of(newRole).pipe(
      delay(300)
    );
  }
  
  // Actualizar un rol existente
  updateRole(roleId: string, updates: Partial<Role>): Observable<Role | undefined> {
    // Verificar si está intentando modificar un rol predefinido
    if (roleId === 'ADMINISTRADOR' || roleId === 'INVITADO') {
      return throwError(() => new Error('No se pueden modificar los roles predefinidos del sistema'));
    }
    
    const index = this.roles.findIndex(r => r.id === roleId);
    
    if (index !== -1) {
      // Crear una copia del array y actualizar el rol
      const updatedRole = {
        ...this.roles[index],
        ...updates
      };
      
      // Crear un nuevo array con el rol actualizado
      const updatedRoles = [...this.roles];
      updatedRoles[index] = updatedRole;
      this.roles = updatedRoles;
      
      // Emitir una copia del array actualizado
      this.rolesSubject.next([...this.roles]);
      
      return of(this.roles[index]).pipe(delay(300));
    }
    
    return of(undefined).pipe(delay(300));
  }
  
  // Eliminar un rol
  deleteRole(roleId: string): Observable<boolean> {
    // Verificar si está intentando eliminar un rol predefinido
    if (roleId === 'ADMINISTRADOR' || roleId === 'INVITADO') {
      return throwError(() => new Error('No se pueden eliminar los roles predefinidos del sistema'));
    }
    
    const initialLength = this.roles.length;
    
    // Crear una copia del array sin el rol a eliminar
    this.roles = this.roles.filter(r => r.id !== roleId);
    
    if (this.roles.length !== initialLength) {
      // Emitir una copia del array actualizado
      this.rolesSubject.next([...this.roles]);
      return of(true).pipe(delay(300));
    }
    
    return of(false).pipe(delay(300));
  }
  
  // Crear un nuevo permiso
  createPermission(permission: Omit<Permission, 'id'>): Observable<Permission> {
    const newPermission: Permission = {
      ...permission,
      id: Date.now().toString() // Generamos un ID único
    };
    
    this.permissions.push(newPermission);
    this.permissionsSubject.next(this.permissions);
    
    return of(newPermission).pipe(
      delay(300)
    );
  }
  
  // Actualizar los permisos de un rol
  updateRolePermissions(roleId: string, permissionIds: string[]): Observable<Role> {
    // Verificar si está intentando modificar un rol predefinido
    if (roleId === 'ADMINISTRADOR' || roleId === 'INVITADO') {
      // Verificar que los permisos sean los correctos para roles predefinidos
      if (roleId === 'ADMINISTRADOR' && 
          (permissionIds.length !== 1 || !permissionIds.includes('ADMINISTRACION_TOTAL'))) {
        return throwError(() => new Error('El rol ADMINISTRADOR solo puede tener el permiso ADMINISTRACION_TOTAL'));
      }
      
      if (roleId === 'INVITADO' && 
          (permissionIds.length !== 1 || !permissionIds.includes('INVITADO'))) {
        return throwError(() => new Error('El rol INVITADO solo puede tener el permiso INVITADO'));
      }
    }
    
    // Buscar el rol
    const roleIndex = this.roles.findIndex(r => r.id === roleId);
    
    if (roleIndex === -1) {
      return throwError(() => new Error('Rol no encontrado'));
    }
    
    console.log('RoleService: Actualizando permisos del rol', roleId);
    console.log('RoleService: Permisos a asignar:', permissionIds);
    
    // Primero, obtener la lista actual de permisos del PermissionService
    return this.permissionService.getAllPermissions().pipe(
      map(allPermissions => {
        // Filtrar los permisos que corresponden a los IDs proporcionados
        const updatedPermissions = allPermissions.filter(p => permissionIds.includes(p.id));
        console.log('RoleService: Permisos encontrados en PermissionService:', updatedPermissions);
        
        // Crear una copia del array de roles
        const updatedRoles = [...this.roles];
        
        // Actualizar el rol con los nuevos permisos (creando un nuevo objeto)
        updatedRoles[roleIndex] = {
          ...updatedRoles[roleIndex],
          permissions: [...updatedPermissions]
        };
        
        // Actualizar la referencia principal
        this.roles = updatedRoles;
        
        // Notificar el cambio
        this.rolesSubject.next([...this.roles]);
        
        // Retornar una copia del rol actualizado
        const updatedRole = { 
          ...this.roles[roleIndex], 
          permissions: [...this.roles[roleIndex].permissions] 
        };
        console.log('RoleService: Rol actualizado que se retorna:', updatedRole);
        
        return updatedRole;
      }),
      delay(300),
      tap(updatedRole => console.log('RoleService: Rol retornado después del delay:', updatedRole))
    );
  }
} 