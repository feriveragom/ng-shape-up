import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Shape Up Dashboard</h1>
        <button class="logout-button" (click)="logout()">Cerrar sesión</button>
      </header>
      
      <div class="dashboard-content">
        <h2>Bienvenido, {{ userName }}</h2>
        <p>Esta es la página principal de tu aplicación Shape Up.</p>
        
        <div class="dashboard-cards">
          <div class="card">
            <h3>Ciclos actuales</h3>
            <p>No hay ciclos activos</p>
            <a routerLink="/cycles" class="card-link">Ver ciclos</a>
          </div>
          
          <div class="card">
            <h3>Propuestas pendientes</h3>
            <p>No hay propuestas pendientes</p>
            <a routerLink="/pitches" class="card-link">Ver propuestas</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .logout-button {
      padding: 0.5rem 1rem;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background-color: #e9ecef;
      }
    }
    
    .dashboard-content {
      h2 {
        margin-bottom: 1rem;
      }
      
      p {
        margin-bottom: 2rem;
        color: #6c757d;
      }
    }
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .card {
      padding: 1.5rem;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      
      h3 {
        margin-bottom: 1rem;
        color: #343a40;
      }
      
      p {
        margin-bottom: 1.5rem;
        color: #6c757d;
      }
      
      .card-link {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #7048e8;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 500;
        
        &:hover {
          background-color: #5a30cb;
        }
      }
    }
    
    @media (max-width: 768px) {
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  userName = 'Usuario';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Obtener el nombre del usuario autenticado
    const currentUser = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name || user.email;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
} 