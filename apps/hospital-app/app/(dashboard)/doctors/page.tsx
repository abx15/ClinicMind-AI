'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRole } from '@/hooks/useRole'
import DoctorTable from '@/components/doctor/DoctorTable'
import InviteDoctorModal from '@/components/doctor/InviteDoctorModal'

// Mock data - replace with actual API calls
const mockDoctors = [
  {
    _id: '1',
    name: 'Dr. Priya Sharma',
    specialization: 'Cardiology',
    experience: 8,
    isVerified: true,
    patientsThisMonth: 45,
    avatar: 'PS',
  },
  {
    _id: '2',
    name: 'Dr. Rahul Kumar',
    specialization: 'Orthopedics',
    experience: 5,
    isVerified: false,
    patientsThisMonth: 32,
    avatar: 'RK',
  },
  {
    _id: '3',
    name: 'Dr. Anjali Patel',
    specialization: 'Pediatrics',
    experience: 12,
    isVerified: false,
    patientsThisMonth: 28,
    avatar: 'AP',
  },
  {
    _id: '4',
    name: 'Dr. Vikram Singh',
    specialization: 'General Medicine',
    experience: 15,
    isVerified: true,
    patientsThisMonth: 67,
    avatar: 'VS',
  },
  {
    _id: '5',
    name: 'Dr. Meera Reddy',
    specialization: 'Dermatology',
    experience: 7,
    isVerified: true,
    patientsThisMonth: 41,
    avatar: 'MR',
  },
  {
    _id: '6',
    name: 'Dr. Amit Bansal',
    specialization: 'Neurology',
    experience: 10,
    isVerified: true,
    patientsThisMonth: 38,
    avatar: 'AB',
  },
]

export default function DoctorsPage() {
  const { hospitalId } = useRole()
  const queryClient = useQueryClient()
  const [showInvite, setShowInvite] = useState(false)
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all')

  // Mock queries - replace with actual API calls
  const { data, isLoading } = useQuery({
    queryKey: ['doctors', hospitalId, filter],
    queryFn: () => Promise.resolve({ data: { doctors: mockDoctors } }),
    enabled: !!hospitalId,
  })

  // Verify doctor mutation
  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Verifying doctor:', id)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      alert('Doctor verified — now visible on patient app')
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    },
    onError: () => alert('Failed to verify doctor'),
  })

  // Unverify mutation
  const unverifyMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Unverifying doctor:', id)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      alert('Doctor verification removed')
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    },
  })

  // Remove doctor mutation
  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Removing doctor:', id)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      if (confirm('Are you sure you want to remove this doctor from the hospital?')) {
        alert('Doctor removed from hospital')
        queryClient.invalidateQueries({ queryKey: ['doctors'] })
      }
    },
  })

  const doctors = data?.data?.doctors || []
  const filtered = filter === 'all'      ? doctors
                 : filter === 'verified'  ? doctors.filter((d: any) => d.isVerified)
                 :                          doctors.filter((d: any) => !d.isVerified)

  return (
    <div className="space-y-5">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-syne font-bold text-xl text-[#1A2420]">
            Medical Team
          </h2>
          <p className="text-sm text-[#8A9E98] mt-0.5">
            {doctors.length} total · {doctors.filter((d: any) => d.isVerified).length} verified
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F6E56] text-white
                     rounded-lg text-sm font-semibold hover:bg-[#094D3C] transition-colors"
        >
          + Invite Doctor
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-[#F4F6F4] rounded-xl w-fit">
        {(['all', 'verified', 'pending'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-white text-[#1A2420] shadow-sm'
                : 'text-[#8A9E98] hover:text-[#4A5E58]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Doctor table or cards */}
      <DoctorTable
        doctors={filtered}
        isLoading={isLoading}
        onVerify={(id) => verifyMutation.mutate(id)}
        onUnverify={(id) => unverifyMutation.mutate(id)}
        onRemove={(id) => removeMutation.mutate(id)}
        isVerifying={verifyMutation.isPending}
      />

      {/* Invite modal */}
      <InviteDoctorModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        hospitalId={hospitalId || ''}
      />
    </div>
  )
}
