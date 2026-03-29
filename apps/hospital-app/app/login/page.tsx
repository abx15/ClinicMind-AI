'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore, useIsAuthenticated } from '@/stores/authStore'
import { apiClient } from '@/lib/apiClient'
import { EyeIcon, EyeOffIcon, LoaderIcon } from '@/components/icons'

const ROLE_REDIRECTS: Record<string, string> = {
  hospital_admin: '/dashboard/overview',
  doctor:         '/dashboard/doctor/queue',
  staff:          '/dashboard/staff/queue',
}

export default function HospitalLoginPage() {
  const router          = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const login           = useAuthStore(s => s.login)

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  // Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard/overview')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await apiClient.post('/auth/login', { email, password })

      // Backend returns: { success: true, data: { user, token } }
      const payload = res.data?.data ?? res.data
      const { user, token } = payload

      const allowedRoles = ['hospital_admin', 'doctor', 'staff']
      if (!allowedRoles.includes(user?.role)) {
        setError('Access denied. This portal is for hospital staff only.')
        setLoading(false)
        return
      }

      // Save to zustand + cookie
      login({ user, token })

      // Role-based redirect
      const redirect = ROLE_REDIRECTS[user.role] ?? '/dashboard/overview'
      router.replace(redirect)
    } catch (err: any) {
      const msg = err?.response?.data?.error
             ?? err?.response?.data?.message
             ?? err?.message
             ?? 'Login failed. Check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[#E2E8E4]">

          {/* Header */}
          <div className="bg-[#0B2920] px-8 py-7 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Image
                src="/logo.png"
                alt="ClinicMind"
                width={32}
                height={32}
                className="rounded-xl"
              />
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                ClinicMind
              </span>
            </div>
            <p className="text-white/50 text-xs">Hospital Management Portal</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <h2 className="font-heading font-bold text-lg text-[#1A2420] mb-5">
              Sign in to continue
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
                  Email address
                </label>
                <input
                  id="hospital-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@hospital.com"
                  autoComplete="email"
                  className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/15
                             transition-all bg-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="hospital-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2.5 pr-10
                               text-sm text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                               focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/15
                               transition-all bg-white"
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9E98]
                               hover:text-[#4A5E58]"
                  >
                    {showPass ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3
                                text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="hospital-login-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4
                           bg-[#0F6E56] hover:bg-[#0a5c47] text-white font-semibold
                           rounded-xl transition-colors disabled:opacity-60
                           disabled:cursor-not-allowed text-sm mt-1"
              >
                {loading && <LoaderIcon size={16} />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Dev credentials */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-5 p-3 bg-[#F4F6F4] rounded-xl border border-[#E2E8E4]
                              space-y-1.5">
                <p className="text-[10px] font-bold text-[#4A5E58] uppercase tracking-wide">
                  Dev Credentials
                </p>
                <div className="text-xs text-[#4A5E58] space-y-0.5">
                  <p><span className="font-semibold">Admin:</span> admin@apollo.com / Hospital@123</p>
                  <p><span className="font-semibold">Doctor:</span> priya@apollo.com / Doctor@123</p>
                  <p><span className="font-semibold">Staff:</span> staff@apollo.com / Staff@123</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-5 text-center space-y-2">
          <Link
            href="/doctor/setup"
            className="block text-xs text-[#8A9E98] hover:text-[#0F6E56] transition-colors"
          >
            First time? Complete your doctor profile →
          </Link>
          <Link
            href="/"
            className="block text-xs text-[#8A9E98] hover:text-[#4A5E58] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <p className="text-center text-[#8A9E98] text-[10px] mt-4">
          ClinicMind AI Platform · v1.0
        </p>
      </div>
    </div>
  )
}
