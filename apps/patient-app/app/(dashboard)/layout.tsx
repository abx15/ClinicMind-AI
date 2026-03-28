'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated, useUser } from '@/stores/authStore'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    // Only patients in patient app
    if (user && user.role !== 'patient') {
      router.push('/login')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user) {
    return null // Middleware handles redirect
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
