'use client'

import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setLoading,
    updateUser
  } = useAuthStore()

  return {
    user,
    token,
    loading: isLoading,
    isAuthenticated,
    login,
    logout,
    setLoading,
    updateUser
  }
}
