import { apiClient } from '@/lib/apiClient'
import { API_URL } from '@clinicmind/config'

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post(`${API_URL}/auth/login`, credentials).then(r => r.data),

  register: (data: any) =>
    apiClient.post(`${API_URL}/auth/register`, data).then(r => r.data),

  getMe: () =>
    apiClient.get(`${API_URL}/auth/me`).then(r => r.data),

  forgotPassword: (email: string) =>
    apiClient.post(`${API_URL}/auth/forgot-password`, { email }).then(r => r.data),

  resetPassword: (token: string, password: string) =>
    apiClient.post(`${API_URL}/auth/reset-password`, { token, password }).then(r => r.data),
}
