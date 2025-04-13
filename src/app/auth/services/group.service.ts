import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ShapeUpGroup, Permission, Group, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  // Simulación de almacenamiento local para grupos y permisos
  private groups: Group[] = [];
  
  // Observable para grupos
  private groupsSubject = new BehaviorSubject<Group[]>([]);
  public groups$ = this.groupsSubject.asObservable();
  
  constructor() {
    this.initializeGroups();
  }
  
  /**
   * Inicializa los grupos con permisos predeterminados
   */
  private initializeGroups(): void {
    const initialGroups: Group[] = Object.values(ShapeUpGroup).map(groupId => {
      // Crear un permiso con el mismo nombre que el grupo
      const initialPermission: Permission = {
        id: groupId.toLowerCase(),
        name: groupId,
        description: `Permiso básico para el grupo ${groupId}`
      };
      
      // Crear el grupo con el permiso inicial
      return {
        id: groupId,
        name: groupId,
        description: `Grupo de ${groupId} en Shape Up`,
        permissions: [initialPermission]
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
   * Agrega un permiso a un grupo específico
   */
  addPermissionToGroup(groupId: ShapeUpGroup, permission: Omit<Permission, 'id'>): Observable<Group> {
    const groupIndex = this.groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) {
      return throwError(() => new Error(`Grupo ${groupId} no encontrado`));
    }
    
    // Generar ID único para el permiso
    const permissionId = `${groupId.toLowerCase()}_${Date.now()}`;
    
    // Crear el nuevo permiso
    const newPermission: Permission = {
      id: permissionId,
      name: permission.name,
      description: permission.description
    };
    
    // Clonar el grupo existente y agregar el nuevo permiso
    const updatedGroup: Group = {
      ...this.groups[groupIndex],
      permissions: [...this.groups[groupIndex].permissions, newPermission]
    };
    
    // Actualizar el grupo en la lista
    this.groups[groupIndex] = updatedGroup;
    this.groupsSubject.next([...this.groups]);
    
    return of(updatedGroup).pipe(
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
    
    // Evitar eliminar el permiso base del grupo (mismo nombre que el grupo)
    const basePermissionId = groupId.toLowerCase();
    if (permissionId === basePermissionId) {
      return throwError(() => new Error(`No se puede eliminar el permiso base del grupo ${groupId}`));
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
  userHasPermission(user: User, permissionName: string): Observable<boolean> {
    return this.getUserPermissions(user).pipe(
      tap(permissions => console.log('Permisos del usuario:', permissions)),
      tap(permissions => console.log('Buscando permiso:', permissionName)),
      tap(permissions => console.log('Resultado:', permissions.some(p => p.name === permissionName))),
      delay(300), // Simular latencia
      (permissions$) => new Observable<boolean>(observer => {
        permissions$.subscribe(permissions => {
          observer.next(permissions.some(p => p.name === permissionName));
          observer.complete();
        });
      })
    );
  }
} 