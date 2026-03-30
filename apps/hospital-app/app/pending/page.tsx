'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/stores/authStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { apiClient } from '@/lib/apiClient'

export default function PendingPage() {
  const router = useRouter()
  const user = useUser()
  const { logout } = useAuthStore()
  const [submittedDate] = useState(new Date().toLocaleDateString())
  const [isChecking, setIsChecking] = useState(false)

  // Auto-poll every 15 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get('/auth/me')
        const userData = response.data?.data ?? response.data
        
        if (userData.hospitalId && userData.hospital?.status === 'verified') {
          router.replace('/dashboard/overview')
        }
      } catch (error) {
        console.error('Status check failed:', error)
      }
    }, 15000) // 15 seconds

    return () => clearInterval(interval)
  }, [router])

  const handleCheckStatus = async () => {
    setIsChecking(true)
    try {
      const response = await apiClient.get('/auth/me')
      const userData = response.data?.data ?? response.data
      
      if (userData.hospitalId && userData.hospital?.status === 'verified') {
        router.replace('/dashboard/overview')
      } else {
        alert('Your registration is still under review. Please check back later.')
      }
    } catch (error) {
      console.error('Status check failed:', error)
      alert('Failed to check status. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-6">
      {/* Logout button */}
      <div className="absolute top-6 right-6">
        <Button
          onClick={logout}
          variant="ghost"
          className="text-white/80 hover:text-white"
        >
          Sign out
        </Button>
      </div>

      <Card className="w-full max-w-md p-8 text-center">
        {/* Animated hourglass */}
        <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
          <div className="relative">
            {/* Hourglass animation using CSS */}
            <div className="w-8 h-8 border-4 border-primary rounded-sm animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-text1 font-heading mb-3">
          Your registration is under review
        </h1>

        <p className="text-text3 leading-relaxed mb-6">
          Our team will verify your hospital license and approve your account.
          You'll receive an email when approved.
        </p>

        {/* Info box */}
        <div className="bg-surface rounded-xl p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-text3">Hospital name</span>
            <span className="font-medium text-text1">{user?.name || 'Loading...'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text3">Submitted date</span>
            <span className="font-medium text-text1">{submittedDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text3">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                           px-2.5 py-0.5 rounded-full bg-warn text-warn-contrast">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse"/>
              Pending Review
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleCheckStatus}
            loading={isChecking}
            className="w-full"
          >
            {isChecking ? 'Checking...' : 'Check Status'}
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open('mailto:support@clinicmind.in')}
          >
            Contact Support
          </Button>
        </div>

        {/* Auto-check indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <p className="text-xs text-text3">
            Checking automatically every 15 seconds...
          </p>
        </div>
      </Card>
    </div>
  )
}
