import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { UserRole } from './auth/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ng-shape-up';
  isAuthenticated = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios en el estado de autenticación
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      // Verificar si el usuario tiene rol admin
      this.isAdmin = this.authService.currentUserHasRole(UserRole.ADMINISTRADOR);
      console.log('Usuario autenticado:', user);
      console.log('Es admin:', this.isAdmin);
    });
  }

  logout() {
    // Agregamos try-catch para manejar cualquier error
    try {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
