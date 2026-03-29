'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { apiClient } from '@/lib/apiClient'
import { LoaderIcon, CheckIcon, EyeIcon, EyeOffIcon } from '@/components/icons'

const schema = z.object({
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Need one uppercase letter')
    .regex(/[0-9]/, 'Need one number'),
  confirmPassword: z.string(),
  bio:             z.string().optional(),
  experience:      z.coerce.number().min(0).max(60),
  consultationFee: z.coerce.number().min(0),
  qualifications:  z.string().min(2, 'e.g. MBBS, MD'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>
type Step = 'loading' | 'invalid' | 'form' | 'success'

function DoctorSetupContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const token        = searchParams.get('token')
  const [step,       setStep]       = useState<Step>('loading')
  const [doctorInfo, setDoctorInfo] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showPass,   setShowPass]   = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { experience: 0, consultationFee: 500 },
  })

  useEffect(() => {
    if (!token) { setStep('invalid'); return }
    apiClient.get(`/doctors/verify-invite?token=${token}`)
      .then((res) => {
        setDoctorInfo(res.data?.data?.doctor)
        setStep('form')
      })
      .catch(() => setStep('invalid'))
  }, [token])

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      await apiClient.post(`/doctors/setup?token=${token}`, {
        password:        data.password,
        bio:             data.bio || '',
        experience:      data.experience,
        consultationFee: data.consultationFee,
        qualifications:  data.qualifications.split(',').map((q) => q.trim()),
      })
      setStep('success')
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Setup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon size={32} className="text-primary mx-auto mb-3" />
          <p className="text-text-2 text-sm">Verifying your invite link...</p>
        </div>
      </div>
    )
  }

  if (step === 'invalid') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border p-10 max-w-md
                        w-full text-center shadow-card">
          <div className="w-16 h-16 rounded-full bg-danger-light flex items-center
                          justify-center mx-auto mb-5 text-3xl">
            ⚠️
          </div>
          <h2 className="font-heading font-bold text-xl text-text-1 mb-2">
            Invalid or Expired Link
          </h2>
          <p className="text-sm text-text-3 leading-relaxed">
            This invitation link is invalid or has expired (valid for 48 hours).
            Please ask your hospital admin to send a new invite.
          </p>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border p-10 max-w-md
                        w-full text-center shadow-card">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center
                          justify-center mx-auto mb-5">
            <CheckIcon size={28} className="text-primary" />
          </div>
          <h2 className="font-heading font-bold text-xl text-text-1 mb-2">
            Profile Setup Complete!
          </h2>
          <p className="text-sm text-text-3 mb-4">
            Your account is ready. Redirecting to login...
          </p>
          <p className="text-xs text-text-3">
            You can log in once your hospital admin verifies your account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="ClinicMind"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="font-heading font-extrabold text-xl text-primary">
              ClinicMind
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-text-1 mb-1">
            Complete Your Profile
          </h1>
          <p className="text-sm text-text-3">
            Welcome, {doctorInfo?.name || 'Doctor'}! Set up your account below.
          </p>
        </div>

        {/* Doctor info card */}
        {doctorInfo && (
          <div className="bg-primary-light rounded-2xl px-5 py-4 mb-6
                          border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center
                              justify-center text-white font-bold text-sm">
                {doctorInfo.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm text-text-1">{doctorInfo.name}</p>
                <p className="text-xs text-text-2">
                  {doctorInfo.specialization} · {doctorInfo.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Password */}
            <div>
              <label className="text-sm font-medium text-text-1 block mb-1.5">
                Set Password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  id="setup-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  {...register('password')}
                  className="w-full border border-border rounded-xl px-3 py-2.5 pr-10
                             text-sm outline-none focus:border-primary
                             focus:ring-2 focus:ring-primary/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-2"
                >
                  {showPass ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-text-1 block mb-1.5">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <input
                id="setup-confirm-password"
                type="password"
                placeholder="Repeat password"
                {...register('confirmPassword')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm
                           outline-none focus:border-primary focus:ring-2
                           focus:ring-primary/15 transition-all"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Qualifications */}
            <div>
              <label className="text-sm font-medium text-text-1 block mb-1.5">
                Qualifications <span className="text-danger">*</span>
              </label>
              <input
                id="setup-qualifications"
                type="text"
                placeholder="e.g. MBBS, MD (Cardiology), DM"
                {...register('qualifications')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm
                           outline-none focus:border-primary focus:ring-2
                           focus:ring-primary/15 transition-all"
              />
              {errors.qualifications && (
                <p className="text-xs text-danger mt-1">{errors.qualifications.message}</p>
              )}
            </div>

            {/* Experience + Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text-1 block mb-1.5">
                  Experience (years)
                </label>
                <input
                  id="setup-experience"
                  type="number"
                  min={0}
                  {...register('experience')}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm
                             outline-none focus:border-primary focus:ring-2
                             focus:ring-primary/15 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-1 block mb-1.5">
                  Consultation Fee (₹)
                </label>
                <input
                  id="setup-fee"
                  type="number"
                  min={0}
                  {...register('consultationFee')}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm
                             outline-none focus:border-primary focus:ring-2
                             focus:ring-primary/15 transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium text-text-1 block mb-1.5">
                Bio <span className="text-text-3">(optional)</span>
              </label>
              <textarea
                id="setup-bio"
                rows={3}
                placeholder="Brief description of your expertise and experience..."
                {...register('bio')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm
                           outline-none focus:border-primary focus:ring-2
                           focus:ring-primary/15 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              id="setup-submit"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4
                         bg-primary hover:bg-primary-dark text-white font-semibold
                         rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {submitting && <LoaderIcon size={16} />}
              {submitting ? 'Setting up...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function DoctorSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoaderIcon size={32} className="text-primary" />
      </div>
    }>
      <DoctorSetupContent />
    </Suspense>
  )
}
