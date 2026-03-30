'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthUser {
  _id: string
  name: string
  email: string
  phone: string
  role: 'superadmin' | 'hospital_admin' | 'doctor' | 'staff' | 'patient'
  hospitalId: string | null
  isVerified: boolean
  isActive: boolean
}

interface AuthState {
  user:            AuthUser | null
  token:           string | null
  isLoading:       boolean
  isAuthenticated: boolean
  setAuth:         (user: AuthUser, token: string) => void
  clearAuth:       () => void
  setLoading:      (v: boolean) => void
  updateUser:      (data: Partial<AuthUser>) => void
}

const safeLocalStorage = {
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isLoading:       true, // Start with loading true during hydration
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true, isLoading: false }),

      clearAuth: () =>
        set({ user: null, token: null, isAuthenticated: false, isLoading: false }),

      setLoading: (v) => set({ isLoading: v }),

      updateUser: (data) => {
        const cur = get().user
        if (cur) set({ user: { ...cur, ...data } })
      },
    }),
    {
      name: 'clinicmind-admin-auth',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        // Set loading to false after hydration
        if (state) {
          state.setLoading(false)
        }
      },
    }
  )
)

// Selector hooks
export const useUser       = () => useAuthStore((s) => s.user)
export const useToken      = () => useAuthStore((s) => s.token)
export const useIsAuth     = () => useAuthStore((s) => s.isAuthenticated)
export const useUserRole   = () => useAuthStore((s) => s.user?.role)
export const useIsVerified = () => useAuthStore((s) => s.user?.isVerified)
