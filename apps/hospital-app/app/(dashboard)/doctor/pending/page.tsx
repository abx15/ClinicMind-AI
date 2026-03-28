'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useUser } from '@/stores/authStore'

export default function DoctorPendingPage() {
  const router = useRouter()
  const user = useUser()
  const { logout } = useAuthStore()

  // Auto-poll every 10 seconds — check if verified
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('clinicmind-auth')
          ? JSON.parse(localStorage.getItem('clinicmind-auth')!).state?.token
          : null

        if (token) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data.user.isVerified) {
              router.push('/dashboard/doctor/queue')
            }
          }
        }
      } catch (error) {
        console.error('Status check failed:', error)
      }
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [router])

  return (
    // Full screen centered layout — no sidebar for this page
    <div className="min-h-screen bg-[#F4F6F4] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-10 max-w-md w-full text-center">
        {/* Animated hourglass */}
        <div className="w-20 h-20 rounded-full bg-[#FEF3E2] flex items-center justify-center
                        mx-auto mb-6">
          <span className="text-3xl animate-bounce">⏳</span>
        </div>

        <h1 className="font-syne font-bold text-2xl text-[#1A2420] mb-3">
          Awaiting Verification
        </h1>

        <p className="text-sm text-[#8A9E98] leading-relaxed mb-6">
          Your profile has been submitted. The hospital admin at{' '}
          <span className="text-[#1A2420] font-medium">Apollo Hospitals</span>{' '}
          needs to verify your credentials before you can access the dashboard.
        </p>

        {/* Status card */}
        <div className="bg-[#F4F6F4] rounded-xl p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#8A9E98]">Your name</span>
            <span className="font-medium text-[#1A2420]">{user?.name || 'Loading...'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8A9E98]">Email</span>
            <span className="font-medium text-[#1A2420]">{user?.email || 'Loading...'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8A9E98]">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                             px-2.5 py-0.5 rounded-full bg-[#FEF3E2] text-[#B86E0A]">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"/>
              Pending verification
            </span>
          </div>
        </div>

        {/* Checking indicator */}
        <p className="text-xs text-[#8A9E98] mb-6">
          Checking automatically every 10 seconds...
        </p>

        <button
          onClick={logout}
          className="text-sm text-[#8A9E98] hover:text-[#4A5E58] transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
