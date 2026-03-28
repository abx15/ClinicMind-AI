import { apiClient } from '@/lib/apiClient'
import { API_URL } from '@clinicmind/config'

export const prescriptionService = {
  getPrescriptions: ({ doctorId, patientId }: { doctorId?: string, patientId?: string }) =>
    apiClient.get(`${API_URL}/prescriptions`, { params: { doctorId, patientId } }).then(r => r.data),

  createPrescription: (data: any) =>
    apiClient.post(`${API_URL}/prescriptions`, data).then(r => r.data),

  updatePrescription: (id: string, data: any) =>
    apiClient.patch(`${API_URL}/prescriptions/${id}`, data).then(r => r.data),

  getPrescriptionDetail: (id: string) =>
    apiClient.get(`${API_URL}/prescriptions/${id}`).then(r => r.data),

  downloadPrescription: (id: string) =>
    apiClient.get(`${API_URL}/prescriptions/${id}/download`, { responseType: 'blob' }).then(r => r.data),
}
