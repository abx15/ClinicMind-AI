export function HospitalCardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-1 bg-primary-500 rounded-t-card mb-4"></div>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-border rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border rounded w-3/4"></div>
          <div className="h-3 bg-border rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-3 bg-border rounded w-1/4"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-border rounded-full w-16"></div>
          <div className="h-6 bg-border rounded-full w-20"></div>
          <div className="h-6 bg-border rounded-full w-14"></div>
        </div>
      </div>
      <div className="h-px bg-border mb-4"></div>
      <div className="flex space-x-3">
        <div className="h-10 bg-border rounded-button flex-1"></div>
        <div className="h-10 bg-border rounded-button flex-1"></div>
      </div>
    </div>
  )
}

export function DoctorCardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-border rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border rounded w-3/4"></div>
          <div className="h-3 bg-border rounded w-1/2"></div>
          <div className="h-3 bg-border rounded w-1/3"></div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-border rounded w-2/3"></div>
        <div className="h-3 bg-border rounded w-1/2"></div>
      </div>
      <div className="h-10 bg-border rounded-button"></div>
    </div>
  )
}

export function AppointmentCardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-border rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-border rounded w-3/4"></div>
          <div className="h-3 bg-border rounded w-1/2"></div>
          <div className="h-3 bg-border rounded w-2/3"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-border rounded-full w-20"></div>
            <div className="h-8 bg-border rounded-button w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-primary-500 border-t-transparent ${sizeClasses[size]}`}></div>
  )
}
