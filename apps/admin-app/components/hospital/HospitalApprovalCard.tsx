interface HospitalApprovalCardProps {
  hospital:    any
  onApprove:   () => void
  onReject:    () => void
  isApproving: boolean
}

export default function HospitalApprovalCard({
  hospital, onApprove, onReject, isApproving
}: HospitalApprovalCardProps) {
  const submittedDaysAgo = Math.floor(
    (Date.now() - new Date(hospital.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] px-5 py-4
                    flex items-center gap-4 hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-xl bg-[#E1F5EE] flex items-center justify-center
                      font-syne font-extrabold text-lg text-[#0F6E56] flex-shrink-0">
        {hospital.name?.charAt(0) || 'H'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[14px] text-[#1A2420]">{hospital.name || 'Unknown Hospital'}</div>
        <div className="text-xs text-[#8A9E98] mt-0.5">
          {hospital.city || 'Unknown'}, {hospital.pincode || 'N/A'} &nbsp;·&nbsp;
          License: {hospital.licenseNumber || 'N/A'}
        </div>
        <div className="flex gap-1.5 flex-wrap mt-1.5">
          {hospital.specializations?.slice(0, 3).map((s: string) => (
            <span key={s}
                  className="text-[10px] px-2 py-0.5 rounded-full
                             bg-[#E1F5EE] text-[#085041] font-medium">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Time */}
      <div className="text-xs text-[#8A9E98] whitespace-nowrap flex-shrink-0">
        {submittedDaysAgo === 0 ? 'Today' : `${submittedDaysAgo}d ago`}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onApprove}
          disabled={isApproving}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E1F5EE] text-[#0F6E56]
                     rounded-lg text-xs font-semibold hover:bg-[#0F6E56] hover:text-white
                     disabled:opacity-50 transition-all"
        >
          {isApproving ? '...' : '✓ Approve'}
        </button>
        <button
          onClick={onReject}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCEBEB] text-[#A32D2D]
                     rounded-lg text-xs font-semibold hover:bg-[#A32D2D] hover:text-white
                     transition-all"
        >
          ✕ Reject
        </button>
      </div>
    </div>
  )
}
