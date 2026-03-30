import apiClient from '../apiClient'
import { Doctor } from '@clinicmind/types'

interface DoctorFilters {
  search?: string
  specialization?: string
  hospitalId?: string
  page?: number
  limit?: number
}

interface DoctorResponse {
  doctors: Doctor[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const doctorService = {
  getPublicDoctors: async (filters: DoctorFilters = {}, page = 1, limit = 10): Promise<DoctorResponse> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await apiClient.get(`/doctors?${params.toString()}`)
    return response.data
  },

  getSpecializations: async (): Promise<string[]> => {
    const response = await apiClient.get('/doctors/specializations')
    return response.data
  },

  getDoctorProfile: async (id: string): Promise<Doctor> => {
    const response = await apiClient.get(`/doctors/${id}`)
    return response.data
  },

  getDoctorsByHospital: async (hospitalId: string, filters: any = {}, page = 1, limit = 10): Promise<DoctorResponse> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await apiClient.get(`/doctors/hospital/${hospitalId}?${params.toString()}`)
    return response.data
  },
}
