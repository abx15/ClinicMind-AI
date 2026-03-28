'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useRole } from '@/hooks/useRole'
import HospitalSidebar from '@/components/layout/HospitalSidebar'
import DoctorSidebar from '@/components/layout/DoctorSidebar'
import StaffSidebar from '@/components/layout/StaffSidebar'
import TopBar from '@/components/layout/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()
  const { isHospitalAdmin, isDoctor, isStaff } = useRole()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) return null

  // Render correct sidebar based on role
  const renderSidebar = () => {
    if (isHospitalAdmin) return <HospitalSidebar />
    if (isDoctor)        return <DoctorSidebar />
    if (isStaff)         return <StaffSidebar />
    return null
  }

  return (
    <div className="flex h-screen bg-[#F4F6F4] overflow-hidden">
      {renderSidebar()}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
