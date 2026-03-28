import { apiClient } from '@/lib/apiClient'
import { API_URL } from '@clinicmind/config'

export const queueService = {
  getTodayQueue: (doctorId: string) =>
    apiClient.get(`${API_URL}/queue/today/${doctorId}`).then(r => r.data),

  callNext: (tokenId: string) =>
    apiClient.post(`${API_URL}/queue/call-next`, { tokenId }).then(r => r.data),

  markDone: (tokenId: string) =>
    apiClient.post(`${API_URL}/queue/mark-done`, { tokenId }).then(r => r.data),

  addToken: (data: { patientId: string, doctorId: string, complaint?: string }) =>
    apiClient.post(`${API_URL}/queue/add`, data).then(r => r.data),
}
