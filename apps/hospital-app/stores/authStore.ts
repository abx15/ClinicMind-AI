import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser, AuthResponse } from '@clinicmind/types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (response: AuthResponse) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (response: AuthResponse) => {
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        })
        // Set cookie for middleware
        document.cookie = `clinicmind_token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        // Clear cookie
        document.cookie = 'clinicmind_token=; path=/; max-age=0'
      },
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      updateUser: (userUpdate: Partial<AuthUser>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userUpdate } : null,
        })),
    }),
    {
      name: 'clinicmind-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user)
export const useToken = () => useAuthStore((state) => state.token)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
