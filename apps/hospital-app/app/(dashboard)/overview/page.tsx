'use client'

import { useQuery } from '@tanstack/react-query'
import { useRole } from '@/hooks/useRole'
import { useUser } from '@/stores/authStore'
import StatCard from '@/components/common/StatCard'
import Link from 'next/link'

// Mock data - replace with actual API calls
const mockStats = {
  totalDoctors: 24,
  pendingDoctors: 3,
  todayPatients: 156,
  activeStaff: 12,
}

const mockPendingDoctors = [
  {
    _id: '1',
    name: 'Dr. Priya Sharma',
    specialization: 'Cardiology',
    experience: 8,
    avatar: 'PS',
  },
  {
    _id: '2',
    name: 'Dr. Rahul Kumar',
    specialization: 'Orthopedics',
    experience: 5,
    avatar: 'RK',
  },
  {
    _id: '3',
    name: 'Dr. Anjali Patel',
    specialization: 'Pediatrics',
    experience: 12,
    avatar: 'AP',
  },
]

export default function OverviewPage() {
  const { hospitalId } = useRole()
  const user = useUser()

  // Mock queries - replace with actual API calls
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['overview-stats', hospitalId],
    queryFn: () => Promise.resolve(mockStats),
    enabled: !!hospitalId,
  })

  const { data: pendingDoctors, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-doctors', hospitalId],
    queryFn: () => Promise.resolve(mockPendingDoctors),
    enabled: !!hospitalId,
  })

  const statsData = stats || mockStats
  const pendingData = pendingDoctors || mockPendingDoctors

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Doctors"
          value={statsData.totalDoctors}
          trend="+3 this month"
          color="purple"
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="6" r="4"/>
              <path d="M3 18c0-4 3.5-7 7-7s7 3 7 7" fill="currentColor"/>
            </svg>
          }
        />
        
        <StatCard
          label="Pending Verify"
          value={statsData.pendingDoctors}
          trend="Action needed"
          color="amber"
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
              <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
        />
        
        <StatCard
          label="Today's Patients"
          value={statsData.todayPatients}
          trend="↑ 12%"
          color="teal"
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="6" r="4"/>
              <path d="M3 18c0-4 3.5-7 7-7s7 3 7 7" fill="currentColor"/>
            </svg>
          }
        />
        
        <StatCard
          label="Active Staff"
          value={statsData.activeStaff}
          trend="2 on leave"
          color="blue"
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="6" cy="6" r="3"/>
              <circle cx="14" cy="6" r="3"/>
              <path d="M1 16c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5"/>
              <path d="M10 11c1.5.5 3 2 3 4"/>
            </svg>
          }
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pending doctors (60%) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1A2420]">Doctors Pending Verification</h3>
            <Link
              href="/dashboard/doctors"
              className="text-sm text-[#0F6E56] font-medium hover:underline"
            >
              View all doctors →
            </Link>
          </div>

          {pendingLoading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E2E8E4] p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E2E8E4] rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#E2E8E4] rounded w-1/3"></div>
                      <div className="h-3 bg-[#E2E8E4] rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-[#E2E8E4] rounded"></div>
                      <div className="h-8 w-12 bg-[#E2E8E4] rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pendingData.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E2E8E4] p-8 text-center">
              <div className="w-12 h-12 bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0F6E56">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="9" fill="none" stroke="#0F6E56" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="font-semibold text-[#1A2420] mb-1">All doctors verified!</h4>
              <p className="text-sm text-[#8A9E98]">No pending verifications at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingData.map((doctor) => (
                <div key={doctor._id} className="bg-white rounded-xl border border-[#E2E8E4] p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#0F6E56] flex items-center justify-center text-white font-semibold">
                      {doctor.avatar}
                    </div>
                    
                    {/* Doctor info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1A2420]">{doctor.name}</h4>
                      <p className="text-sm text-[#8A9E98]">
                        {doctor.specialization} · {doctor.experience} years
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-[#0F6E56] text-white text-xs font-semibold rounded-lg hover:bg-[#094D3C] transition-colors">
                        Verify
                      </button>
                      <button className="px-3 py-1.5 border border-[#E2E8E4] text-[#1A2420] text-xs font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Hospital info (40%) */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1A2420]">Hospital Information</h3>
          
          <div className="bg-white rounded-xl border border-[#E2E8E4] p-6 space-y-4">
            {/* Hospital name and status */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-[#1A2420] text-lg">{user?.name || 'Apollo Hospitals'}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge-teal">Verified</span>
                  <span className="badge-purple">Pro Plan</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 border-t border-[#E2E8E4] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A9E98]">Location</span>
                <span className="font-medium text-[#1A2420]">Mumbai, India</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A9E98]">License</span>
                <span className="font-medium text-[#1A2420]">MH-2024-1234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A9E98]">Doctors</span>
                <span className="font-medium text-[#1A2420]">{statsData.totalDoctors}/∞</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Link
                href="/dashboard/settings"
                className="block w-full py-2 text-center text-sm text-[#0F6E56] font-medium border border-[#0F6E56] rounded-lg hover:bg-[#E1F5EE] transition-colors"
              >
                Edit Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-[#E2E8E4] p-6">
        <h3 className="font-semibold text-[#1A2420] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/dashboard/doctors/add"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0F6E56] text-white text-sm font-semibold rounded-lg hover:bg-[#094D3C] transition-colors"
          >
            <span>+</span> Invite Doctor
          </Link>
          <Link
            href="/dashboard/staff/add"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1D63B5] text-white text-sm font-semibold rounded-lg hover:bg-[#1A5498] transition-colors"
          >
            <span>+</span> Add Staff
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-[#E2E8E4] text-[#1A2420] text-sm font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors"
          >
            📊 View Analytics
          </Link>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-[#E2E8E4] text-[#1A2420] text-sm font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
            📄 Export Report
          </button>
        </div>
      </div>
    </div>
  )
}
