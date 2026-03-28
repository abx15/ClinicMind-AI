import { apiClient } from '@/lib/apiClient'
import { API_URL } from '@clinicmind/config'

export const doctorService = {
  getDoctors: ({ hospitalId }: { hospitalId: string }) =>
    apiClient.get(`${API_URL}/doctors`, { params: { hospitalId } }).then(r => r.data),

  inviteDoctor: (data: any) =>
    apiClient.post(`${API_URL}/doctors/invite`, data).then(r => r.data),

  verifyDoctor: (id: string) =>
    apiClient.patch(`${API_URL}/doctors/${id}/verify`).then(r => r.data),

  unverifyDoctor: (id: string) =>
    apiClient.patch(`${API_URL}/doctors/${id}/unverify`).then(r => r.data),

  removeDoctor: (id: string) =>
    apiClient.delete(`${API_URL}/doctors/${id}`).then(r => r.data),

  getDoctorDetail: (id: string) =>
    apiClient.get(`${API_URL}/doctors/${id}`).then(r => r.data),
}
