'use client'

interface QueueToken {
  _id: string
  tokenNumber: number
  patient?: {
    name: string
    complaint?: string
  }
  status: string
  estimatedWaitMinutes?: number
}

interface QueueTokenCardProps {
  token: QueueToken
}

export default function QueueTokenCard({ token }: QueueTokenCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8E4] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Token number */}
        <div className="w-10 h-10 bg-[#F4F6F4] border border-[#E2E8E4] rounded-lg flex items-center justify-center">
          <span className="text-sm font-bold text-[#8A9E98]">
            #{token.tokenNumber.toString().padStart(3, '0')}
          </span>
        </div>

        {/* Patient info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#1A2420] text-sm truncate">
            {token.patient?.name || 'Patient Name'}
          </h4>
          <p className="text-xs text-[#8A9E98] mt-0.5">
            {token.patient?.complaint || 'No complaint specified'}
          </p>
        </div>

        {/* ETA */}
        {token.estimatedWaitMinutes && (
          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FEF3E2] text-[#B86E0A]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 3v3l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              ~{token.estimatedWaitMinutes} min
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
