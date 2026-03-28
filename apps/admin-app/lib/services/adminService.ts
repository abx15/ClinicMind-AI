import { api } from '@/lib/apiClient'
import { ApiSuccess } from '@clinicmind/types'

export const adminService = {
  // Platform overview stats
  getPlatformStats: () =>
    api.get<ApiSuccess<{
      totalHospitals:   number
      verifiedHospitals: number
      pendingHospitals: number
      totalDoctors:     number
      totalPatients:    number
      totalAppointments: number
      mrr: number
    }>>('/admin/stats'),

  // All hospitals with status filter
  getAllHospitals: (params?: {
    status?: 'pending' | 'verified' | 'rejected' | 'suspended'
    page?:   number
    limit?:  number
    search?: string
  }) => api.get<ApiSuccess<{
    hospitals:   any[]
    total:       number
    page:        number
    totalPages:  number
  }>>('/admin/hospitals', { params }),

  // Single hospital detail
  getHospitalById: (id: string) =>
    api.get<ApiSuccess<{ hospital: any }>>(`/admin/hospitals/${id}`),

  // Approve hospital
  approveHospital: (id: string) =>
    api.patch<ApiSuccess<{ hospital: any }>>(`/admin/hospitals/${id}/approve`),

  // Reject hospital
  rejectHospital: (id: string, reason: string) =>
    api.patch<ApiSuccess<{ hospital: any }>>(`/admin/hospitals/${id}/reject`, { reason }),

  // Suspend hospital
  suspendHospital: (id: string) =>
    api.patch<ApiSuccess<{ hospital: any }>>(`/admin/hospitals/${id}/suspend`),

  // All doctors across all hospitals
  getAllDoctors: (params?: { hospitalId?: string; isVerified?: boolean; page?: number }) =>
    api.get<ApiSuccess<{ doctors: any[]; total: number }>>('/admin/doctors', { params }),

  // All patients
  getAllPatients: (params?: { page?: number; search?: string }) =>
    api.get<ApiSuccess<{ patients: any[]; total: number }>>('/admin/patients', { params }),
}
