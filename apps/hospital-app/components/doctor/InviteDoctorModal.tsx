'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const inviteSchema = z.object({
  name:            z.string().min(2, 'Name required'),
  email:           z.string().email('Valid email required'),
  phone:           z.string().length(10, '10-digit phone required'),
  specialization:  z.string().min(1, 'Specialization required'),
  qualifications:  z.string().min(2, 'e.g. MBBS, MD'),
  experience:      z.coerce.number().min(0).max(50),
})

type InviteForm = z.infer<typeof inviteSchema>

const SPECIALIZATIONS = [
  'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 
  'General Medicine', 'Gynecology', 'Neurology', 'Oncology',
  'Psychiatry', 'Radiology', 'Surgery', 'Urology'
]

interface InviteDoctorModalProps {
  isOpen:     boolean
  onClose:    () => void
  hospitalId: string
}

export default function InviteDoctorModal({
  isOpen, onClose, hospitalId
}: InviteDoctorModalProps) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { experience: 0 },
  })

  const inviteMutation = useMutation({
    mutationFn: async (data: InviteForm) => {
      // Mock API call - replace with actual implementation
      console.log('Inviting doctor:', { ...data, hospitalId })
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      return { success: true }
    },
    onSuccess: () => {
      alert('Invitation sent! Doctor will receive a setup link.')
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      reset()
      onClose()
    },
    onError: () => {
      alert('Failed to send invitation')
    },
  })

  const onSubmit = (data: InviteForm) => {
    inviteMutation.mutate(data)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-[#E2E8E4] w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8E4]">
          <div className="flex items-center justify-between">
            <h2 className="font-syne font-bold text-xl text-[#1A2420]">Invite New Doctor</h2>
            <button
              onClick={onClose}
              className="text-[#8A9E98] hover:text-[#4A5E58] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit((d) => inviteMutation.mutateAsync(d))} className="p-6 space-y-4">
          {/* Name + Phone row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
                Full name <span className="text-[#A32D2D]">*</span>
              </label>
              <input
                {...register('name')}
                className="input-field"
                placeholder="Dr. Priya Sharma"
              />
              {errors.name && (
                <p className="text-xs text-[#A32D2D] mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
                Phone <span className="text-[#A32D2D]">*</span>
              </label>
              <input
                {...register('phone')}
                className="input-field"
                placeholder="9000000001"
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-xs text-[#A32D2D] mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
              Email address <span className="text-[#A32D2D]">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              className="input-field"
              placeholder="doctor@hospital.com"
            />
            {errors.email && (
              <p className="text-xs text-[#A32D2D] mt-1">{errors.email.message}</p>
            )}
            <p className="text-xs text-[#8A9E98] mt-1">Invite link will be sent here</p>
          </div>

          {/* Specialization */}
          <div>
            <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
              Specialization <span className="text-[#A32D2D]">*</span>
            </label>
            <select
              {...register('specialization')}
              className="input-field"
            >
              <option value="">Select specialization</option>
              {SPECIALIZATIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.specialization && (
              <p className="text-xs text-[#A32D2D] mt-1">{errors.specialization.message}</p>
            )}
          </div>

          {/* Qualifications + Experience row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
                Qualifications
              </label>
              <input
                {...register('qualifications')}
                className="input-field"
                placeholder="MBBS, MD (Cardiology)"
              />
              {errors.qualifications && (
                <p className="text-xs text-[#A32D2D] mt-1">{errors.qualifications.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
                Experience (years)
              </label>
              <input
                {...register('experience')}
                type="number"
                className="input-field"
                placeholder="5"
                min="0"
                max="50"
              />
              {errors.experience && (
                <p className="text-xs text-[#A32D2D] mt-1">{errors.experience.message}</p>
              )}
            </div>
          </div>

          {/* Info box */}
          <div className="bg-[#E6F1FB] rounded-xl px-4 py-3 text-sm text-[#1D63B5]">
            Doctor will receive an email/WhatsApp with a setup link valid for 48 hours.
            They can complete their profile and set a password using that link.
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-[#E2E8E4] text-[#1A2420] rounded-lg text-sm font-semibold hover:bg-[#F4F6F4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteMutation.isPending}
              className="flex-1 py-2 bg-[#0F6E56] text-white rounded-lg text-sm font-semibold hover:bg-[#094D3C] disabled:opacity-50 transition-colors"
            >
              {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
