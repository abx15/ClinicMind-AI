'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/lib/services/authService'

const registerSchema = z.object({
  name:            z.string().min(3, 'Hospital name required'),
  address:         z.string().min(10, 'Full address required'),
  city:            z.string().min(2, 'City required'),
  pincode:         z.string().length(6, 'Enter valid 6-digit pincode'),
  phone:           z.string().length(10, 'Enter 10-digit phone'),
  email:           z.string().email('Valid email required'),
  licenseNumber:   z.string().min(5, 'License number required'),
  description:     z.string().optional(),
  specializations: z.array(z.string()).min(1, 'Select at least one specialization'),
  // Admin account
  adminName:     z.string().min(2, 'Admin name required'),
  adminEmail:    z.string().email('Valid email required'),
  adminPhone:    z.string().length(10, '10-digit phone required'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterForm = z.infer<typeof registerSchema>

const SPECIALIZATIONS = [
  'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 
  'General Medicine', 'Gynecology', 'Neurology', 'Oncology',
  'Psychiatry', 'Radiology', 'Surgery', 'Urology'
]

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const watchedSpecializations = watch('specializations', [])

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      // First register admin account
      const adminResponse = await authService.register({
        name: data.adminName,
        email: data.adminEmail,
        phone: data.adminPhone,
        password: data.adminPassword,
        role: 'hospital_admin',
      })

      // Save token
      login(adminResponse)

      // Then register hospital
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hospitals/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminResponse.token}`,
        },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
          phone: data.phone,
          email: data.email,
          licenseNumber: data.licenseNumber,
          description: data.description,
          specializations: data.specializations,
        }),
      })

      if (!response.ok) throw new Error('Hospital registration failed')
      return response.json()
    },
    onSuccess: () => {
      router.push('/pending')
    },
    onError: (err: any) => {
      setError(err.message || 'Registration failed')
    },
  })

  const handleSpecializationToggle = (spec: string) => {
    const current = watchedSpecializations || []
    if (current.includes(spec)) {
      setValue('specializations', current.filter(s => s !== spec))
    } else {
      setValue('specializations', [...current, spec])
    }
  }

  const onSubmit = (data: RegisterForm) => {
    setError('')
    registerMutation.mutate(data)
  }

  const steps = [
    { title: 'Hospital Info', description: 'Basic details about your hospital' },
    { title: 'Contact & License', description: 'Verification information' },
    { title: 'Admin Account', description: 'Create admin credentials' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F6E56] to-[#094D3C] p-12 flex-col justify-between">
        <div>
          <div className="text-white">
            <h1 className="font-syne font-bold text-3xl mb-2">ClinicMind</h1>
            <p className="text-white/80 text-sm">Join 500+ hospitals transforming healthcare</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-white">
            <h2 className="font-syne font-bold text-2xl mb-6">Why Choose ClinicMind?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI-Powered Queue Management</h3>
                  <p className="text-sm text-white/80">Reduce patient wait times by 60%</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Voice Prescriptions</h3>
                  <p className="text-sm text-white/80">AI-assisted prescription writing</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                  <p className="text-sm text-white/80">Track performance and patient satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-white/60 text-sm">
          <p>Already registered?{' '}
            <Link href="/login" className="text-white font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel - Registration form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Step indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      index + 1 === currentStep
                        ? 'bg-[#0F6E56] text-white'
                        : index + 1 < currentStep
                        ? 'bg-[#0F6E56] text-white'
                        : 'bg-[#E2E8E4] text-[#8A9E98]'
                    }`}
                  >
                    {index + 1 < currentStep ? '✓' : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors ${
                        index + 1 < currentStep ? 'bg-[#0F6E56]' : 'bg-[#E2E8E4]'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="font-syne font-bold text-xl text-[#1A2420] mb-1">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-sm text-[#8A9E98]">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#FCEBEB] border border-[#A32D2D] rounded-lg">
              <p className="text-sm text-[#A32D2D]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Hospital Info */}
            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Hospital Name <span className="text-[#A32D2D]">*</span>
                  </label>
                  <input
                    {...register('name')}
                    className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                    placeholder="Enter hospital name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-[#A32D2D]">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Full Address <span className="text-[#A32D2D]">*</span>
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-[#A32D2D]">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A2420] mb-2">
                      City <span className="text-[#A32D2D]">*</span>
                    </label>
                    <input
                      {...register('city')}
                      className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                               text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                               focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-[#A32D2D]">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A2420] mb-2">
                      Pincode <span className="text-[#A32D2D]">*</span>
                    </label>
                    <input
                      {...register('pincode')}
                      className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                               text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                               focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                      placeholder="6-digit"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-xs text-[#A32D2D]">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Contact & License */}
            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A2420] mb-2">
                      Hospital Phone <span className="text-[#A32D2D]">*</span>
                    </label>
                    <input
                      {...register('phone')}
                      className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                               text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                               focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                      placeholder="10-digit phone"
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-[#A32D2D]">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A2420] mb-2">
                      Hospital Email <span className="text-[#A32D2D]">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                               text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                               focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                      placeholder="hospital@domain.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-[#A32D2D]">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    License Number <span className="text-[#A32D2D]">*</span>
                  </label>
                  <input
                    {...register('licenseNumber')}
                    className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                    placeholder="Hospital license number"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-xs text-[#A32D2D]">{errors.licenseNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Specializations <span className="text-[#A32D2D]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SPECIALIZATIONS.map((spec) => (
                      <label
                        key={spec}
                        className="flex items-center gap-2 p-2 border border-[#E2E8E4] rounded-lg cursor-pointer
                                 hover:bg-[#F4F6F4] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={watchedSpecializations.includes(spec)}
                          onChange={() => handleSpecializationToggle(spec)}
                          className="text-[#0F6E56]"
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specializations && (
                    <p className="mt-1 text-xs text-[#A32D2D]">{errors.specializations.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                    placeholder="Brief description of your hospital"
                  />
                </div>
              </>
            )}

            {/* Step 3: Admin Account */}
            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Admin Name <span className="text-[#A32D2D]">*</span>
                  </label>
                  <input
                    {...register('adminName')}
                    className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                    placeholder="Full name of hospital administrator"
                  />
                  {errors.adminName && (
                    <p className="mt-1 text-xs text-[#A32D2D]">{errors.adminName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Admin Email <span className="text-[#A32D2D]">*</span>
                  </label>
                  <input
                    {...register('adminEmail')}
                    type="email"
                    className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                    placeholder="admin@hospital.com"
                  />
                  {errors.adminEmail && (
                    <p className="mt-1 text-xs text-[#A32D2D]">{errors.adminEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Admin Phone <span className="text-[#A32D2D]">*</span>
                  </label>
                  <input
                    {...register('adminPhone')}
                    className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                    placeholder="10-digit phone"
                    maxLength={10}
                  />
                  {errors.adminPhone && (
                    <p className="mt-1 text-xs text-[#A32D2D]">{errors.adminPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Admin Password <span className="text-[#A32D2D]">*</span>
                  </label>
                  <input
                    {...register('adminPassword')}
                    type="password"
                    className="w-full border border-[#E2E8E4] rounded-lg px-4 py-3 text-sm
                             text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                             focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/20"
                    placeholder="Create a strong password"
                  />
                  {errors.adminPassword && (
                    <p className="mt-1 text-xs text-[#A32D2D]">{errors.adminPassword.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 border border-[#E2E8E4] text-[#1A2420] rounded-lg font-semibold
                           hover:bg-[#F4F6F4] transition-colors"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 bg-[#0F6E56] text-white py-3 rounded-lg font-semibold
                           hover:bg-[#094D3C] transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="flex-1 bg-[#0F6E56] text-white py-3 rounded-lg font-semibold
                           hover:bg-[#094D3C] transition-colors disabled:opacity-50
                           disabled:cursor-not-allowed"
                >
                  {registerMutation.isPending ? 'Registering...' : 'Register Hospital'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
