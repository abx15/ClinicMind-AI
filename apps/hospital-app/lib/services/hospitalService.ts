import { apiClient } from '@/lib/apiClient'
import { API_URL } from '@clinicmind/config'

export const hospitalService = {
  getProfile: () =>
    apiClient.get(`${API_URL}/hospitals/profile`).then(r => r.data),

  updateProfile: (data: any) =>
    apiClient.put(`${API_URL}/hospitals/profile`, data).then(r => r.data),

  getStats: (hospitalId: string) =>
    apiClient.get(`${API_URL}/hospitals/${hospitalId}/stats`).then(r => r.data),

  getDoctors: (hospitalId: string) =>
    apiClient.get(`${API_URL}/hospitals/${hospitalId}/doctors`).then(r => r.data),

  getStaff: (hospitalId: string) =>
    apiClient.get(`${API_URL}/hospitals/${hospitalId}/staff`).then(r => r.data),

  getAppointments: (hospitalId: string) =>
    apiClient.get(`${API_URL}/hospitals/${hospitalId}/appointments`).then(r => r.data),
}
