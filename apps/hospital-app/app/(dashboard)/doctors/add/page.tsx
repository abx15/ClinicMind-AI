'use client'

import { useState } from 'react'
import InviteDoctorModal from '@/components/doctor/InviteDoctorModal'
import { useRole } from '@/hooks/useRole'

export default function AddDoctorPage() {
  const { hospitalId } = useRole()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-xl text-[#1A2420]">Invite Doctor</h2>
        <p className="text-sm text-[#8A9E98] mt-0.5">
          Send invitation link to new doctors to join your hospital
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👨</span>
          </div>
          <h3 className="font-semibold text-[#1A2420] text-lg mb-2">Invite New Doctor</h3>
          <p className="text-sm text-[#8A9E98] max-w-md mx-auto">
            Send an invitation link to a qualified doctor to join your medical team.
            They'll receive a secure link to complete their profile.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-6 py-3 bg-[#0F6E56] text-white rounded-lg font-semibold
                     hover:bg-[#094D3C] transition-colors"
          >
            Send Invitation
          </button>
        </div>
      </div>

      <InviteDoctorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hospitalId={hospitalId || ''}
      />
    </div>
  )
}
