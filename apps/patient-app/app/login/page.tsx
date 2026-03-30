'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeOffIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/apiClient'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/home')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/auth/login', formData)
      login(response.data.data)
      router.push('/dashboard/home')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-medium items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-primary font-bold text-3xl font-heading">C</span>
            </div>
            <h1 className="text-4xl font-bold font-heading mb-4">
              Welcome to ClinicMind
            </h1>
            <p className="text-xl text-primary-light">
              Your trusted healthcare platform for finding verified hospitals and managing appointments.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm text-primary-light">Verified Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-sm text-primary-light">Expert Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-sm text-primary-light">Happy Patients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-1 font-heading mb-2">
              Welcome Back
            </h1>
            <p className="text-text-2">
              Sign in to your ClinicMind account
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-1 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-text-1 placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-1 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-card text-text-1 placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-3 hover:text-text-1"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-primary-light rounded-lg">
              <p className="text-sm text-primary">
                <strong>Patient Demo Credentials:</strong><br/>
                Email: ramesh@test.com<br/>
                Password: Patient@123
              </p>
              <p className="text-xs text-primary-dark mt-2">
                More patients: sunita@test.com, arjun@test.com
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-text-2">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary hover:text-primary-dark font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-text-3 hover:text-text-2 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
