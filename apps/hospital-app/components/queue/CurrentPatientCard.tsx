'use client'

interface QueueToken {
  _id: string
  tokenNumber: number
  patient?: {
    name: string
    complaint?: string
  }
  status: string
  calledAt?: string
}

interface CurrentPatientCardProps {
  token:       QueueToken
  onMarkDone:  () => void
  isLoading:   boolean
}

export default function CurrentPatientCard({
  token,
  onMarkDone,
  isLoading
}: CurrentPatientCardProps) {
  return (
    <div className="bg-[#E1F5EE] rounded-xl border-2 border-[#5DCAA5] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0F6E56] rounded-full flex items-center justify-center text-white font-bold text-lg">
            {token.tokenNumber.toString().padStart(3, '0')}
          </div>
          <div>
            <h3 className="font-semibold text-[#1A2420] text-lg">NOW SERVING</h3>
            <p className="text-xs text-[#0F6E56] font-medium">Token #{token.tokenNumber}</p>
          </div>
        </div>
        <button
          onClick={onMarkDone}
          disabled={isLoading}
          className="px-4 py-2 bg-[#0F6E56] text-white text-sm font-semibold rounded-lg
                   hover:bg-[#094D3C] disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Mark Done ✓
            </>
          )}
        </button>
      </div>

      {/* Patient info */}
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-[#1A2420] text-xl">
            {token.patient?.name || 'Patient Name'}
          </h4>
          <p className="text-sm text-[#4A5E58] mt-1">
            Chief complaint: {token.patient?.complaint || 'Not specified'}
          </p>
        </div>

        {token.calledAt && (
          <div className="flex items-center gap-2 text-sm text-[#8A9E98]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Called at: {new Date(token.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-4 pt-4 border-t border-[#5DCAA5]/30 flex gap-2">
        <button className="flex-1 px-3 py-2 bg-white text-[#0F6E56] text-xs font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
          View Profile
        </button>
        <button className="flex-1 px-3 py-2 bg-white text-[#0F6E56] text-xs font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
          Prescribe
        </button>
        <button className="flex-1 px-3 py-2 bg-white text-[#0F6E56] text-xs font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
          Notes
        </button>
      </div>
    </div>
  )
}
