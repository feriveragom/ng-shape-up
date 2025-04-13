import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Permission } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  // Catálogo general de permisos del sistema
  private permissions: Permission[] = [];
  
  // Observable para permisos
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();
  
  constructor() {
    // Inicializar la lista vacía
    this.permissionsSubject.next([]);
  }
  
  /**
   * Obtiene todos los permisos disponibles
   */
  getAllPermissions(): Observable<Permission[]> {
    return of([...this.permissions]).pipe(
      delay(300) // Simular latencia de red
    );
  }
  
  /**
   * Obtiene un permiso específico por su ID
   */
  getPermissionById(permissionId: string): Observable<Permission | undefined> {
    const permission = this.permissions.find(p => p.id === permissionId);
    return of(permission).pipe(
      delay(300)
    );
  }
  
  /**
   * Agrega un nuevo permiso al catálogo
   */
  addPermission(permission: Omit<Permission, 'id'>): Observable<Permission> {
    // Verificar si ya existe un permiso con ese nombre
    const existingPermission = this.permissions.find(p => 
      p.name.toLowerCase() === permission.name.toLowerCase()
    );
    
    if (existingPermission) {
      return throwError(() => new Error(`Ya existe un permiso con el nombre '${permission.name}'`));
    }
    
    // Generar un ID a partir del nombre (convertir a mayúsculas y reemplazar espacios con guiones bajos)
    const permissionId = permission.name.toUpperCase().replace(/\s+/g, '_');
    
    // Verificar si ya existe un permiso con ese ID
    const existingPermissionId = this.permissions.find(p => p.id === permissionId);
    
    if (existingPermissionId) {
      return throwError(() => new Error(`Ya existe un permiso con el ID '${permissionId}'`));
    }
    
    // Crear el nuevo permiso
    const newPermission: Permission = {
      id: permissionId,
      name: permission.name,
      description: permission.description
    };
    
    // Añadirlo a la lista
    this.permissions = [...this.permissions, newPermission];
    this.permissionsSubject.next([...this.permissions]);
    
    return of(newPermission).pipe(
      delay(300)
    );
  }
  
  /**
   * Edita un permiso existente
   */
  updatePermission(permissionId: string, permission: Partial<Omit<Permission, 'id'>>): Observable<Permission> {
    const index = this.permissions.findIndex(p => p.id === permissionId);
    
    if (index === -1) {
      return throwError(() => new Error(`No se encontró el permiso con ID '${permissionId}'`));
    }
    
    // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
    if (permission.name && permission.name.trim() !== '') {
      const nameToCheck = permission.name.toLowerCase();
      const existingPermission = this.permissions.find(p => 
        p.name.toLowerCase() === nameToCheck && p.id !== permissionId
      );
      
      if (existingPermission) {
        return throwError(() => new Error(`Ya existe un permiso con el nombre '${permission.name}'`));
      }
    }
    
    // Actualizar el permiso
    const updatedPermission: Permission = {
      ...this.permissions[index],
      ...permission
    };
    
    // Actualizar la lista
    this.permissions[index] = updatedPermission;
    this.permissionsSubject.next([...this.permissions]);
    
    return of(updatedPermission).pipe(
      delay(300)
    );
  }
  
  /**
   * Elimina un permiso del catálogo
   */
  deletePermission(permissionId: string): Observable<boolean> {
    const index = this.permissions.findIndex(p => p.id === permissionId);
    
    if (index === -1) {
      return throwError(() => new Error(`No se encontró el permiso con ID '${permissionId}'`));
    }
    
    // Eliminar el permiso
    this.permissions = this.permissions.filter(p => p.id !== permissionId);
    this.permissionsSubject.next([...this.permissions]);
    
    return of(true).pipe(
      delay(300)
    );
  }
} 