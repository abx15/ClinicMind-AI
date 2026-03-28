'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/stores/authStore'
import { useRole } from '@/hooks/useRole'
import { hospitalService } from '@/lib/services/hospitalService'

const settingsSchema = z.object({
  name:            z.string().min(3, 'Hospital name required'),
  address:         z.string().min(10, 'Full address required'),
  city:            z.string().min(2, 'City required'),
  pincode:         z.string().length(6, 'Enter valid 6-digit pincode'),
  phone:           z.string().length(10, 'Enter 10-digit phone'),
  email:           z.string().email('Valid email required'),
  licenseNumber:   z.string().min(5, 'License number required'),
  description:     z.string().optional(),
  specializations: z.array(z.string()).min(1, 'Select at least one specialization'),
})

type SettingsForm = z.infer<typeof settingsSchema>

const SPECIALIZATIONS = [
  'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 
  'General Medicine', 'Gynecology', 'Neurology', 'Oncology',
  'Psychiatry', 'Radiology', 'Surgery', 'Urology'
]

export default function SettingsPage() {
  const user = useUser()
  const { hospitalId } = useRole()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || '',
      address: '123 Main Road, Mumbai',
      city: 'Mumbai',
      pincode: '400001',
      phone: '9000000001',
      email: 'hospital@clinicmind.in',
      licenseNumber: 'MH-2024-1234',
      description: 'Multi-specialty hospital providing comprehensive healthcare services',
      specializations: ['Cardiology', 'Orthopedics', 'Pediatrics'],
    },
  })

  const watchedSpecializations = watch('specializations', [])

  const updateMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      console.log('Updating hospital:', data)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      alert('Hospital profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['hospital'] })
    },
    onError: () => {
      alert('Failed to update hospital profile')
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

  const onSubmit = (data: SettingsForm) => {
    updateMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="font-syne font-bold text-xl text-[#1A2420]">Settings</h2>
        <p className="text-sm text-[#8A9E98] mt-0.5">
          Manage your hospital profile and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F4F6F4] rounded-xl w-fit">
        {(['profile', 'notifications', 'security'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-[#1A2420] shadow-sm'
                : 'text-[#8A9E98] hover:text-[#4A5E58]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hospital info */}
            <div>
              <h3 className="font-semibold text-[#1A2420] mb-4">Hospital Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Hospital Name <span className="text-[#A32D2D]">*</span>
                  </label>
                  <input
                    {...register('name')}
                    className="input-field"
                    placeholder="Enter hospital name"
                  />
                  {errors.name && (
                    <p className="text-xs text-[#A32D2D] mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    Full Address <span className="text-[#A32D2D]">*</span>
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="input-field"
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p className="text-xs text-[#A32D2D] mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A2420] mb-2">
                      City <span className="text-[#A32D2D]">*</span>
                    </label>
                    <input
                      {...register('city')}
                      className="input-field"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-xs text-[#A32D2D] mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A2420] mb-2">
                      Pincode <span className="text-[#A32D2D]">*</span>
                    </label>
                    <input
                      {...register('pincode')}
                      className="input-field"
                      placeholder="6-digit"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-xs text-[#A32D2D] mt-1">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <h3 className="font-semibold text-[#1A2420] mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A2420] mb-2">
                      Hospital Phone <span className="text-[#A32D2D]">*</span>
                    </label>
                    <input
                      {...register('phone')}
                      className="input-field"
                      placeholder="10-digit phone"
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p className="text-xs text-[#A32D2D] mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A2420] mb-2">
                      Hospital Email <span className="text-[#A32D2D]">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="input-field"
                      placeholder="hospital@domain.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-[#A32D2D] mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A2420] mb-2">
                    License Number <span className="text-[#A32D2D]">*</span>
                  </label>
                  <input
                    {...register('licenseNumber')}
                    className="input-field"
                    placeholder="Hospital license number"
                  />
                  {errors.licenseNumber && (
                    <p className="text-xs text-[#A32D2D] mt-1">{errors.licenseNumber.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-[#1A2420] mb-4">Specializations</h3>
              
              <div>
                <label className="block text-sm font-medium text-[#1A2420] mb-2">
                  Available Specializations <span className="text-[#A32D2D]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                  <p className="text-xs text-[#A32D2D] mt-1">{errors.specializations.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A2420] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input-field"
                  placeholder="Brief description of your hospital"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="px-6 py-2 border border-[#E2E8E4] text-[#1A2420] rounded-lg font-semibold
                         hover:bg-[#F4F6F4] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-6 py-2 bg-[#0F6E56] text-white rounded-lg font-semibold
                         hover:bg-[#094D3C] disabled:opacity-50 transition-colors"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
          <h3 className="font-semibold text-[#1A2420] mb-4">Notification Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#E2E8E4]">
              <div>
                <p className="font-medium text-[#1A2420]">New Doctor Registrations</p>
                <p className="text-sm text-[#8A9E98]">Get notified when new doctors register</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F6E56]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#E2E8E4]">
              <div>
                <p className="font-medium text-[#1A2420]">Queue Updates</p>
                <p className="text-sm text-[#8A9E98]">Real-time queue status notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F6E56]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#E2E8E4]">
              <div>
                <p className="font-medium text-[#1A2420]">System Maintenance</p>
                <p className="text-sm text-[#8A9E98]">Important system notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F6E56]"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
          <h3 className="font-semibold text-[#1A2420] mb-4">Security Settings</h3>
          
          <div className="space-y-6">
            <div>
              <p className="font-medium text-[#1A2420] mb-2">Change Password</p>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  className="input-field"
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="input-field"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="input-field"
                />
                <button className="px-4 py-2 bg-[#0F6E56] text-white rounded-lg text-sm font-semibold hover:bg-[#094D3C] transition-colors">
                  Update Password
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2E8E4]">
              <p className="font-medium text-[#1A2420] mb-2">Two-Factor Authentication</p>
              <p className="text-sm text-[#8A9E98] mb-4">Add an extra layer of security to your account</p>
              <button className="px-4 py-2 border border-[#E2E8E4] text-[#1A2420] rounded-lg text-sm font-semibold hover:bg-[#F4F6F4] transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
