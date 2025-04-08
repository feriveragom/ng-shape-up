import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { User, UserRole } from '../../auth/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  UserRole = UserRole; // Para usar en el template
  users: User[] = [];
  selectedRoles: { [key: string]: { [role: string]: boolean } } = {};
  loading = true;
  message = '';
  error = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
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
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios: ' + err.message;
        this.loading = false;
      }
    });
  }

  isFeriveragom(user: User): boolean {
    return user.email === 'feriveragom@gmail.com';
  }

  onRoleChange(user: User): void {
    // No permitir actualizar a feriveragom
    if (this.isFeriveragom(user)) {
      // Restaurar el valor del admin para feriveragom (siempre debe ser admin)
      this.selectedRoles[user.id!][UserRole.ADMIN] = true;
      return;
    }

    // Convertir objeto de checkboxes a array de roles
    const newRoles: UserRole[] = [];
    const userRoles = this.selectedRoles[user.id!];
    
    if (userRoles[UserRole.ADMIN]) newRoles.push(UserRole.ADMIN);
    if (userRoles[UserRole.USER]) newRoles.push(UserRole.USER);
    
    // Asegurar que el usuario tenga al menos un rol
    if (newRoles.length === 0) {
      this.error = 'El usuario debe tener al menos un rol';
      // Restaurar el último rol (USER por defecto)
      this.selectedRoles[user.id!][UserRole.USER] = true;
      setTimeout(() => this.error = '', 3000);
      return;
    }

    this.authService.updateUserRoles(user.id!, newRoles).subscribe({
      next: (updatedUser) => {
        // Actualizar usuario en la lista
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        
        this.message = `Roles actualizados para ${updatedUser.email}`;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.error = 'Error al actualizar roles: ' + err.message;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }
} 