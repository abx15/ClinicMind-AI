'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/apiClient'

interface User {
  id: string
  name: string
  email: string
  role: 'superadmin'
}

interface AuthState {
  user: User | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  })
  const router = useRouter()

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = getCookie('clinicmind_token')
      if (!token) {
        setAuthState({ user: null, loading: false })
        return
      }

      // Verify token with API
      const response = await api.get('/auth/me')
      if (response.data.user?.role === 'superadmin') {
        setAuthState({ user: response.data.user, loading: false })
      } else {
        // Not a superadmin, clear token and redirect
        deleteCookie('clinicmind_token')
        setAuthState({ user: null, loading: false })
        router.push('/login')
      }
    } catch (error) {
      deleteCookie('clinicmind_token')
      setAuthState({ user: null, loading: false })
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    const { user, token } = response.data

    if (user.role !== 'superadmin') {
      throw new Error('This portal is for super admins only')
    }

    // Set token in cookie
    setCookie('clinicmind_token', token, 7)
    setAuthState({ user, loading: false })

    return { user, token }
  }

  const logout = () => {
    deleteCookie('clinicmind_token')
    setAuthState({ user: null, loading: false })
    router.push('/login')
  }

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  }
}

// Cookie helpers
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  
  const isProduction = process.env.NODE_ENV === 'production'
  document.cookie = [
    `${name}=${value}`,
    'path=/',
    `expires=${expires.toUTCString()}`,
    'SameSite=Lax',
    isProduction ? 'Secure' : '',
  ].filter(Boolean).join('; ')
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
