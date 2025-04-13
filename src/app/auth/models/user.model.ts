export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum ShapeUpGroup {
  SHAPER = 'SHAPER',
  STAKEHOLDER = 'STAKEHOLDER',
  BUILDER = 'BUILDER',
  DESIGNER = 'DESIGNER',
  QA = 'QA',
  TEAM_LEAD = 'TEAM_LEAD',
  TECH_LEAD = 'TECH_LEAD'
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface Group {
  id: ShapeUpGroup;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface User {
  id?: string;
  username: string;
  password?: string;
  token?: string;
  roles?: UserRole[];
  groups?: ShapeUpGroup[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ResetPasswordRequest {
  username: string;
  token: string;
  newPassword: string;
} 