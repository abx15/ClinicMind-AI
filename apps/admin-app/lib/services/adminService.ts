import { api } from '@/lib/apiClient'

export const adminService = {
  // Platform overview stats
  getPlatformStats: () =>
    api.get<any>('/admin/stats'),

  // All hospitals with status/search filter
  getAllHospitals: (params?: {
    status?: 'pending' | 'verified' | 'rejected' | 'suspended' | 'all'
    page?:   number
    limit?:  number
    search?: string
  }) => api.get<any>('/admin/hospitals', { params }),

  // Single hospital detail (includes doctors)
  getHospitalById: (id: string) =>
    api.get<any>(`/admin/hospitals/${id}`),

  // Approve hospital
  approveHospital: (id: string) =>
    api.patch<any>(`/admin/hospitals/${id}/approve`),

  // Reject hospital with reason
  rejectHospital: (id: string, reason: string) =>
    api.patch<any>(`/admin/hospitals/${id}/reject`, { reason }),

  // Suspend hospital
  suspendHospital: (id: string) =>
    api.patch<any>(`/admin/hospitals/${id}/suspend`),

  // Reactivate a suspended hospital
  reactivateHospital: (id: string) =>
    api.patch<any>(`/admin/hospitals/${id}/reactivate`),

  // Update hospital (plan, etc.)
  updateHospital: (id: string, data: Record<string, any>) =>
    api.patch<any>(`/admin/hospitals/${id}`, data),

  // Shortcut for plan update
  updateHospitalPlan: (id: string, plan: 'free' | 'pro' | 'growth') =>
    api.patch<any>(`/admin/hospitals/${id}`, { plan }),

  // All doctors across all hospitals
  getAllDoctors: (params?: {
    hospitalId?: string
    isVerified?: boolean
    search?:     string
    page?:       number
    limit?:      number
  }) => api.get<any>('/admin/doctors', { params }),

  // All patients
  getAllPatients: (params?: {
    page?:   number
    limit?:  number
    search?: string
  }) => api.get<any>('/admin/patients', { params }),
}

// Helper to safely extract data from AxiosResponse
// API returns: { success, data: { ... } }
// Axios wraps in: AxiosResponse.data
// React Query stores: the full AxiosResponse
// So actual data is at: response.data.data
export function extractData<T>(response: any): T | undefined {
  return response?.data?.data as T | undefined
}
