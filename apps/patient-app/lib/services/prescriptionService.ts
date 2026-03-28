import apiClient from '../apiClient'

export interface Prescription {
  _id: string
  patientId: string
  doctorId: string
  hospitalId: string
  appointmentId: string
  diagnosis: string
  medications: Medication[]
  notes?: string
  createdAt: string
  doctor?: {
    name: string
    specialization: string
  }
  hospital?: {
    name: string
    city: string
  }
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export const prescriptionService = {
  getMyPrescriptions: async () => {
    const response = await apiClient.get('/prescriptions')
    return response.data
  },

  getPrescriptionById: async (id: string) => {
    const response = await apiClient.get(`/prescriptions/${id}`)
    return response.data
  },
}
