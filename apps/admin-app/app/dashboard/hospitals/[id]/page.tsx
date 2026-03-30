'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/common/Toast'
import ApproveRejectModal from '@/components/hospital/ApproveRejectModal'

export default function HospitalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const queryClient = useQueryClient()
  const { toast, toasts, removeToast } = useToast()

  const [rejectModal, setRejectModal] = useState(false)
  const [suspendModal, setSuspendModal] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'hospital', id],
    queryFn:  () => adminService.getHospitalById(id),
    enabled:  !!id,
  })

  const payload = data?.data?.data
  const hospital: any = payload?.hospital
  const doctors:  any[] = payload?.doctors ?? []

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'hospital', id] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'hospitals'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
  }

  const approveMutation = useMutation({
    mutationFn: () => adminService.approveHospital(id),
    onSuccess: () => { toast.success('Hospital approved'); invalidate() },
    onError: (e: any) => toast.error(e?.response?.data?.error || 'Failed to approve'),
  })

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => adminService.rejectHospital(id, reason),
    onSuccess: () => { toast.success('Hospital rejected'); setRejectModal(false); invalidate() },
    onError: (e: any) => toast.error(e?.response?.data?.error || 'Failed to reject'),
  })

  const suspendMutation = useMutation({
    mutationFn: () => adminService.suspendHospital(id),
    onSuccess: () => { toast.success('Hospital suspended'); setSuspendModal(false); invalidate() },
    onError: (e: any) => toast.error(e?.response?.data?.error || 'Failed to suspend'),
  })

  const reactivateMutation = useMutation({
    mutationFn: () => adminService.reactivateHospital(id),
    onSuccess: () => { toast.success('Hospital reactivated'); invalidate() },
    onError: (e: any) => toast.error(e?.response?.data?.error || 'Failed to reactivate'),
  })

  const planMutation = useMutation({
    mutationFn: (plan: string) => adminService.updateHospitalPlan(id, plan as any),
    onSuccess: (_, plan) => { toast.success(`Plan updated to ${plan}`); invalidate() },
    onError: (e: any) => toast.error(e?.response?.data?.error || 'Failed to update plan'),
  })

  if (isLoading) return <LoadingSkeleton />

  if (isError || !hospital) {
    return (
      <div className="bg-white rounded-2xl border border-[#FCEBEB] p-12 text-center">
        <div className="text-4xl mb-3">❌</div>
        <p className="font-semibold text-[#A32D2D]">Hospital not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-[#0F6E56] underline"
        >
          Go back
        </button>
      </div>
    )
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    verified:  { bg: '#E1F5EE', text: '#0F6E56' },
    pending:   { bg: '#FEF3E2', text: '#B86E0A' },
    rejected:  { bg: '#FCEBEB', text: '#A32D2D' },
    suspended: { bg: '#EEEDFE', text: '#534AB7' },
  }
  const sc = statusColors[hospital.status] || statusColors.pending
  const admin = hospital.adminUserId || {}

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="space-y-5">
        {/* Back + Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-[#8A9E98] hover:text-[#0F6E56] transition-colors mb-3"
          >
            ← Back to Hospitals
          </button>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E1F5EE] flex items-center justify-center
                              font-syne font-extrabold text-2xl text-[#0F6E56]">
                {hospital.name?.charAt(0) || 'H'}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-syne font-bold text-2xl text-[#1A2420]">
                    {hospital.name}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                        style={{ background: sc.bg, color: sc.text }}>
                    {hospital.status}
                  </span>
                </div>
                <p className="text-sm text-[#8A9E98] mt-0.5">
                  {hospital.city}, {hospital.pincode} · License: {hospital.licenseNumber}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {hospital.status === 'pending' && (
                <>
                  <button
                    onClick={() => approveMutation.mutate()}
                    disabled={approveMutation.isPending}
                    className="px-4 py-2 bg-[#0F6E56] text-white text-sm font-semibold rounded-xl
                               hover:bg-[#0B5542] disabled:opacity-50 transition-all"
                  >
                    {approveMutation.isPending ? 'Approving...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => setRejectModal(true)}
                    className="px-4 py-2 bg-[#FCEBEB] text-[#A32D2D] text-sm font-semibold rounded-xl
                               hover:bg-[#A32D2D] hover:text-white transition-all"
                  >
                    ✕ Reject
                  </button>
                </>
              )}
              {hospital.status === 'verified' && (
                <>
                  <select
                    value={hospital.plan || 'free'}
                    onChange={(e) => planMutation.mutate(e.target.value)}
                    disabled={planMutation.isPending}
                    className="px-3 py-2 border border-[#E2E8E4] rounded-xl text-sm text-[#1A2420]
                               bg-white outline-none focus:border-[#0F6E56] cursor-pointer"
                  >
                    <option value="free">Free Plan</option>
                    <option value="pro">Pro Plan</option>
                    <option value="growth">Growth Plan</option>
                  </select>
                  <button
                    onClick={() => setSuspendModal(true)}
                    className="px-4 py-2 bg-[#EEEDFE] text-[#534AB7] text-sm font-semibold rounded-xl
                               hover:bg-[#534AB7] hover:text-white transition-all"
                  >
                    Suspend
                  </button>
                </>
              )}
              {hospital.status === 'suspended' && (
                <button
                  onClick={() => reactivateMutation.mutate()}
                  disabled={reactivateMutation.isPending}
                  className="px-4 py-2 bg-[#0F6E56] text-white text-sm font-semibold rounded-xl
                             hover:bg-[#0B5542] disabled:opacity-50 transition-all"
                >
                  {reactivateMutation.isPending ? 'Reactivating...' : '↩ Reactivate'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5">
          {/* Left — hospital info */}
          <div className="space-y-5">
            {/* Basic info */}
            <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
              <h3 className="font-semibold text-sm text-[#1A2420] mb-4">Hospital Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Name',           value: hospital.name },
                  { label: 'Email',          value: hospital.email },
                  { label: 'Phone',          value: hospital.phone },
                  { label: 'License No.',    value: hospital.licenseNumber },
                  { label: 'Address',        value: hospital.address },
                  { label: 'City',           value: hospital.city },
                  { label: 'Pincode',        value: hospital.pincode },
                  { label: 'Plan',           value: hospital.plan || 'free' },
                  { label: 'Registered',     value: new Date(hospital.createdAt).toLocaleDateString() },
                  { label: 'Specializations',value: hospital.specializations?.join(', ') || 'None' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs text-[#8A9E98] mb-0.5">{label}</div>
                    <div className="text-sm font-medium text-[#1A2420] capitalize">
                      {value || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
              {hospital.description && (
                <div className="mt-4 pt-4 border-t border-[#E2E8E4]">
                  <div className="text-xs text-[#8A9E98] mb-1">Description</div>
                  <p className="text-sm text-[#4A5E58]">{hospital.description}</p>
                </div>
              )}
            </div>

            {/* Doctors */}
            <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-[#1A2420]">
                  Doctors ({doctors.length})
                </h3>
              </div>
              {doctors.length === 0 ? (
                <div className="text-center py-8 text-[#8A9E98]">
                  <div className="text-3xl mb-2">👨‍⚕️</div>
                  <p className="text-sm">No doctors registered yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {doctors.map((doctor: any) => (
                    <div key={doctor._id}
                         className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAF9]">
                      <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center
                                      font-syne font-bold text-xs text-[#1D63B5] flex-shrink-0">
                        {doctor.name?.charAt(0) || 'D'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#1A2420]">{doctor.name}</div>
                        <div className="text-xs text-[#8A9E98]">{doctor.specialization}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${doctor.isVerified
                          ? 'bg-[#E1F5EE] text-[#0F6E56]'
                          : 'bg-[#FEF3E2] text-[#B86E0A]'}`}>
                        {doctor.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — admin info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
              <h3 className="font-semibold text-sm text-[#1A2420] mb-4">Hospital Admin</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#A32D2D] flex items-center justify-center
                                font-syne font-bold text-sm text-white flex-shrink-0">
                  {(admin.name || 'A')?.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#1A2420]">
                    {admin.name || 'N/A'}
                  </div>
                  <div className="text-xs text-[#8A9E98]">Hospital Admin</div>
                </div>
              </div>
              {[
                { label: 'Email',    value: admin.email },
                { label: 'Phone',    value: admin.phone },
                { label: 'Verified', value: admin.isVerified ? 'Yes' : 'No' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-[#F4F6F4] last:border-0">
                  <span className="text-xs text-[#8A9E98]">{label}</span>
                  <span className="text-xs font-medium text-[#1A2420]">{value || 'N/A'}</span>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
              <h3 className="font-semibold text-sm text-[#1A2420] mb-3">Quick Stats</h3>
              {[
                { label: 'Total Doctors', value: doctors.length, color: '#1D63B5' },
                { label: 'Verified Doctors', value: doctors.filter((d: any) => d.isVerified).length, color: '#0F6E56' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between py-2 border-b border-[#F4F6F4] last:border-0">
                  <span className="text-xs text-[#8A9E98]">{label}</span>
                  <span className="text-xs font-bold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <ApproveRejectModal
        isOpen={rejectModal}
        hospitalName={hospital.name}
        onClose={() => setRejectModal(false)}
        onConfirm={(reason) => rejectMutation.mutate(reason)}
        isLoading={rejectMutation.isPending}
      />

      {/* Suspend Modal */}
      {suspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h2 className="font-syne font-bold text-lg text-[#1A2420] mb-2">Suspend Hospital</h2>
            <p className="text-sm text-[#8A9E98] mb-6">
              Are you sure you want to suspend {' '}
              <span className="font-semibold text-[#1A2420]">{hospital.name}</span>?
              This will block all staff access.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSuspendModal(false)}
                className="flex-1 px-4 py-2.5 border border-[#E2E8E4] rounded-xl text-sm
                           font-medium text-[#8A9E98] hover:text-[#4A5E58] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => suspendMutation.mutate()}
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

function LoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-24 bg-white rounded-2xl border border-[#E2E8E4]" />
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          <div className="h-64 bg-white rounded-2xl border border-[#E2E8E4]" />
          <div className="h-48 bg-white rounded-2xl border border-[#E2E8E4]" />
        </div>
        <div className="h-48 bg-white rounded-2xl border border-[#E2E8E4]" />
      </div>
    </div>
  )
}
