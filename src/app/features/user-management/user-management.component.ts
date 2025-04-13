import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { PermissionService } from '../../auth/services/permission.service';
import { User, UserRole, Permission, Role } from '../../auth/models/user.model';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RoleService } from '../../auth/services/role.service';
import { FindPipe } from '../../auth/pipes/find.pipe';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FindPipe],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  UserRole = UserRole; // Para usar en el template
  users: User[] = [];
  roles: Role[] = [];
  permissions: Permission[] = [];
  selectedRoles: { [key: string]: { [role: string]: boolean } } = {};
  selectedRolePermissions: { [roleId: string]: { [permissionId: string]: boolean } } = {};
  loading = true;
  loadingRoles = true;
  loadingPermissions = true;
  message = '';
  error = '';
  activeTab = 'roles'; // 'roles', 'permissions', 'role-permissions'
  
  // Para usar en el template
  console = console;
  
  // Formulario para crear nuevos permisos
  permissionForm: FormGroup;
  editingPermission: Permission | null = null;
  
  // Variables para controlar edición
  selectedRoleForPermissions: string | null = null;

  // Formulario para crear nuevos roles
  roleForm: FormGroup;
  editingRole: Role | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {
    this.permissionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required]
    });
    
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadPermissions();
  }

  /**
   * Carga la lista de usuarios desde el servicio
   */
  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        
        // Inicializar selección de roles con los roles actuales reales
        this.users.forEach(user => {
          this.selectedRoles[user.id!] = {
            [UserRole.ADMINISTRADOR]: user.roles?.includes(UserRole.ADMINISTRADOR) || false,
            [UserRole.INVITADO]: user.roles?.includes(UserRole.INVITADO) || false
          };
          
          // Añadir roles personalizados
          this.roles.forEach(role => {
            if (!this.isPredefinedRoleById(role.id)) {
              this.selectedRoles[user.id!][role.id] = user.roles?.includes(role.id) || false;
            }
          });
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios: ' + err.message;
        this.loading = false;
      }
    });
  }
  
  loadRoles(): void {
    this.loadingRoles = true;
    
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Roles cargados:', this.roles);
        
        // Inicializar la selección de permisos para cada rol
        roles.forEach(role => {
          this.selectedRolePermissions[role.id] = {};
          if (role.permissions && role.permissions.length > 0) {
            role.permissions.forEach(permission => {
              this.selectedRolePermissions[role.id][permission.id] = true;
            });
            console.log(`Rol ${role.id} tiene ${role.permissions.length} permisos:`, 
              role.permissions.map(p => p.id));
          } else {
            console.log(`Rol ${role.id} no tiene permisos asignados`);
          }
        });
        
        this.loadingRoles = false;
      },
      error: (err) => {
        console.error('Error al cargar roles:', err);
        this.error = 'Error al cargar roles: ' + err.message;
        this.loadingRoles = false;
      }
    });
  }
  
  loadPermissions(): void {
    this.loadingPermissions = true;
    
    this.permissionService.getAllPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        this.loadingPermissions = false;
      },
      error: (err) => {
        this.error = 'Error al cargar permisos: ' + err.message;
        this.loadingPermissions = false;
      }
    });
  }

  isSuperAdmin(user: User): boolean {
    return user.username === 'superadmin';
  }
  
  isAdmin(user: User): boolean {
    return user.roles?.includes(UserRole.ADMINISTRADOR) || false;
  }

  isUserEnabled(user: User): boolean {
    return user.roles?.includes(UserRole.INVITADO) || false;
  }
  
  getRolePermissions(role: Role): Permission[] {
    return role.permissions || [];
  }

  /**
   * Maneja los cambios en los roles de un usuario
   */
  onRoleChange(user: User): void {
    // No permitir actualizar al superadmin
    if (this.isSuperAdmin(user)) {
      // Restaurar los valores del superadmin (siempre debe ser administrador e invitado)
      this.selectedRoles[user.id!][UserRole.ADMINISTRADOR] = true;
      this.selectedRoles[user.id!][UserRole.INVITADO] = true;
      return;
    }
    
    // Si el usuario es administrador, asegurarse de que también sea INVITADO
    if (this.selectedRoles[user.id!][UserRole.ADMINISTRADOR]) {
      this.selectedRoles[user.id!][UserRole.INVITADO] = true;
    }

    // Convertir objeto de checkboxes a array de roles
    const newRoles: string[] = [];
    const userRoles = this.selectedRoles[user.id!];
    
    // Añadir roles predefinidos
    if (userRoles[UserRole.ADMINISTRADOR]) newRoles.push(UserRole.ADMINISTRADOR);
    if (userRoles[UserRole.INVITADO]) newRoles.push(UserRole.INVITADO);
    
    // Añadir roles personalizados
    this.roles.forEach(role => {
      if (!this.isPredefinedRoleById(role.id) && userRoles[role.id]) {
        newRoles.push(role.id);
      }
    });

    this.authService.updateUserRoles(user.id!, newRoles).subscribe({
      next: (updatedUser) => {
        // Actualizar usuario en la lista
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          // Reemplazar el usuario completo para garantizar la sincronización
          this.users[index] = updatedUser;
          
          // Actualizar también los checkboxes para reflejar el estado real
          this.selectedRoles[updatedUser.id!] = {
            [UserRole.ADMINISTRADOR]: updatedUser.roles?.includes(UserRole.ADMINISTRADOR) || false,
            [UserRole.INVITADO]: updatedUser.roles?.includes(UserRole.INVITADO) || false
          };
          
          // Actualizar roles personalizados
          this.roles.forEach(role => {
            if (!this.isPredefinedRoleById(role.id)) {
              this.selectedRoles[updatedUser.id!][role.id] = updatedUser.roles?.includes(role.id) || false;
            }
          });
        }
        
        let statusMsg = "";
        if (!updatedUser.roles?.includes(UserRole.INVITADO)) {
          statusMsg = ` (Usuario deshabilitado)`;
        }
        
        this.message = `Roles actualizados para ${updatedUser.username}${statusMsg}`;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        // En caso de error, restauramos la UI a su estado anterior
        this.loadUsers(); // Recargar usuarios para restaurar el estado correcto
        this.error = 'Error al actualizar roles: ' + err.message;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }
  
  // Métodos para gestión de permisos
  onSubmitPermission(): void {
    if (this.permissionForm.invalid) {
      return;
    }
    
    const permissionData = this.permissionForm.value;
    
    if (this.editingPermission) {
      // Editar permiso existente
      this.permissionService.updatePermission(this.editingPermission.id, permissionData).subscribe({
        next: (updatedPermission) => {
          // Actualizar permiso en la lista
          const index = this.permissions.findIndex(p => p.id === updatedPermission.id);
          if (index !== -1) {
            this.permissions[index] = updatedPermission;
          }
          
          this.message = `Permiso '${updatedPermission.name}' actualizado`;
          this.resetPermissionForm();
          setTimeout(() => this.message = '', 3000);
        },
        error: (err) => {
          this.error = 'Error al actualizar permiso: ' + err.message;
          setTimeout(() => this.error = '', 3000);
        }
      });
    } else {
      // Crear nuevo permiso
      this.permissionService.addPermission(permissionData).subscribe({
        next: (newPermission) => {
          this.permissions = [...this.permissions, newPermission];
          this.message = `Permiso '${newPermission.name}' creado`;
          this.resetPermissionForm();
          setTimeout(() => this.message = '', 3000);
        },
        error: (err) => {
          this.error = 'Error al crear permiso: ' + err.message;
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }
  
  editPermission(permission: Permission): void {
    this.editingPermission = permission;
    this.permissionForm.patchValue({
      name: permission.name,
      description: permission.description
    });
  }
  
  deletePermission(permissionId: string): void {
    if (confirm('¿Estás seguro de eliminar este permiso? Esta acción no se puede deshacer.')) {
      this.permissionService.deletePermission(permissionId).subscribe({
        next: () => {
          this.permissions = this.permissions.filter(p => p.id !== permissionId);
          this.message = 'Permiso eliminado correctamente';
          setTimeout(() => this.message = '', 3000);
        },
        error: (err) => {
          this.error = 'Error al eliminar permiso: ' + err.message;
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }
  
  resetPermissionForm(): void {
    this.permissionForm.reset();
    this.editingPermission = null;
  }
  
  // Métodos para asignar permisos a roles
  selectRoleForPermissions(role: Role): void {
    this.selectedRoleForPermissions = role.id;
    
    // Reiniciar el objeto de selección de permisos completamente
    this.selectedRolePermissions[role.id] = {};
    
    // Para roles predefinidos, establecer los permisos por defecto
    if (this.isPredefinedRole(role.id)) {
      // Inicializar todos los permisos como falsos
      this.permissions.forEach(permission => {
        this.selectedRolePermissions[role.id][permission.id] = false;
      });
      
      // Establecer solo el permiso por defecto
      if (role.id === 'ADMINISTRADOR') {
        this.selectedRolePermissions[role.id]['ADMINISTRACION_TOTAL'] = true;
      } else if (role.id === 'INVITADO') {
        this.selectedRolePermissions[role.id]['INVITADO'] = true;
      }
    } else {
      // Para roles no predefinidos, inicializar primero todos como falsos
      this.permissions.forEach(permission => {
        this.selectedRolePermissions[role.id][permission.id] = false;
      });
      
      // Luego marcar como verdaderos solo los que ya tiene asignados
      if (role.permissions && role.permissions.length > 0) {
        role.permissions.forEach(permission => {
          this.selectedRolePermissions[role.id][permission.id] = true;
        });
      }
    }
    
    console.log('Permisos inicializados para el rol:', role.id, this.selectedRolePermissions[role.id]);
  }
  
  /**
   * Verifica si un rol es predefinido del sistema
   */
  isPredefinedRole(roleId: string): boolean {
    return roleId === 'ADMINISTRADOR' || roleId === 'INVITADO';
  }

  /**
   * Verifica si un permiso es el asignado por defecto a un rol predefinido
   */
  isDefaultPermissionForRole(roleId: string, permissionId: string): boolean {
    if (roleId === 'ADMINISTRADOR' && permissionId === 'ADMINISTRACION_TOTAL') {
      return true;
    }
    if (roleId === 'INVITADO' && permissionId === 'INVITADO') {
      return true;
    }
    return false;
  }

  /**
   * Guarda los cambios en los permisos del rol seleccionado
   */
  saveRolePermissions(): void {
    if (!this.selectedRoleForPermissions) {
      console.error('No hay un rol seleccionado para guardar permisos');
      return;
    }
    
    // Verificar si es un rol predefinido
    const roleId = this.selectedRoleForPermissions;
    
    if (this.isPredefinedRole(roleId)) {
      // Para roles predefinidos, mantener solo su permiso por defecto
      const permissionsToSave: string[] = [];
      
      if (roleId === 'ADMINISTRADOR') {
        permissionsToSave.push('ADMINISTRACION_TOTAL');
      } else if (roleId === 'INVITADO') {
        permissionsToSave.push('INVITADO');
      }
      
      this.message = `Los permisos del rol ${roleId} no se pueden modificar por ser un rol predefinido.`;
      setTimeout(() => this.message = '', 3000);
      
      // Restaurar los permisos originales
      this.cancelEditRolePermissions();
      return;
    }
    
    // Para roles no predefinidos, continuar con el proceso normal
    const permissionsToSave = Object.keys(this.selectedRolePermissions[roleId])
      .filter(permId => this.selectedRolePermissions[roleId][permId] === true);
    
    console.log('Componente: Permisos a guardar para el rol', roleId, ':', permissionsToSave);
    
    if (permissionsToSave.length === 0) {
      console.warn('⚠️ No hay permisos seleccionados para guardar');
    }
    
    this.roleService.updateRolePermissions(roleId, permissionsToSave).subscribe({
      next: (updatedRole) => {
        console.log('Componente: Rol actualizado recibido del servidor:', updatedRole);
        console.log('Componente: Permisos en el rol actualizado:', updatedRole.permissions.map(p => p.id));
        
        // Actualizar el rol en la lista local
        const index = this.roles.findIndex(r => r.id === updatedRole.id);
        if (index !== -1) {
          // Crear una copia profunda del rol actualizado
          this.roles[index] = {
            ...updatedRole,
            permissions: [...updatedRole.permissions]
          };
          console.log('Componente: Rol actualizado en la lista con', updatedRole.permissions.length, 'permisos');
        } else {
          console.error('Componente: No se encontró el rol en la lista local');
        }
        
        // Actualizar los permisos seleccionados para este rol
        this.selectedRolePermissions[roleId] = {};
        if (updatedRole.permissions && updatedRole.permissions.length > 0) {
          updatedRole.permissions.forEach(permission => {
            this.selectedRolePermissions[roleId][permission.id] = true;
          });
        }
        
        this.message = `Permisos actualizados para el rol ${updatedRole.name}`;
        setTimeout(() => this.message = '', 3000);
        
        // Volver a la lista de roles
        this.selectedRoleForPermissions = null;
        
        // Recargar la lista de roles para asegurar que los datos estén sincronizados
        this.loadRoles();
      },
      error: (err) => {
        console.error('Error al guardar permisos:', err);
        this.error = 'Error al actualizar permisos: ' + err.message;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }
  
  cancelEditRolePermissions(): void {
    this.selectedRoleForPermissions = null;
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Verifica si un permiso es predefinido del sistema
   */
  isPredefinedPermission(permissionId: string): boolean {
    return permissionId === 'ADMINISTRACION_TOTAL' || permissionId === 'INVITADO';
  }

  /**
   * Verifica si un rol es predefinido por su id
   */
  isPredefinedRoleById(roleId: string): boolean {
    return this.isPredefinedRole(roleId);
  }

  /**
   * Enviar formulario de rol para crear o actualizar
   */
  onSubmitRole(): void {
    if (this.roleForm.invalid) {
      return;
    }
    
    const roleData = this.roleForm.value;
    
    if (this.editingRole) {
      // Editar rol existente
      this.roleService.updateRole(this.editingRole.id, roleData).subscribe({
        next: (updatedRole) => {
          // Actualizar rol en la lista
          if (updatedRole) {
            const index = this.roles.findIndex(r => r.id === updatedRole.id);
            if (index !== -1) {
              this.roles[index] = updatedRole;
            }
            
            this.message = `Rol '${updatedRole.name}' actualizado`;
          } else {
            this.message = 'Rol actualizado';
          }
          this.resetRoleForm();
          setTimeout(() => this.message = '', 3000);
        },
        error: (err) => {
          this.error = 'Error al actualizar rol: ' + err.message;
          setTimeout(() => this.error = '', 3000);
        }
      });
    } else {
      // Crear nuevo rol
      this.roleService.createRole(roleData).subscribe({
        next: (newRole) => {
          // No actualizar directamente la lista local
          // En su lugar, recargar todos los roles del servicio
          this.roleService.getAllRoles().subscribe(roles => {
            this.roles = roles;
            
            this.message = `Rol '${newRole.name}' creado`;
            this.resetRoleForm();
            setTimeout(() => this.message = '', 3000);
          });
        },
        error: (err) => {
          this.error = 'Error al crear rol: ' + err.message;
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  /**
   * Editar un rol existente
   */
  editRole(role: Role): void {
    this.editingRole = role;
    this.roleForm.patchValue({
      name: role.name,
      description: role.description
    });
  }

  /**
   * Eliminar un rol
   */
  deleteRole(roleId: string): void {
    if (confirm('¿Estás seguro de eliminar este rol? Esta acción no se puede deshacer.')) {
      this.roleService.deleteRole(roleId).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => r.id !== roleId);
          this.message = 'Rol eliminado correctamente';
          setTimeout(() => this.message = '', 3000);
        },
        error: (err) => {
          this.error = 'Error al eliminar rol: ' + err.message;
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  /**
   * Limpiar el formulario de rol
   */
  resetRoleForm(): void {
    this.roleForm.reset();
    this.editingRole = null;
  }
} 