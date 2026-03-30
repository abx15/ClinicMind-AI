'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore, useIsAuthenticated } from '@/stores/authStore'
import { apiClient } from '@/lib/apiClient'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EyeIcon, EyeOffIcon, LoaderIcon, CheckIcon, UsersIcon, ShieldIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

const ROLE_REDIRECTS: Record<string, string> = {
  hospital_admin: '/dashboard/overview',
  doctor: '/dashboard/doctor/queue',
  staff: '/dashboard/staff/queue',
}

export default function HospitalLoginPage() {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const login = useAuthStore(s => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        setError('This portal is not for patients. Please use the patient app.')
        setLoading(false)
        return
      }

      // Handle doctor verification status
      if (user.role === 'doctor') {
        const redirect = user.isVerified ? '/dashboard/doctor/queue' : '/dashboard/doctor/pending'
        login({ user, token })
        router.replace(redirect)
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
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sidebar to-sidebar-dark flex-col justify-center px-12 py-16">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <Image
              src="/logo.png"
              alt="ClinicMind"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <h1 className="text-3xl font-bold text-white font-heading">
              ClinicMind
            </h1>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-white mb-4 font-heading">
            Hospital Management Portal
          </h2>
          <p className="text-white/80 mb-12 text-lg">
            Complete healthcare management solution for modern hospitals
          </p>

          {/* Feature List */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Staff Management</h3>
                <p className="text-white/70 text-sm">
                  Manage doctors, nurses, and administrative staff efficiently
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Queue Management</h3>
                <p className="text-white/70 text-sm">
                  Real-time patient queue and token system
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Secure & Compliant</h3>
                <p className="text-white/70 text-sm">
                  HIPAA compliant with enterprise-grade security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <Image
              src="/logo.png"
              alt="ClinicMind"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <h1 className="text-2xl font-bold text-primary font-heading">
              ClinicMind
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text1 font-heading mb-2">
                Welcome Back
              </h2>
              <p className="text-text3">
                Sign in to access your hospital dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text1 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hospital.com"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text1 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text3 hover:text-text2 transition-colors"
                  >
                    {showPass ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-danger-light border border-danger/20 rounded-lg p-3">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Dev Credentials */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
                <p className="text-xs font-semibold text-text2 uppercase tracking-wide mb-3">
                  Development Credentials
                </p>
                <div className="text-xs text-text3 space-y-2">
                  <div>
                    <span className="font-medium text-text2">Admin:</span>
                    <br />
                    admin@apollo.com / Hospital@123
                  </div>
                  <div>
                    <span className="font-medium text-text2">Doctor:</span>
                    <br />
                    priya@apollo.com / Doctor@123
                  </div>
                  <div>
                    <span className="font-medium text-text2">Staff:</span>
                    <br />
                    staff@apollo.com / Staff@123
                  </div>
                </div>
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-3">
              <Link
                href="/doctor/setup"
                className="block text-sm text-primary hover:text-primary-dark transition-colors"
              >
                First time doctor? Complete your profile →
              </Link>
              <Link
                href="/register"
                className="block text-sm text-text3 hover:text-text2 transition-colors"
              >
                Register your hospital →
              </Link>
            </div>
          </div>

          {/* Mobile Footer */}
          <p className="text-center text-text3 text-xs mt-8 lg:hidden">
            ClinicMind AI Platform · v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
