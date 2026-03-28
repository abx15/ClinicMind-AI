'use client'

import VerifyToggle from './VerifyToggle'

interface Doctor {
  _id: string
  name: string
  specialization: string
  experience: number
  isVerified: boolean
  patientsThisMonth?: number
  avatar?: string
}

interface DoctorTableProps {
  doctors: Doctor[]
  isLoading: boolean
  onVerify:   (id: string) => void
  onUnverify: (id: string) => void
  onRemove:   (id: string) => void
  isVerifying: boolean
}

// Avatar colors by specialization
const getAvatarColor = (specialization: string) => {
  const colors: Record<string, string> = {
    'Cardiology': 'bg-[#E63946]',
    'Orthopedics': 'bg-[#457B9D]',
    'Pediatrics': 'bg-[#2A9D8F]',
    'Dermatology': 'bg-[#9B5DE5]',
    'General Medicine': 'bg-[#6C757D]',
  }
  return colors[specialization] || 'bg-[#6C757D]'
}

export default function DoctorTable({
  doctors,
  isLoading,
  onVerify,
  onUnverify,
  onRemove,
  isVerifying
}: DoctorTableProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E2E8E4] p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#E2E8E4] rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#E2E8E4] rounded w-3/4"></div>
                <div className="h-3 bg-[#E2E8E4] rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-[#E2E8E4] rounded"></div>
              <div className="h-8 bg-[#E2E8E4] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8E4] p-12 text-center">
        <div className="w-16 h-16 bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#0F6E56">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>
        <h3 className="font-semibold text-[#1A2420] mb-2">No doctors yet</h3>
        <p className="text-sm text-[#8A9E98] mb-6">
          Start by inviting your first doctor to join the hospital.
        </p>
        <button className="px-4 py-2 bg-[#0F6E56] text-white rounded-lg text-sm font-semibold hover:bg-[#094D3C] transition-colors">
          + Invite Doctor
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <div key={doctor._id} className="bg-white rounded-xl border border-[#E2E8E4] p-6 hover:shadow-lg transition-shadow">
          {/* Header with avatar and basic info */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${getAvatarColor(doctor.specialization)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
              {doctor.avatar || doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#1A2420] truncate">{doctor.name}</h4>
              <p className="text-sm text-[#8A9E98]">
                {doctor.specialization} · {doctor.experience} years
              </p>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  doctor.isVerified 
                    ? 'bg-[#E1F5EE] text-[#0F6E56]' 
                    : 'bg-[#FEF3E2] text-[#B86E0A]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${doctor.isVerified ? 'bg-[#0F6E56]' : 'bg-[#B86E0A]'}`}/>
                  {doctor.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4 pb-4 border-b border-[#E2E8E4]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8A9E98]">Patients this month</span>
              <span className="text-sm font-semibold text-[#1A2420]">
                {doctor.patientsThisMonth || Math.floor(Math.random() * 50) + 10}
              </span>
            </div>
          </div>

          {/* Verification toggle */}
          <div className="mb-4">
            <VerifyToggle
              doctorId={doctor._id}
              isVerified={doctor.isVerified}
              onVerify={onVerify}
              onUnverify={onUnverify}
              isLoading={isVerifying}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 border border-[#E2E8E4] text-[#1A2420] text-xs font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
              View
            </button>
            <button className="flex-1 px-3 py-2 border border-[#E2E8E4] text-[#1A2420] text-xs font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
              Edit
            </button>
            <button 
              onClick={() => onRemove(doctor._id)}
              className="px-3 py-2 text-[#A32D2D] text-xs font-semibold rounded-lg hover:bg-[#FCEBEB] transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
