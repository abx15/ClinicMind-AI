export function HospitalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-3/4" />
          <div className="h-3 bg-surface rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-3 bg-surface rounded w-1/4" />
        <div className="flex gap-2">
          <div className="h-6 bg-surface rounded-full w-16" />
          <div className="h-6 bg-surface rounded-full w-20" />
          <div className="h-6 bg-surface rounded-full w-14" />
        </div>
      </div>
      <div className="h-px bg-border mb-4" />
      <div className="flex gap-3">
        <div className="h-10 bg-surface rounded-xl flex-1" />
        <div className="h-10 bg-surface rounded-xl flex-1" />
      </div>
    </div>
  )
}

export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-surface rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-3/4" />
          <div className="h-3 bg-surface rounded w-1/2" />
          <div className="h-3 bg-surface rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-surface rounded w-2/3" />
        <div className="h-3 bg-surface rounded w-1/2" />
      </div>
      <div className="h-10 bg-surface rounded-xl" />
    </div>
  )
}

export function AppointmentCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface rounded w-3/4" />
          <div className="h-3 bg-surface rounded w-1/2" />
          <div className="h-3 bg-surface rounded w-1/3" />
          <div className="flex justify-between items-center pt-1">
            <div className="h-5 bg-surface rounded-full w-20" />
            <div className="h-7 bg-surface rounded-lg w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizes[size]}`} />
  )
}
