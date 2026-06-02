// ============================================================
// FILE: src/app/core/models/auth.model.ts
// ============================================================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  roles?: string[];
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  token: string;
}
