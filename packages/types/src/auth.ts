import { UserRole } from './roles'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: 'patient' | 'hospital_admin'
}

export interface AuthUser {
  _id: string
  name: string
  email: string
  phone: string
  role: UserRole
  hospitalId: string | null
  isVerified: boolean
  isActive: boolean
  createdAt: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface JWTPayload {
  userId: string
  role: UserRole
  hospitalId: string | null
  isVerified: boolean
  iat: number
  exp: number
}
