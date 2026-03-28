import { Search } from 'lucide-react'

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
  icon 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon || (
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-primary-500" />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-text-primary mb-2 font-heading">
        {title}
      </h3>
      
      <p className="text-text-muted text-center max-w-md mb-6">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
