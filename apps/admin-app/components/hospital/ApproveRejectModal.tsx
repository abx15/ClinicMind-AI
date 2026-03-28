import { useState } from 'react'

interface ApproveRejectModalProps {
  isOpen:       boolean
  hospitalName: string
  onClose:      () => void
  onConfirm:    (reason: string) => void
  isLoading:    boolean
}

export default function ApproveRejectModal({
  isOpen, hospitalName, onClose, onConfirm, isLoading
}: ApproveRejectModalProps) {
  const [reason, setReason] = useState('')
  const [error, setError]   = useState('')

  const handleConfirm = () => {
    if (reason.trim().length < 10) {
      setError('Please provide a reason (minimum 10 characters)')
      return
    }
    onConfirm(reason.trim())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="font-syne font-bold text-lg text-[#1A2420] mb-4">
          Reject Hospital Registration
        </h2>

        <div className="space-y-4">
          {/* Warning */}
          <div className="bg-[#FCEBEB] rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-[#A32D2D]">
              Rejecting: {hospitalName}
            </p>
            <p className="text-xs text-[#A32D2D]/80 mt-1">
              The hospital admin will be notified with your reason.
              They can re-register with correct information.
            </p>
          </div>

          {/* Reason textarea */}
          <div>
            <label className="text-sm font-medium text-[#1A2420] block mb-1.5">
              Rejection reason <span className="text-[#A32D2D]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError('') }}
              placeholder="e.g. Invalid license number format. Please provide a valid MH-YYYY-NNN format license."
              rows={3}
              className="w-full border border-[#E2E8E4] rounded-xl px-3 py-2.5 text-sm
                         text-[#1A2420] placeholder:text-[#8A9E98] outline-none resize-none
                         focus:border-[#A32D2D] focus:ring-2 focus:ring-[#A32D2D]/10"
            />
            {error && <p className="text-xs text-[#A32D2D] mt-1">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-[#E2E8E4] rounded-xl text-sm
                       font-medium text-[#8A9E98] hover:text-[#4A5E58] 
                       disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-[#A32D2D] text-white rounded-xl text-sm
                       font-semibold hover:bg-[#791F1F] disabled:opacity-50
                       transition-colors"
            >
              {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
