import { apiClient } from '@/lib/apiClient'
import { API_URL } from '@clinicmind/config'

export const staffService = {
  getStaff: ({ hospitalId }: { hospitalId: string }) =>
    apiClient.get(`${API_URL}/staff`, { params: { hospitalId } }).then(r => r.data),

  addStaff: (data: any) =>
    apiClient.post(`${API_URL}/staff`, data).then(r => r.data),

  updateStaff: (id: string, data: any) =>
    apiClient.patch(`${API_URL}/staff/${id}`, data).then(r => r.data),

  removeStaff: (id: string) =>
    apiClient.delete(`${API_URL}/staff/${id}`).then(r => r.data),

  getStaffDetail: (id: string) =>
    apiClient.get(`${API_URL}/staff/${id}`).then(r => r.data),
}
