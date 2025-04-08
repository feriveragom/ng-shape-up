import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Cycle, CycleStatus, Project } from './cycle.model';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  // Datos simulados para ciclos
  private cycles: Cycle[] = [
    {
      id: '1',
      name: 'Ciclo Q2 - 2024',
      description: 'Enfoque en mejoras de UX y rendimiento',
      startDate: new Date(2024, 3, 1), // Abril 1
      endDate: new Date(2024, 4, 12), // Mayo 12
      status: CycleStatus.ACTIVE,
      theme: 'Experiencia de usuario'
    },
    {
      id: '2',
      name: 'Ciclo Q3 - 2024',
      description: 'Nuevas funcionalidades de colaboración',
      startDate: new Date(2024, 5, 1), // Junio 1
      endDate: new Date(2024, 6, 15), // Julio 15
      status: CycleStatus.PLANNING,
      theme: 'Colaboración'
    }
  ];

  // Datos simulados para proyectos
  private projects: Project[] = [
    {
      id: '1',
      name: 'Rediseño de Dashboard',
      description: 'Mejorar la experiencia del dashboard con visualizaciones más intuitivas',
      cycleId: '1',
      teamMembers: ['1', '2'],
      progress: 65,
      hillChartPosition: 75 // Después de la cumbre, bajando
    },
    {
      id: '2',
      name: 'Optimización de Rendimiento',
      description: 'Mejorar tiempos de carga y respuesta en toda la aplicación',
      cycleId: '1',
      teamMembers: ['3'],
      progress: 30,
      hillChartPosition: 45 // Subiendo la colina
    },
    {
      id: '3',
      name: 'Funcionalidad de Comentarios',
      description: 'Permitir comentarios en propuestas y proyectos',
      cycleId: '2',
      teamMembers: [],
      progress: 0,
      hillChartPosition: 5 // Apenas comenzando
    }
  ];

  // Observable para el ciclo actual
  private currentCycleSubject = new BehaviorSubject<Cycle | null>(
    this.cycles.find(c => c.status === CycleStatus.ACTIVE) || null
  );
  currentCycle$ = this.currentCycleSubject.asObservable();

  constructor() { }

  // Obtener todos los ciclos
  getAllCycles(): Observable<Cycle[]> {
    return of([...this.cycles]);
  }

  // Obtener un ciclo por ID
  getCycleById(id: string): Observable<Cycle | undefined> {
    return of(this.cycles.find(c => c.id === id));
  }

  // Obtener el ciclo actual (activo)
  getCurrentCycle(): Observable<Cycle | null> {
    return this.currentCycle$;
  }

  // Obtener proyectos para un ciclo específico
  getProjectsByCycleId(cycleId: string): Observable<Project[]> {
    return of(this.projects.filter(p => p.cycleId === cycleId));
  }

  // Obtener proyectos del ciclo actual
  getCurrentCycleProjects(): Observable<Project[]> {
    const currentCycle = this.currentCycleSubject.value;
    if (!currentCycle) return of([]);
    
    return this.getProjectsByCycleId(currentCycle.id);
  }

  // Calcular días restantes para un ciclo
  getRemainingDays(cycle: Cycle): number {
    if (cycle.status !== CycleStatus.ACTIVE) return 0;
    
    const today = new Date();
    const endDate = new Date(cycle.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }
} 