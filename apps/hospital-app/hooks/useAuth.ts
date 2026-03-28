'use client'

import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { isAuthenticated, isLoading, login, logout, user } = useAuthStore()

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user,
  }
}
