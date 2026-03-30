'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/common/Toast'
import ApproveRejectModal from '@/components/hospital/ApproveRejectModal'

type StatusFilter = 'all' | 'pending' | 'verified' | 'rejected' | 'suspended'

export default function AdminHospitalsPage() {
  const queryClient = useQueryClient()
  const { toast, toasts, removeToast } = useToast()

  const [status, setStatus]   = useState<StatusFilter>('pending')
  const [search, setSearch]   = useState('')
  const [suspendModal, setSuspendModal] = useState<{
    isOpen: boolean; hospitalId: string; hospitalName: string
  }>({ isOpen: false, hospitalId: '', hospitalName: '' })
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean; hospitalId: string; hospitalName: string
  }>({ isOpen: false, hospitalId: '', hospitalName: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'hospitals', status, search],
    queryFn:  () => adminService.getAllHospitals({
      status: status === 'all' ? undefined : status,
      search: search || undefined,
      limit:  50,
    }),
  })

  const hospitals: any[] = data?.data?.data?.hospitals ?? []
  const total:    number = data?.data?.data?.total ?? 0

  // Approve
  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveHospital(id),
    onSuccess: () => {
      toast.success('Hospital approved successfully')
      queryClient.invalidateQueries({ queryKey: ['admin', 'hospitals'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error || 'Failed to approve hospital'),
  })

  // Reject
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminService.rejectHospital(id, reason),
    onSuccess: () => {
      toast.success('Hospital rejected')
      queryClient.invalidateQueries({ queryKey: ['admin', 'hospitals'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      setRejectModal({ isOpen: false, hospitalId: '', hospitalName: '' })
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error || 'Failed to reject hospital'),
  })

  // Suspend
  const suspendMutation = useMutation({
    mutationFn: (id: string) => adminService.suspendHospital(id),
    onSuccess: () => {
      toast.success('Hospital suspended')
      queryClient.invalidateQueries({ queryKey: ['admin', 'hospitals'] })
      setSuspendModal({ isOpen: false, hospitalId: '', hospitalName: '' })
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error || 'Failed to suspend hospital'),
  })

  // Reactivate
  const reactivateMutation = useMutation({
    mutationFn: (id: string) => adminService.reactivateHospital(id),
    onSuccess: () => {
      toast.success('Hospital reactivated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'hospitals'] })
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error || 'Failed to reactivate hospital'),
  })

  const filterTabs: { label: string; value: StatusFilter }[] = [
    { label: 'Pending',   value: 'pending'   },
    { label: 'Verified',  value: 'verified'  },
    { label: 'All',       value: 'all'        },
    { label: 'Rejected',  value: 'rejected'  },
    { label: 'Suspended', value: 'suspended' },
  ]

  const statusBadge = (s: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      verified:  { bg: '#E1F5EE', text: '#0F6E56' },
      pending:   { bg: '#FEF3E2', text: '#B86E0A' },
      rejected:  { bg: '#FCEBEB', text: '#A32D2D' },
      suspended: { bg: '#EEEDFE', text: '#534AB7' },
    }
    const c = map[s] || map.pending
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
            style={{ background: c.bg, color: c.text }}>
        {s}
      </span>
    )
  }

  const planBadge = (p: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      free:   { bg: '#F4F6F4', text: '#4A5E58' },
      pro:    { bg: '#E1F5EE', text: '#0F6E56' },
      growth: { bg: '#FEF3E2', text: '#B86E0A' },
    }
    const c = map[p] || map.free
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
            style={{ background: c.bg, color: c.text }}>
        {p || 'free'}
      </span>
    )
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-syne font-bold text-xl text-[#1A2420]">
              Hospital Management
            </h2>
            <p className="text-sm text-[#8A9E98] mt-0.5">
              {isLoading ? '...' : `${total} hospitals`} · {status} view
            </p>
          </div>
          {/* Search */}
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
              className={[
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                status === tab.value
                  ? 'bg-[#0F6E56] text-white'
                  : 'bg-white border border-[#E2E8E4] text-[#8A9E98] hover:text-[#4A5E58]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-[#F4F6F4] animate-pulse border-b border-[#E2E8E4]" />
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8E4] p-16 text-center">
            <div className="text-4xl mb-3">🏥</div>
            <p className="font-semibold text-[#1A2420]">No hospitals found</p>
            <p className="text-sm text-[#8A9E98] mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F4F6F4] border-b border-[#E2E8E4]">
                  {['Hospital', 'Location', 'Admin Email', 'Status', 'Plan', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold
                                          text-[#4A5E58] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E4]">
                {hospitals.map((hospital: any) => (
                  <tr key={hospital._id} className="hover:bg-[#F8FAF9] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E1F5EE] flex items-center justify-center
                                        font-syne font-extrabold text-sm text-[#0F6E56] flex-shrink-0">
                          {hospital.name?.charAt(0) || 'H'}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#1A2420]">
                            {hospital.name}
                          </div>
                          <div className="text-xs text-[#8A9E98]">
                            {hospital.licenseNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4A5E58]">
                      {hospital.city}, {hospital.pincode}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-[#4A5E58]">
                        {(hospital.adminUserId as any)?.email || hospital.adminEmail || 'N/A'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {statusBadge(hospital.status)}
                    </td>
                    <td className="px-5 py-4">
                      {planBadge(hospital.plan)}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#8A9E98]">
                      {new Date(hospital.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {hospital.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveMutation.mutate(hospital._id)}
                              disabled={approveMutation.isPending}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg
                                         bg-[#E1F5EE] text-[#0F6E56]
                                         hover:bg-[#0F6E56] hover:text-white
                                         disabled:opacity-50 transition-all"
                            >
                              {approveMutation.isPending ? '...' : '✓ Approve'}
                            </button>
                            <button
                              onClick={() => setRejectModal({ isOpen: true, hospitalId: hospital._id, hospitalName: hospital.name })}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg
                                         bg-[#FCEBEB] text-[#A32D2D]
                                         hover:bg-[#A32D2D] hover:text-white transition-all"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        {hospital.status === 'verified' && (
                          <button
                            onClick={() => setSuspendModal({ isOpen: true, hospitalId: hospital._id, hospitalName: hospital.name })}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg
                                       bg-[#EEEDFE] text-[#534AB7]
                                       hover:bg-[#534AB7] hover:text-white transition-all"
                          >
                            Suspend
                          </button>
                        )}
                        {hospital.status === 'suspended' && (
                          <button
                            onClick={() => reactivateMutation.mutate(hospital._id)}
                            disabled={reactivateMutation.isPending}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg
                                       bg-[#E1F5EE] text-[#0F6E56]
                                       hover:bg-[#0F6E56] hover:text-white
                                       disabled:opacity-50 transition-all"
                          >
                            {reactivateMutation.isPending ? '...' : '↩ Reactivate'}
                          </button>
                        )}
                        <a
                          href={`/dashboard/hospitals/${hospital._id}`}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg
                                     bg-[#F4F6F4] text-[#4A5E58] hover:bg-[#E2E8E4] transition-all"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <ApproveRejectModal
        isOpen={rejectModal.isOpen}
        hospitalName={rejectModal.hospitalName}
        onClose={() => setRejectModal({ isOpen: false, hospitalId: '', hospitalName: '' })}
        onConfirm={(reason) => rejectMutation.mutate({ id: rejectModal.hospitalId, reason })}
        isLoading={rejectMutation.isPending}
      />

      {/* Suspend Confirmation Modal */}
      {suspendModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h2 className="font-syne font-bold text-lg text-[#1A2420] mb-2">
              Suspend Hospital
            </h2>
            <p className="text-sm text-[#8A9E98] mb-6">
              Are you sure you want to suspend{' '}
              <span className="font-semibold text-[#1A2420]">{suspendModal.hospitalName}</span>?
              This will prevent hospital staff from accessing the system.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSuspendModal({ isOpen: false, hospitalId: '', hospitalName: '' })}
                disabled={suspendMutation.isPending}
                className="flex-1 px-4 py-2.5 border border-[#E2E8E4] rounded-xl text-sm
                           font-medium text-[#8A9E98] hover:text-[#4A5E58] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => suspendMutation.mutate(suspendModal.hospitalId)}
                disabled={suspendMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-[#534AB7] text-white rounded-xl text-sm
                           font-semibold hover:bg-[#3D359A] disabled:opacity-50 transition-colors"
              >
                {suspendMutation.isPending ? 'Suspending...' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
