import { cn } from '@clinicmind/ui'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rect' | 'circle'
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <div className={cn(
      'animate-pulse bg-[#F4F6F4]',
      variant === 'circle' && 'rounded-full',
      variant === 'text'   && 'rounded h-4',
      variant === 'rect'   && 'rounded-xl',
      className
    )} />
  )
}

// Hospital card skeleton
export function HospitalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
      <div className="h-1.5 bg-[#F4F6F4]" />
      <div className="p-5 space-y-3">
        <div className="flex gap-3">
          <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" variant="text" />
            <Skeleton className="h-3 w-1/2" variant="text" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" variant="text" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2 border-t border-[#E2E8E4]">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 animate-pulse">
      <div className="h-9 w-9 rounded-xl bg-[#F4F6F4] mb-3" />
      <div className="h-7 w-16 bg-[#F4F6F4] rounded mb-2" />
      <div className="h-3 w-24 bg-[#F4F6F4] rounded" />
    </div>
  )
}

// Table row skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array(columns).fill(0).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-[#F4F6F4] rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
        </td>
      ))}
    </tr>
  )
}
