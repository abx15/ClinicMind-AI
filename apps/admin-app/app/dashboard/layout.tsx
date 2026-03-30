'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/layout/AdminSidebar'
import TopBar from '@/components/layout/TopBar'
import { HomeIcon, ChartIcon, UsersIcon, SettingsIcon } from '@/components/icons'

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
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto min-h-screen p-6 pb-20 lg:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => router.push('/dashboard/overview')}
              className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs">Overview</span>
            </button>
            
            <button
              onClick={() => router.push('/dashboard/hospitals')}
              className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
            >
              <ChartIcon className="w-5 h-5" />
              <span className="text-xs">Hospitals</span>
            </button>
            
            <button
              onClick={() => router.push('/dashboard/doctors')}
              className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
            >
              <UsersIcon className="w-5 h-5" />
              <span className="text-xs">Doctors</span>
            </button>
            
            <button
              onClick={() => router.push('/dashboard/patients')}
              className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
            >
              <UsersIcon className="w-5 h-5" />
              <span className="text-xs">Patients</span>
            </button>
            
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/doctors')}
            className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
          >
            <UsersIcon className="w-5 h-5" />
            <span className="text-xs">Doctors</span>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/patients')}
            className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
          >
            <UsersIcon className="w-5 h-5" />
            <span className="text-xs">Patients</span>
          </button>
          
          <button
            onClick={() => router.push('/dashboard/settings')}
            className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
