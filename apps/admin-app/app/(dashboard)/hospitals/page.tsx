'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'
import HospitalApprovalCard from '@/components/hospital/HospitalApprovalCard'
import HospitalTable from '@/components/hospital/HospitalTable'
import ApproveRejectModal from '@/components/hospital/ApproveRejectModal'
import { cn } from '@clinicmind/ui'

type StatusFilter = 'all' | 'pending' | 'verified' | 'rejected' | 'suspended'

export default function AdminHospitalsPage() {
  const queryClient    = useQueryClient()
  const [status, setStatus]       = useState<StatusFilter>('pending')
  const [search, setSearch]       = useState('')
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean; hospitalId: string; hospitalName: string
  }>({ isOpen: false, hospitalId: '', hospitalName: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'hospitals', status, search],
    queryFn:  () => adminService.getAllHospitals({
      status: status === 'all' ? undefined : status,
      search: search || undefined,
    }),
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveHospital(id),
    onSuccess: (_, id) => {
      console.log('Hospital approved')
      queryClient.invalidateQueries({ queryKey: ['admin', 'hospitals'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
    onError: () => console.error('Failed to approve hospital'),
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectHospital(id, reason),
    onSuccess: () => {
      console.log('Hospital rejected')
      queryClient.invalidateQueries({ queryKey: ['admin', 'hospitals'] })
      setRejectModal({ isOpen: false, hospitalId: '', hospitalName: '' })
    },
    onError: () => console.error('Failed to reject hospital'),
  })

  const hospitals = data?.data?.hospitals || []
  const total     = data?.data?.total || 0

  const filterTabs: { label: string; value: StatusFilter; color?: string }[] = [
    { label: 'Pending',   value: 'pending',   color: '#B86E0A' },
    { label: 'Verified',  value: 'verified',  color: '#0F6E56' },
    { label: 'All',       value: 'all' },
    { label: 'Rejected',  value: 'rejected',  color: '#A32D2D' },
    { label: 'Suspended', value: 'suspended', color: '#534AB7' },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-syne font-bold text-xl text-[#1A2420]">
            Hospital Management
          </h2>
          <p className="text-sm text-[#8A9E98] mt-0.5">
            {total} hospitals · {status} view
          </p>
        </div>
        {/* Search input */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospitals..."
            className="w-64 pl-9 pr-4 py-2 border border-[#E2E8E4] rounded-xl text-sm
                       text-[#1A2420] placeholder:text-[#8A9E98] bg-white outline-none
                       focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/10"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-[#8A9E98]"
               viewBox="0 0 16 16" fill="currentColor">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor"
                    strokeWidth="1.5" fill="none"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1.5">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              status === tab.value
                ? 'bg-[#0F6E56] text-white'
                : 'bg-white border border-[#E2E8E4] text-[#8A9E98] hover:text-[#4A5E58]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pending view — card list */}
      {status === 'pending' ? (
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-[#E2E8E4]
                                     animate-pulse" />
            ))
          ) : hospitals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8E4] p-16 text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-[#1A2420]">
                No pending approvals
              </p>
              <p className="text-sm text-[#8A9E98] mt-1">
                All hospital registrations have been reviewed
              </p>
            </div>
          ) : (
            hospitals.map((hospital: any) => (
              <HospitalApprovalCard
                key={hospital._id}
                hospital={hospital}
                onApprove={() => approveMutation.mutate(hospital._id)}
                onReject={() => setRejectModal({
                  isOpen:       true,
                  hospitalId:   hospital._id,
                  hospitalName: hospital.name,
                })}
                isApproving={approveMutation.isPending}
              />
            ))
          )}
        </div>
      ) : (
        // Other statuses — table view
        <HospitalTable
          hospitals={hospitals}
          isLoading={isLoading}
          onApprove={(id) => approveMutation.mutate(id)}
          onReject={(id, name) => setRejectModal({ isOpen: true, hospitalId: id, hospitalName: name })}
        />
      )}

      {/* Reject Modal */}
      <ApproveRejectModal
        isOpen={rejectModal.isOpen}
        hospitalName={rejectModal.hospitalName}
        onClose={() => setRejectModal({ isOpen: false, hospitalId: '', hospitalName: '' })}
        onConfirm={(reason) => rejectMutation.mutate({
          id: rejectModal.hospitalId, reason
        })}
        isLoading={rejectMutation.isPending}
      />
    </div>
  )
}
