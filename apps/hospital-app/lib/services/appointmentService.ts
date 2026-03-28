import { apiClient } from '@/lib/apiClient'
import { API_URL } from '@clinicmind/config'

export const appointmentService = {
  getAppointments: ({ hospitalId, doctorId }: { hospitalId?: string, doctorId?: string }) =>
    apiClient.get(`${API_URL}/appointments`, { params: { hospitalId, doctorId } }).then(r => r.data),

  createAppointment: (data: any) =>
    apiClient.post(`${API_URL}/appointments`, data).then(r => r.data),

  updateAppointment: (id: string, data: any) =>
    apiClient.patch(`${API_URL}/appointments/${id}`, data).then(r => r.data),

  cancelAppointment: (id: string) =>
    apiClient.patch(`${API_URL}/appointments/${id}/cancel`).then(r => r.data),

  getAppointmentDetail: (id: string) =>
    apiClient.get(`${API_URL}/appointments/${id}`).then(r => r.data),
}
