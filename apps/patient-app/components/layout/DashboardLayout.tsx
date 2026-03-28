'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated, useUser, useAuthStore } from '@/stores/authStore'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()
  const { logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // Only patients in patient app
    if (user && user.role !== 'patient') {
      logout()
      router.push('/login')
    }
  }, [isAuthenticated, user, router, logout])

  if (!isAuthenticated || !user) {
    return null // Middleware handles redirect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-primary-700 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:pl-60">
        {/* Top Bar */}
        <TopBar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page content */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
