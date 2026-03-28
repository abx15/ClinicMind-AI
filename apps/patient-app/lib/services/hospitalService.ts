import apiClient from '../apiClient'
import { Hospital } from '@clinicmind/types'

interface HospitalFilters {
  search?: string
  city?: string
  specialization?: string
  page?: number
  limit?: number
}

interface HospitalResponse {
  hospitals: Hospital[]
  total: number
  page: number
  totalPages: number
}

export const hospitalService = {
  getHospitals: async (filters: HospitalFilters = {}): Promise<HospitalResponse> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await apiClient.get(`/hospitals?${params.toString()}`)
    return response.data
  },

  getHospitalBySlug: async (slug: string) => {
    const response = await apiClient.get(`/hospitals/${slug}`)
    return response.data
  },

  getHospitalDoctors: async (hospitalId: string) => {
    const response = await apiClient.get(`/hospitals/${hospitalId}/doctors`)
    return response.data
  },
}
