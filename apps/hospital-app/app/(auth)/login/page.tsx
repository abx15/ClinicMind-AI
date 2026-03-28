'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { useRole } from '@/hooks/useRole'
import { authService } from '@/lib/services/authService'

const loginSchema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { role, isVerified } = useRole()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data)
      // Role-based redirect
      if (role === 'hospital_admin') {
        router.push('/dashboard/overview')
      } else if (role === 'doctor' && isVerified) {
        router.push('/dashboard/doctor/queue')
      } else if (role === 'doctor' && !isVerified) {
        router.push('/dashboard/doctor/pending')
      } else if (role === 'staff') {
        router.push('/dashboard/staff/queue')
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Login failed')
    },
  })

  const onSubmit = (data: LoginForm) => {
    setError('')
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F6E56] to-[#094D3C] p-12 flex-col justify-between">
        <div>
          <div className="text-white">
            <h1 className="font-syne font-bold text-3xl mb-2">ClinicMind</h1>
            <p className="text-white/80 text-sm">Hospital Management Portal</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-white">
            <h2 className="font-syne font-bold text-2xl mb-6">Three Roles, One Platform</h2>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    🏥
                  </div>
                  <h3 className="font-semibold">Hospital Admin</h3>
                </div>
                <p className="text-sm text-white/80">Manage doctors, staff, appointments, and analytics</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    👨‍⚕️
                  </div>
                  <h3 className="font-semibold">Doctor</h3>
                </div>
                <p className="text-sm text-white/80">Live queue management, patient records, AI prescriptions</p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    👩‍💼
                  </div>
                  <h3 className="font-semibold">Staff</h3>
                </div>
                <p className="text-sm text-white/80">Patient registration, queue management, appointments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-white/60 text-sm">
          <p>© 2024 ClinicMind. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-syne font-bold text-3xl text-[#1A2420] mb-2">Welcome Back</h1>
            <p className="text-[#8A9E98]">Sign in to your ClinicMind account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#FCEBEB] border border-[#A32D2D] rounded-lg">
              <p className="text-sm text-[#A32D2D]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1A2420] mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                         text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                         focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[#A32D2D]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2420] mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                         text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                         focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-[#A32D2D]">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#0F6E56] text-white py-3 rounded-lg font-semibold
                       hover:bg-[#094D3C] transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#8A9E98]">
              New hospital?{' '}
              <Link href="/register" className="text-[#0F6E56] font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
