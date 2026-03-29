'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/lib/services/authService'
import { EyeIcon, EyeOffIcon, LoaderIcon } from '@/components/icons'

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      const res = await authService.login(data as { email: string; password: string })

      // Backend returns { success, data: { user, token } }
      const { user, token } = res.data ?? res

      if (user.role !== 'superadmin') {
        setError('Access denied. This portal is for super admins only.')
        setLoading(false)
        return
      }

      setAuth(user, token)

      // Set cookie for middleware
      if (typeof document !== 'undefined') {
        document.cookie = `clinicmind_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      }

      router.push('/dashboard/overview')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Login failed. Check credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B2920] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">

          {/* Dark header */}
          <div className="bg-[#061a12] px-8 py-8 text-center border-b border-white/10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Image
                src="/logo.png"
                alt="ClinicMind"
                width={36}
                height={36}
                className="rounded-xl"
              />
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                ClinicMind
              </span>
            </div>
            <p className="text-sm text-white/50 mb-3">Super Admin Portal</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                             text-xs font-semibold bg-danger-light text-danger">
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
              Restricted Access
            </span>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="font-heading font-bold text-lg text-text-1 mb-6">
              Sign in to continue
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-text-1 block mb-1.5">
                  Email address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@clinicmind.in"
                  {...register('email')}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm
                             text-text-1 placeholder:text-text-3 bg-white outline-none
                             focus:border-primary focus:ring-2 focus:ring-primary/15
                             transition-all"
                />
                {errors.email && (
                  <p className="text-xs text-danger mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-text-1 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••••"
                    {...register('password')}
                    className="w-full border border-border rounded-xl px-3 py-2.5 pr-10
                               text-sm text-text-1 placeholder:text-text-3 bg-white
                               outline-none focus:border-primary focus:ring-2
                               focus:ring-primary/15 transition-all"
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3
                               hover:text-text-2"
                  >
                    {showPass
                      ? <EyeOffIcon size={16} />
                      : <EyeIcon    size={16} />
                    }
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-danger mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-danger-light rounded-xl px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4
                           bg-primary hover:bg-primary-dark text-white font-semibold
                           rounded-xl transition-colors disabled:opacity-60
                           disabled:cursor-not-allowed text-sm mt-2"
              >
                {loading && <LoaderIcon size={16} />}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Dev hint */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-5 p-3 bg-surface rounded-xl border border-border">
                <p className="text-xs font-semibold text-text-2 mb-1">Dev credentials:</p>
                <p className="text-xs text-text-3 font-mono">admin@clinicmind.in</p>
                <p className="text-xs text-text-3 font-mono">Admin@123456</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-white/25 text-xs mt-5">
          ClinicMind AI Platform · v1.0
        </p>
      </div>
    </div>
  )
}
