'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError('')
    try {
      const result = await login(data)
      if (result.user.role !== 'superadmin') {
        setError('This portal is for super admins only')
        return
      }
      router.push('/dashboard/overview')
    } catch (e: any) {
      setError(e.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B2920] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Dark top panel */}
          <div className="bg-[#0B2920] px-8 py-8 text-center">
            <div className="font-syne font-extrabold text-2xl text-white mb-1">
              ClinicMind
            </div>
            <div className="text-sm text-white/50 mb-3">Super Admin Portal</div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                             text-xs font-semibold bg-[#FCEBEB] text-[#A32D2D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A32D2D]" />
              Restricted Access
            </span>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="font-syne font-bold text-lg text-[#1A2420] mb-6">
              Sign in to continue
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
                  Email address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@clinicmind.in"
                  className="w-full px-3 py-2.5 border border-[#E2E8E4] rounded-xl text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/10"
                />
                {errors.email && (
                  <p className="text-xs text-[#A32D2D] mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••••"
                  className="w-full px-3 py-2.5 border border-[#E2E8E4] rounded-xl text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/10"
                />
                {errors.password && (
                  <p className="text-xs text-[#A32D2D] mt-1">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-[#FCEBEB] rounded-xl px-4 py-3 text-sm text-[#A32D2D]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0F6E56] text-white rounded-xl text-sm
                         font-semibold hover:bg-[#094D3C] disabled:opacity-50
                         transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Dev credentials hint */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-3 bg-[#F4F6F4] rounded-xl text-xs text-[#8A9E98]">
                <p className="font-semibold text-[#4A5E58] mb-1">Dev credentials:</p>
                <p>admin@clinicmind.in</p>
                <p>Admin@123456</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          ClinicMind AI Platform · Admin v1.0
        </p>
      </div>
    </div>
  )
}
