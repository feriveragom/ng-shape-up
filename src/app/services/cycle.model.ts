export enum CycleStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  COOLDOWN = 'COOLDOWN',
  COMPLETED = 'COMPLETED'
}

export interface Cycle {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: CycleStatus;
  theme?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  cycleId: string;
  teamMembers: string[]; // IDs de usuarios
  progress: number; // 0-100
  hillChartPosition?: number; // 0-100, representa posición en la colina
} 