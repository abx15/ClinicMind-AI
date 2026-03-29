import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('clinicmind-hospital-auth')
      const token = stored ? JSON.parse(stored)?.state?.token : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch {}
  return config
})

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
