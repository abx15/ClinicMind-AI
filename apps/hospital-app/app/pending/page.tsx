'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/stores/authStore'
import { useAuthStore } from '@/stores/authStore'

export default function PendingPage() {
  const router = useRouter()
  const user = useUser()
  const { logout } = useAuthStore()
  const [submittedDate] = useState(new Date().toLocaleDateString())

  // Auto-poll every 30 seconds
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
            if (data.user.hospitalId && data.user.hospital?.status === 'verified') {
              router.push('/dashboard/overview')
            }
          }
        }
      } catch (error) {
        console.error('Status check failed:', error)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [router])

  const handleCheckStatus = async () => {
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
          if (data.user.hospitalId && data.user.hospital?.status === 'verified') {
            router.push('/dashboard/overview')
          } else {
            // Show message that still pending
            alert('Your registration is still under review. Please check back later.')
          }
        }
      }
    } catch (error) {
      console.error('Status check failed:', error)
      alert('Failed to check status. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F6E56] to-[#094D3C] flex items-center justify-center p-6">
      {/* Logout button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={logout}
          className="text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-white/[0.1] p-10 max-w-md w-full text-center shadow-2xl">
        {/* Animated hourglass */}
        <div className="w-20 h-20 rounded-full bg-[#FEF3E2] flex items-center justify-center
                        mx-auto mb-6">
          <span className="text-3xl animate-bounce">⏳</span>
        </div>

        <h1 className="font-syne font-bold text-2xl text-[#1A2420] mb-3">
          Your registration is under review
        </h1>

        <p className="text-sm text-[#8A9E98] leading-relaxed mb-6">
          Our team will verify your hospital license and approve your account.
          You'll receive an email when approved.
        </p>

        {/* Info box */}
        <div className="bg-[#F4F6F4] rounded-xl p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#8A9E98]">Hospital name</span>
            <span className="font-medium text-[#1A2420]">{user?.name || 'Loading...'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8A9E98]">Submitted date</span>
            <span className="font-medium text-[#1A2420]">{submittedDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8A9E98]">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                             px-2.5 py-0.5 rounded-full bg-[#FEF3E2] text-[#B86E0A]">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse"/>
              Pending Review
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCheckStatus}
            className="w-full bg-[#0F6E56] text-white py-3 rounded-lg font-semibold
                     hover:bg-[#094D3C] transition-colors"
          >
            Check Status
          </button>
          
          <button
            className="w-full py-3 text-sm text-[#8A9E98] hover:text-[#4A5E58] 
                     transition-colors"
          >
            Contact Support
          </button>
        </div>

        {/* Auto-check indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-[#0F6E56] rounded-full animate-pulse"></div>
          <p className="text-xs text-[#8A9E98]">
            Checking automatically every 30 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}
