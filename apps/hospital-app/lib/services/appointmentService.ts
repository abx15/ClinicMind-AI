import { apiClient } from '@/lib/apiClient'

export const appointmentService = {
  getAppointments: (params?: {
    hospitalId?: string
    doctorId?:   string
    status?:     string
    page?:       number
    limit?:      number
  }) =>
    apiClient.get('/appointments', { params }).then(r => r.data),

  createAppointment: (data: any) =>
    apiClient.post('/appointments', data).then(r => r.data),

  updateAppointment: (id: string, data: any) =>
    apiClient.patch(`/appointments/${id}`, data).then(r => r.data),

  cancelAppointment: (id: string) =>
    apiClient.patch(`/appointments/${id}/cancel`).then(r => r.data),

  getAppointmentDetail: (id: string) =>
    apiClient.get(`/appointments/${id}`).then(r => r.data),
}
