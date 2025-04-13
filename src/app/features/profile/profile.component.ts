import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { RoleService } from '../../auth/services/role.service';
import { User, Permission } from '../../auth/models/user.model';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="profile-card">
        <h1 class="profile-title">Mi Perfil</h1>
        
        <div *ngIf="user">
          <div class="section">
            <h2 class="section-title">Información de Usuario</h2>
            <div class="info-container">
              <div class="info-row">
                <span class="info-label">Usuario:</span>
                <span class="info-value">{{ user.username }}</span>
              </div>
              
              <!-- Sección de roles -->
              <div *ngIf="user.roles && user.roles.length > 0">
                <span class="info-label">Roles:</span>
                <div class="role-container">
                  <span 
                    *ngFor="let role of user.roles" 
                    [ngClass]="getRoleClass(role)"
                    class="role-badge">
                    {{ role }}
                  </span>
                </div>
              </div>
              
              <!-- Sección de permisos -->
              <div *ngIf="userPermissions && userPermissions.length > 0" class="permissions-section">
                <span class="info-label">Permisos:</span>
                <div class="permissions-container">
                  <span 
                    *ngFor="let permission of userPermissions" 
                    class="permission-badge">
                    {{ permission.name }}
                  </span>
                </div>
                <p class="permissions-note">Estos permisos determinan las acciones que puedes realizar en la aplicación.</p>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Preferencias</h2>
            <div class="info-container">
              <p class="preference-message">
                La personalización de perfil estará disponible próximamente.
              </p>
            </div>
          </div>
        </div>
        
        <div *ngIf="!user" class="login-message">
          <p>Debes iniciar sesión para ver tu perfil.</p>
          <button routerLink="/auth/login" class="login-button">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .profile-card {
      background: white;
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      max-width: 500px;
      margin: 0 auto;
    }
    
    .profile-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
      color: #333;
    }
    
    .section {
      margin-bottom: 16px;
    }
    
    .section:not(:first-child) {
      padding-top: 16px;
      margin-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 8px;
      color: #444;
    }
    
    .info-container {
      background: #f9f9f9;
      padding: 12px;
      border-radius: 4px;
    }
    
    .info-row {
      margin-bottom: 8px;
    }
    
    .info-label {
      font-weight: 500;
      color: #555;
    }
    
    .info-value {
      margin-left: 8px;
    }
    
    .role-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    
    .role-badge {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
      border: 1px solid;
    }
    
    .role-admin {
      background-color: #fee2e2;
      color: #b91c1c;
      border-color: #fecaca;
    }
    
    .role-invitado {
      background-color: #dbeafe;
      color: #1e40af;
      border-color: #bfdbfe;
    }
    
    .role-other {
      background-color: #e0e7ff;
      color: #4338ca;
      border-color: #c7d2fe;
    }
    
    .permissions-section {
      margin-top: 16px;
    }
    
    .permissions-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    
    .permission-badge {
      background-color: #f0fdf4;
      color: #166534;
      border: 1px solid #dcfce7;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .permissions-note {
      font-size: 0.75rem;
      color: #666;
      font-style: italic;
      margin-top: 8px;
    }
    
    .preference-message {
      font-size: 0.875rem;
      color: #666;
      font-style: italic;
    }
    
    .login-message {
      text-align: center;
      padding: 20px 0;
    }
    
    .login-button {
      background-color: #3b82f6;
      color: white;
      padding: 4px 16px;
      border-radius: 4px;
      font-size: 0.875rem;
      border: none;
      margin-top: 12px;
      cursor: pointer;
    }
    
    .login-button:hover {
      background-color: #2563eb;
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userPermissions: Permission[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {}
  
  ngOnInit(): void {
    // Obtener el usuario actual
    this.user = this.authService.getCurrentUser();
    
    // Cargar los permisos del usuario
    this.loadUserPermissions();
    
    // Suscribirse a cambios en el usuario
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.user = user;
      this.loadUserPermissions();
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadUserPermissions(): void {
    if (this.user && this.user.roles && this.user.roles.length > 0) {
      this.roleService.getUserPermissions(this.user.roles).pipe(
        takeUntil(this.destroy$)
      ).subscribe(permissions => {
        this.userPermissions = permissions;
      });
    }
  }
  
  getRoleClass(role: string): string {
    // Solo definimos clases específicas para los roles fijos
    if (role === 'ADMINISTRADOR') {
      return 'role-admin';
    } else if (role === 'INVITADO') {
      return 'role-invitado';
    } else {
      // Cualquier otro rol tendrá otra clase
      return 'role-other';
    }
  }
} 