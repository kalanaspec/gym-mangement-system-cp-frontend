export interface User {
  userId: number;
  username: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface JwtResponse {
  token: string;
}

