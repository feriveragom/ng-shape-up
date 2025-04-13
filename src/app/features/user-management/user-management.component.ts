import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { GroupService } from '../../auth/services/group.service';
import { User, UserRole, ShapeUpGroup, Group, Permission } from '../../auth/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  UserRole = UserRole; // Para usar en el template
  ShapeUpGroup = ShapeUpGroup; // Para usar en el template
  users: User[] = [];
  groups: Group[] = [];
  selectedRoles: { [key: string]: { [role: string]: boolean } } = {};
  selectedGroups: { [key: string]: { [group: string]: boolean } } = {};
  loading = true;
  loadingGroups = true;
  message = '';
  error = '';
  activeTab = 'roles'; // 'roles' o 'groups'

  constructor(
    private authService: AuthService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
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
        this.loadingGroups = false;
      },
      error: (err) => {
        this.error = 'Error al cargar grupos: ' + err.message;
        this.loadingGroups = false;
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