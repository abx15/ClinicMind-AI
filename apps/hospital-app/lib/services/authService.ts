import { apiClient } from '@/lib/apiClient'

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post('/auth/login', credentials)
    // Backend returns: { success: true, data: { user, token } }
    return res.data
  },

  register: async (data: {
    name: string; email: string; phone: string
    password: string; role: string
  }) => {
    const res = await apiClient.post('/auth/register', data)
    return res.data
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me')
    return res.data
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post('/auth/forgot-password', { email })
    return res.data
  },

  resetPassword: async (token: string, password: string) => {
    const res = await apiClient.post('/auth/reset-password', { token, password })
    return res.data
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {}
  },
}
