'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserIcon, CalendarIcon, PhoneIcon, MailIcon, UserCircleIcon, SaveIcon, CameraIcon, XIcon } from '@/components/icons'
import { toast } from 'sonner'
import { useUser, useAuthStore } from '@/stores/authStore'
import { authService } from '@/lib/services/authService'
import { useAuth } from '@/hooks/useAuth'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().length(10, 'Phone must be 10 digits').regex(/^\d+$/, 'Only digits allowed'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  bloodGroup: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    phone: z.string().length(10, 'Phone must be 10 digits').regex(/^\d+$/, 'Only digits allowed'),
    relation: z.string().optional(),
  }).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const user = useUser()
  const { updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: (user as any)?.phone || '',
      dateOfBirth: (user as any)?.dateOfBirth ? new Date((user as any).dateOfBirth).toISOString().split('T')[0] : '',
      gender: (user as any)?.gender || undefined,
      bloodGroup: (user as any)?.bloodGroup || '',
      allergies: (user as any)?.allergies || [],
      emergencyContact: (user as any)?.emergencyContact || {
        name: '',
        phone: '',
        relation: '',
      },
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data)
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  const bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'
  ]

  const commonAllergies = [
    'Penicillin',
    'Aspirin',
    'Ibuprofen',
    'Paracetamol',
    'Sulfa drugs',
    'Eggs',
    'Milk',
    'Shellfish',
    'Nuts',
    'Wheat',
    'Soy',
    'Latex',
    'Dust',
    'Pollen',
    'Pet dander'
  ]

  const relations = [
    'Father',
    'Mother',
    'Spouse',
    'Sibling',
    'Child',
    'Guardian',
    'Friend',
    'Other'
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Profile Settings
          </h1>
          <p className="text-text-muted">
            Manage your personal and medical information
          </p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserCircleIcon className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-border">
            <div className="relative">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-24 h-24 text-primary-500" />
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label className="cursor-pointer bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:border-primary-500">
                    <CameraIcon className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div>
                <h3 className="text-xl font-semibold text-text-primary font-heading">
                  {user?.name || 'John Doe'}
                </h3>
                <p className="text-text-muted">
                  {user?.email || 'john@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Enter your full name"
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  disabled={!isEditing}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter your 10-digit phone number"
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                  disabled={!isEditing}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  value={formatDateForInput(watch?.('dateOfBirth'))}
                  onChange={(e) => {
                    setValue('dateOfBirth', e.target.value)
                  }}
                  className={`input-field ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  disabled={!isEditing}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
                  disabled={!isEditing}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Blood Group
                </label>
                <select
                  {...register('bloodGroup')}
                  className={`input-field ${errors.bloodGroup ? 'border-red-500' : ''}`}
                  disabled={!isEditing}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="text-sm text-red-600 mt-1">{errors.bloodGroup.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Allergies
                </label>
                <div className="space-y-2">
                  {commonAllergies.map((allergy) => (
                    <label key={allergy} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={allergy}
                        {...register('allergies')}
                        disabled={!isEditing}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-text-primary">{allergy}</span>
                    </label>
                  ))}
                </div>
                {errors.allergies && (
                  <p className="text-sm text-red-600 mt-1">{errors.allergies.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  {...register('emergencyContact.name')}
                  placeholder="Enter emergency contact name"
                  className={`input-field ${errors.emergencyContact?.name ? 'border-red-500' : ''}`}
                  disabled={!isEditing}
                />
                {errors.emergencyContact?.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.emergencyContact.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  {...register('emergencyContact.phone')}
                  placeholder="Enter emergency contact phone"
                  className={`input-field ${errors.emergencyContact?.phone ? 'border-red-500' : ''}`}
                  disabled={!isEditing}
                />
                {errors.emergencyContact?.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.emergencyContact.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Relation
                </label>
                <select
                  {...register('emergencyContact.relation')}
                  className={`input-field ${errors.emergencyContact?.relation ? 'border-red-500' : ''}`}
                  disabled={!isEditing}
                >
                  <option value="">Select relation</option>
                  {relations.map((relation) => (
                    <option key={relation} value={relation}>{relation}</option>
                  ))}
                </select>
                {errors.emergencyContact?.relation && (
                  <p className="text-sm text-red-600 mt-1">{errors.emergencyContact.relation.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-3 pt-6 border-t border-border">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
