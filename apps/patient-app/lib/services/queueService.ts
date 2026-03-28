import apiClient from '../apiClient'
import { QueueToken } from '@clinicmind/types'

export const queueService = {
  getMyStatus: async () => {
    const response = await apiClient.get('/queue/my-status')
    return response.data
  },

  joinQueue: async (appointmentId: string) => {
    const response = await apiClient.post('/queue/join', { appointmentId })
    return response.data
  },

  leaveQueue: async () => {
    const response = await apiClient.post('/queue/leave')
    return response.data
  },

  getQueueStats: async (doctorId: string) => {
    const response = await apiClient.get(`/queue/stats?doctorId=${doctorId}`)
    return response.data
  },
}
