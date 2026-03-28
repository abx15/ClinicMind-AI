'use client'

import { useAuth } from '@/hooks/useAuth'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0F6E56] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#8A9E98]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via middleware
  }

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}
