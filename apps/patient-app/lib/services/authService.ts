import apiClient from '../apiClient'
import { LoginCredentials, RegisterData, AuthResponse } from '@clinicmind/types'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  updateProfile: async (data: Partial<RegisterData>) => {
    const response = await apiClient.patch('/auth/me', data)
    return response.data
  },
}
