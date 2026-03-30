'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router          = useRouter()
  const user            = useAuthStore(s => s.user)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const isLoading       = useAuthStore(s => s.isLoading)

  useEffect(() => {
    // Only redirect if we're done loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // While the store is hydrating (SSR → client), show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B2920] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0F6E56] border-t-transparent
                          rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-white/80">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated yet — don't render (redirect fires in useEffect)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0B2920] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
