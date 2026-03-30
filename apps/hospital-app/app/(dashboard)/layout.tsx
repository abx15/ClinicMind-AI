'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useRole } from '@/hooks/useRole'
import HospitalSidebar from '@/components/layout/HospitalSidebar'
import DoctorSidebar from '@/components/layout/DoctorSidebar'
import StaffSidebar from '@/components/layout/StaffSidebar'
import TopBar from '@/components/layout/TopBar'
import { HomeIcon, UsersIcon, CalendarIcon, ClockIcon, SettingsIcon } from '@/components/icons'

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
        <main className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 overflow-y-auto p-6 pb-20 lg:pb-6">
            {children}
          </div>
          
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
                onClick={() => router.push('/dashboard/doctors')}
                className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
              >
                <UsersIcon className="w-5 h-5" />
                <span className="text-xs">Doctors</span>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/staff')}
                className="flex flex-col items-center gap-1 p-2 text-text-3 hover:text-primary"
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="text-xs">Schedule</span>
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
        </main>
      </div>
    </div>
  )
}
