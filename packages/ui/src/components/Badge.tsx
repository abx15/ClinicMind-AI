import React from 'react'
import { cn } from '../utils/cn'

type BadgeVariant = 'verified' | 'pending' | 'rejected' | 'active' | 'inactive' | 'live' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  verified:  'bg-[#E1F5EE] text-[#085041]',
  active:    'bg-[#E1F5EE] text-[#085041]',
  pending:   'bg-[#FEF3E2] text-[#B86E0A]',
  rejected:  'bg-[#FCEBEB] text-[#A32D2D]',
  inactive:  'bg-[#F4F6F4] text-[#8A9E98]',
  live:      'bg-[#FCEBEB] text-[#A32D2D] animate-pulse',
  default:   'bg-[#F4F6F4] text-[#4A5E58]',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default', children, className, dot = true
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  )
}
