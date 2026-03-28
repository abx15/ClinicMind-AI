import { UserRole } from './roles'

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: UserRole
  hospitalId?: string
  isVerified: boolean
  isActive: boolean
  createdAt: Date
}

export interface AuthUser extends User {
  token: string
}
