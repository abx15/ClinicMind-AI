import apiClient from '../apiClient'
import { Appointment, AppointmentStatus } from '@clinicmind/types'

interface CreateAppointmentData {
  doctorId: string
  hospitalId: string
  date: string
  timeSlot: string
  notes?: string
}

export const appointmentService = {
  getAppointments: async (status?: AppointmentStatus[]) => {
    const params = status ? `?status=${status.join(',')}` : ''
    const response = await apiClient.get(`/appointments${params}`)
    return response.data
  },

  bookAppointment: async (data: CreateAppointmentData) => {
    const response = await apiClient.post('/appointments', data)
    return response.data
  },

  updateAppointmentStatus: async (appointmentId: string, status: AppointmentStatus) => {
    const response = await apiClient.patch(`/appointments/${appointmentId}/status`, { status })
    return response.data
  },

  getAvailableSlots: async (doctorId: string, date: string) => {
    const response = await apiClient.get(`/appointments/slots?doctorId=${doctorId}&date=${date}`)
    return response.data
  },
}
