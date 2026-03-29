import { CalendarIcon } from '@/components/icons'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon || (
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center
                        justify-center mb-5">
          <CalendarIcon size={28} className="text-primary" />
        </div>
      )}

      <h3 className="font-heading font-bold text-lg text-text-1 mb-1">
        {title}
      </h3>

      <p className="text-sm text-text-3 max-w-md mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white
                     font-semibold text-sm rounded-xl transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
