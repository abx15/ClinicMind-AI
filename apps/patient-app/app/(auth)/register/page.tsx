'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Mail, Lock, User, Phone, Check } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/lib/services/authService'
import { useAuthStore } from '@/stores/authStore'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z
    .string()
    .length(10, 'Phone must be 10 digits')
    .regex(/^\d+$/, 'Only digits allowed'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, 'Terms must be accepted'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const levels = [
      { text: 'Weak', color: 'text-red-500' },
      { text: 'Fair', color: 'text-orange-500' },
      { text: 'Good', color: 'text-yellow-500' },
      { text: 'Strong', color: 'text-green-500' },
    ]
    
    return { strength, ...levels[strength - 1] }
  }

  const passwordStrength = getPasswordStrength(password)

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data)
      toast.success('Registration successful!')
      router.push('/dashboard/home')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed')
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, terms, ...registerData } = data
    registerMutation.mutate({
      ...registerData,
      role: 'patient', // Hardcoded as specified
    })
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
              Join Our Healthcare Community
            </h1>
            <p className="text-primary-100 text-lg mb-8">
              Create your account to access verified hospitals, book appointments instantly, 
              and manage your health records securely.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Quick Appointments</h3>
                <p className="text-primary-200 text-sm">Book appointments with verified doctors in under 30 seconds</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Live Queue Tracking</h3>
                <p className="text-primary-200 text-sm">Real-time updates on your queue status and estimated wait time</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Digital Health Records</h3>
                <p className="text-primary-200 text-sm">Access your prescriptions and medical history anytime, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary font-heading mb-2">
              Create Account
            </h2>
            <p className="text-text-muted">
              Join thousands of patients managing their healthcare better
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="John Doe"
                    className="input-field pl-11"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="9876543210"
                    className="input-field pl-11"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

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
                  placeholder="john@example.com"
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
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Password strength</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength === 1
                          ? 'bg-red-500 w-1/4'
                          : passwordStrength.strength === 2
                          ? 'bg-orange-500 w-2/4'
                          : passwordStrength.strength === 3
                          ? 'bg-yellow-500 w-3/4'
                          : 'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Re-enter your password"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                {...register('terms')}
                className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm text-text-muted">
                I agree to the{' '}
                <a href="#" className="text-primary-500 hover:text-primary-600">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-500 hover:text-primary-600">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full btn-primary flex items-center justify-center"
            >
              {registerMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-text-muted">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
