'use client'

interface VerifyToggleProps {
  doctorId:   string
  isVerified: boolean
  onVerify:   (id: string) => void
  onUnverify: (id: string) => void
  isLoading?: boolean
}

export default function VerifyToggle({
  doctorId, isVerified, onVerify, onUnverify, isLoading
}: VerifyToggleProps) {
  const handleToggle = () => {
    if (isVerified) onUnverify(doctorId)
    else             onVerify(doctorId)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#8A9E98]">
        {isVerified ? 'Verified' : 'Unverified'}
      </span>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#0F6E56] focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isVerified ? 'bg-[#0F6E56]' : 'bg-[#E2E8E4]'
        )}
        title={isVerified ? 'Click to unverify' : 'Click to verify'}
      >
        <span
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200',
            'shadow-sm',
            isVerified ? 'left-5' : 'left-1'
          )}
        />
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </span>
        )}
      </button>
    </div>
  )
}

// Helper function for className merging
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
