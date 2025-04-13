import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { ShapeUpGroup, Permission, Group, User } from '../models/user.model';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  // Simulación de almacenamiento local para grupos y sus asignaciones de permisos
  private groups: Group[] = [];
  
  // Observable para grupos
  private groupsSubject = new BehaviorSubject<Group[]>([]);
  public groups$ = this.groupsSubject.asObservable();
  
  constructor(private permissionService: PermissionService) {
    this.initializeGroups();
  }
  
  /**
   * Inicializa los grupos sin permisos predeterminados
   */
  private initializeGroups(): void {
    const initialGroups: Group[] = Object.values(ShapeUpGroup).map(groupId => {
      // Crear el grupo sin permisos iniciales
      return {
        id: groupId,
        name: groupId,
        description: `Grupo de ${groupId} en Shape Up`,
        permissions: []
      };
    });
    
    this.groups = initialGroups;
    this.groupsSubject.next([...this.groups]);
  }
  
  /**
   * Obtiene todos los grupos
   */
  getAllGroups(): Observable<Group[]> {
    return of([...this.groups]).pipe(
      delay(300) // Simular latencia de red
    );
  }
  
  /**
   * Obtiene un grupo específico por su ID
   */
  getGroupById(groupId: ShapeUpGroup): Observable<Group | undefined> {
    const group = this.groups.find(g => g.id === groupId);
    return of(group).pipe(
      delay(300)
    );
  }
  
  /**
   * Asigna un permiso existente a un grupo
   */
  assignPermissionToGroup(groupId: ShapeUpGroup, permissionId: string): Observable<Group> {
    const groupIndex = this.groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      return throwError(() => new Error(`Grupo ${groupId} no encontrado`));
    }
    
    // Verificar si el grupo ya tiene este permiso
    const hasPermission = this.groups[groupIndex].permissions.some(p => p.id === permissionId);
    
    if (hasPermission) {
      return throwError(() => new Error(`El grupo ${groupId} ya tiene el permiso ${permissionId}`));
    }
    
    // Buscar el permiso en el catálogo general
    return this.permissionService.getPermissionById(permissionId).pipe(
      switchMap(permission => {
        if (!permission) {
          return throwError(() => new Error(`Permiso ${permissionId} no encontrado`));
        }
        
        // Clonar el grupo existente y agregar el nuevo permiso
        const updatedGroup: Group = {
          ...this.groups[groupIndex],
          permissions: [...this.groups[groupIndex].permissions, permission]
        };
        
        // Actualizar el grupo en la lista
        this.groups[groupIndex] = updatedGroup;
        this.groupsSubject.next([...this.groups]);
        
        return of(updatedGroup);
      }),
      delay(300)
    );
  }
  
  /**
   * Elimina un permiso de un grupo
   */
  removePermissionFromGroup(groupId: ShapeUpGroup, permissionId: string): Observable<Group> {
    const groupIndex = this.groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      return throwError(() => new Error(`Grupo ${groupId} no encontrado`));
    }
    
    // Verificar si el grupo tiene este permiso
    const hasPermission = this.groups[groupIndex].permissions.some(p => p.id === permissionId);
    
    if (!hasPermission) {
      return throwError(() => new Error(`El grupo ${groupId} no tiene el permiso ${permissionId}`));
    }
    
    // Clonar el grupo existente y eliminar el permiso
    const updatedGroup: Group = {
      ...this.groups[groupIndex],
      permissions: this.groups[groupIndex].permissions.filter(p => p.id !== permissionId)
    };
    
    // Actualizar el grupo en la lista
    this.groups[groupIndex] = updatedGroup;
    this.groupsSubject.next([...this.groups]);
    
    return of(updatedGroup).pipe(
      delay(300)
    );
  }
  
  /**
   * Obtiene todos los permisos de un usuario basado en sus grupos
   */
  getUserPermissions(user: User): Observable<Permission[]> {
    if (!user.groups || user.groups.length === 0) {
      return of([]);
    }
    
    // Obtener todos los permisos de todos los grupos del usuario
    const userPermissions: Permission[] = [];
    
    user.groups.forEach(groupId => {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        userPermissions.push(...group.permissions);
      }
    });
    
    // Eliminar duplicados basados en ID de permiso
    const uniquePermissions = userPermissions.filter((permission, index, self) =>
      index === self.findIndex(p => p.id === permission.id)
    );
    
    return of(uniquePermissions).pipe(
      delay(300)
    );
  }
  
  /**
   * Verifica si un usuario tiene un permiso específico
   */
  userHasPermission(user: User, permissionId: string): Observable<boolean> {
    return this.getUserPermissions(user).pipe(
      map(permissions => permissions.some(p => p.id === permissionId)),
      delay(300)
    );
  }
  
  /**
   * Asigna múltiples permisos a un grupo, reemplazando los existentes
   */
  setGroupPermissions(groupId: ShapeUpGroup, permissionIds: string[]): Observable<Group> {
    const groupIndex = this.groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      return throwError(() => new Error(`Grupo ${groupId} no encontrado`));
    }
    
    // Obtener todos los permisos seleccionados
    return this.permissionService.getAllPermissions().pipe(
      map(allPermissions => {
        // Filtrar los permisos por IDs seleccionados
        const selectedPermissions = allPermissions.filter(p => 
          permissionIds.includes(p.id)
        );
        
        // Actualizar el grupo con los nuevos permisos
        const updatedGroup: Group = {
          ...this.groups[groupIndex],
          permissions: selectedPermissions
        };
        
        // Actualizar el grupo en la lista
        this.groups[groupIndex] = updatedGroup;
        this.groupsSubject.next([...this.groups]);
        
        return updatedGroup;
      }),
      delay(300)
    );
  }
} 