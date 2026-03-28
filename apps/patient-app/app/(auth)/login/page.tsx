'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/lib/services/authService'
import { useAuthStore } from '@/stores/authStore'

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard/home'
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data)
      toast.success('Login successful!')
      router.push(redirect)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed')
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="flex flex-col justify-center px-12 py-16">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-500 font-bold text-xl font-heading">C</span>
              </div>
              <span className="text-2xl font-bold font-heading">ClinicMind</span>
            </div>
            
            <h1 className="text-4xl font-bold font-heading mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-primary-100 text-lg mb-8">
              Connect with verified hospitals and doctors. Book appointments in seconds. 
              Manage your health records digitally.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <div className="text-3xl font-bold font-heading mb-2">142+</div>
              <div className="text-primary-200">Verified Hospitals</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-heading mb-2">24K+</div>
              <div className="text-primary-200">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-heading mb-2">1,248</div>
              <div className="text-primary-200">Expert Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-heading mb-2">4.8★</div>
              <div className="text-primary-200">Average Rating</div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span>Instant appointment booking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span>Real-time queue tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
              <span>Digital health records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary font-heading mb-2">
              Welcome Back
            </h2>
            <p className="text-text-muted">
              Sign in to your ClinicMind account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  className="input-field pl-11"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter your password"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loginMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-text-muted">
              Don't have an account?{' '}
              <a
                href="/register"
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
