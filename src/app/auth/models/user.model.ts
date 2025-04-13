export enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  INVITADO = 'INVITADO'
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface User {
  id?: string;
  username: string;
  password?: string;
  token?: string;
  roles?: string[]; // IDs de roles asignados al usuario
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