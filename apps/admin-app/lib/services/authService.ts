import { apiClient } from '@/lib/apiClient'

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post('/auth/login', data)
    // Backend returns: { success: true, data: { user, token } }
    return res.data
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me')
    return res.data
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {}
  },
}
