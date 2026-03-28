import { apiClient } from '@/lib/apiClient'
import { API_URL } from '@clinicmind/config'

export const aiService = {
  triage: (data: { symptoms: string[]; age: number; gender: string }) =>
    apiClient.post(`${API_URL}/ai/triage`, data).then(r => r.data),

  voicePrescription: (formData: FormData) =>
    apiClient.post(`${API_URL}/ai/prescription/voice`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  drugCheck: (data: { medications: string[] }) =>
    apiClient.post(`${API_URL}/ai/drug-check`, data).then(r => r.data),
}
