import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { GroupService } from '../../auth/services/group.service';
import { PermissionService } from '../../auth/services/permission.service';
import { User, UserRole, ShapeUpGroup, Group, Permission } from '../../auth/models/user.model';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  UserRole = UserRole; // Para usar en el template
  ShapeUpGroup = ShapeUpGroup; // Para usar en el template
  users: User[] = [];
  groups: Group[] = [];
  permissions: Permission[] = [];
  selectedRoles: { [key: string]: { [role: string]: boolean } } = {};
  selectedGroups: { [key: string]: { [group: string]: boolean } } = {};
  selectedGroupPermissions: { [groupId: string]: { [permissionId: string]: boolean } } = {};
  loading = true;
  loadingGroups = true;
  loadingPermissions = true;
  message = '';
  error = '';
  activeTab = 'roles'; // 'roles', 'groups', 'permissions', 'group-permissions'
  
  // Formulario para crear nuevos permisos
  permissionForm: FormGroup;
  editingPermission: Permission | null = null;
  
  // Variables para controlar edición
  selectedGroupForPermissions: ShapeUpGroup | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private groupService: GroupService,
    private permissionService: PermissionService
  ) {
    this.permissionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
    this.loadPermissions();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        
        // Inicializar selección de roles con los roles actuales
        this.users.forEach(user => {
          this.selectedRoles[user.id!] = {
            [UserRole.ADMIN]: user.roles?.includes(UserRole.ADMIN) || false,
            [UserRole.USER]: user.roles?.includes(UserRole.USER) || false
          };
          
          // Inicializar selección de grupos
          this.selectedGroups[user.id!] = {};
          Object.values(ShapeUpGroup).forEach(group => {
            this.selectedGroups[user.id!][group] = user.groups?.includes(group) || false;
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
  
  loadGroups(): void {
    this.loadingGroups = true;
    
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        
        // Inicializar la selección de permisos para cada grupo
        groups.forEach(group => {
          this.selectedGroupPermissions[group.id] = {};
          group.permissions.forEach(permission => {
            this.selectedGroupPermissions[group.id][permission.id] = true;
          });
        });
        
        this.loadingGroups = false;
      },
      error: (err) => {
        this.error = 'Error al cargar grupos: ' + err.message;
        this.loadingGroups = false;
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
    return user.roles?.includes(UserRole.ADMIN) || false;
  }

  isUserEnabled(user: User): boolean {
    return user.roles?.includes(UserRole.USER) || false;
  }
  
  hasGroup(user: User, group: ShapeUpGroup): boolean {
    return user.groups?.includes(group) || false;
  }
  
  getGroupPermissions(group: Group): Permission[] {
    return group.permissions || [];
  }

  onRoleChange(user: User): void {
    // No permitir actualizar al superadmin
    if (this.isSuperAdmin(user)) {
      // Restaurar los valores del superadmin (siempre debe ser admin y user)
      this.selectedRoles[user.id!][UserRole.ADMIN] = true;
      this.selectedRoles[user.id!][UserRole.USER] = true;
      return;
    }
    
    // Si el usuario es admin, asegurarse de que también sea USER
    if (this.selectedRoles[user.id!][UserRole.ADMIN]) {
      this.selectedRoles[user.id!][UserRole.USER] = true;
    }

    // Convertir objeto de checkboxes a array de roles
    const newRoles: UserRole[] = [];
    const userRoles = this.selectedRoles[user.id!];
    
    if (userRoles[UserRole.ADMIN]) newRoles.push(UserRole.ADMIN);
    if (userRoles[UserRole.USER]) newRoles.push(UserRole.USER);
    
    // Ya no obligamos a que tengan al menos un rol
    // Un usuario sin rol USER está deshabilitado en el sistema

    this.authService.updateUserRoles(user.id!, newRoles).subscribe({
      next: (updatedUser) => {
        // Actualizar usuario en la lista
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        
        let statusMsg = "";
        if (!updatedUser.roles?.includes(UserRole.USER)) {
          statusMsg = ` (Usuario deshabilitado)`;
        }
        
        this.message = `Roles actualizados para ${updatedUser.username}${statusMsg}`;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.error = 'Error al actualizar roles: ' + err.message;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }
  
  onGroupChange(user: User): void {
    // Convertir objeto de checkboxes a array de grupos
    const newGroups: ShapeUpGroup[] = [];
    const userGroups = this.selectedGroups[user.id!];
    
    Object.entries(userGroups).forEach(([group, isSelected]) => {
      if (isSelected) {
        newGroups.push(group as ShapeUpGroup);
      }
    });
    
    this.authService.updateUserGroups(user.id!, newGroups).subscribe({
      next: (updatedUser) => {
        // Actualizar usuario en la lista
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        
        this.message = `Grupos actualizados para ${updatedUser.username}`;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.error = 'Error al actualizar grupos: ' + err.message;
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
  
  // Métodos para asignar permisos a grupos
  selectGroupForPermissions(group: Group): void {
    this.selectedGroupForPermissions = group.id;
    
    // Reiniciar las selecciones
    this.permissions.forEach(permission => {
      if (!this.selectedGroupPermissions[group.id]) {
        this.selectedGroupPermissions[group.id] = {};
      }
      
      // Marcar los permisos que el grupo ya tiene
      this.selectedGroupPermissions[group.id][permission.id] = 
        group.permissions.some(p => p.id === permission.id);
    });
  }
  
  saveGroupPermissions(): void {
    if (!this.selectedGroupForPermissions) {
      return;
    }
    
    // Convertir objeto de checkboxes a array de IDs de permisos
    const permissionIds: string[] = [];
    
    Object.entries(this.selectedGroupPermissions[this.selectedGroupForPermissions]).forEach(([permissionId, isSelected]) => {
      if (isSelected) {
        permissionIds.push(permissionId);
      }
    });
    
    this.groupService.setGroupPermissions(this.selectedGroupForPermissions, permissionIds).subscribe({
      next: (updatedGroup) => {
        // Actualizar grupo en la lista
        const index = this.groups.findIndex(g => g.id === updatedGroup.id);
        if (index !== -1) {
          this.groups[index] = updatedGroup;
        }
        
        this.message = `Permisos actualizados para el grupo ${updatedGroup.name}`;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.error = 'Error al actualizar permisos del grupo: ' + err.message;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }
  
  cancelEditGroupPermissions(): void {
    this.selectedGroupForPermissions = null;
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  // Helper para mostrar nombres de grupos legibles
  getGroupDisplayName(group: ShapeUpGroup): string {
    switch (group) {
      case ShapeUpGroup.SHAPER: return 'Shaper';
      case ShapeUpGroup.STAKEHOLDER: return 'Stakeholder';
      case ShapeUpGroup.BUILDER: return 'Builder';
      case ShapeUpGroup.DESIGNER: return 'Designer';
      case ShapeUpGroup.QA: return 'Quality Assurance';
      case ShapeUpGroup.TEAM_LEAD: return 'Team Lead';
      case ShapeUpGroup.TECH_LEAD: return 'Tech Lead';
      default: return group;
    }
  }
  
  getUserGroupsCount(user: User): number {
    return user.groups?.length || 0;
  }
} 