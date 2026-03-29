'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Keep types local so we don't depend on @clinicmind/types at runtime
interface AuthUser {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'hospital_admin' | 'doctor' | 'staff' | 'superadmin' | 'patient'
  hospitalId: string | null
  isVerified: boolean
  isActive?: boolean
}

interface AuthResponse {
  user:  AuthUser
  token: string
}

interface AuthState {
  user:            AuthUser | null
  token:           string | null
  isAuthenticated: boolean
  isLoading:       boolean
  login:           (response: AuthResponse) => void
  logout:          () => void
  setLoading:      (loading: boolean) => void
  updateUser:      (user: Partial<AuthUser>) => void
}

// SSR-safe localStorage wrapper
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try { return localStorage.getItem(key) } catch { return null }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try { localStorage.setItem(key, value) } catch {}
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try { localStorage.removeItem(key) } catch {}
  },
}

// Store key — MUST match what apiClient reads
export const HOSPITAL_STORE_KEY = 'clinicmind-hospital-auth'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,

      login: (response: AuthResponse) => {
        set({
          user:            response.user,
          token:           response.token,
          isAuthenticated: true,
          isLoading:       false,
        })
        // Set cookie for Next.js middleware (SSR-safe)
        if (typeof document !== 'undefined') {
          document.cookie = `clinicmind_token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false })
        if (typeof document !== 'undefined') {
          document.cookie = 'clinicmind_token=; path=/; max-age=0'
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      updateUser: (update) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...update } : null,
        })),
    }),
    {
      name:       HOSPITAL_STORE_KEY,  // matches apiClient key
      storage:    createJSONStorage(() => safeStorage),
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
)

// Selector hooks
export const useUser              = () => useAuthStore((s) => s.user)
export const useToken             = () => useAuthStore((s) => s.token)
export const useIsAuthenticated   = () => useAuthStore((s) => s.isAuthenticated)
export const useAuthLoading       = () => useAuthStore((s) => s.isLoading)
