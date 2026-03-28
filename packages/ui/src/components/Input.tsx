import React from 'react'
import { cn } from '../utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A2420]">
            {label}
            {props.required && <span className="text-[#A32D2D] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9E98]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border px-3 py-2.5 text-sm text-[#1A2420]',
              'bg-white placeholder:text-[#8A9E98]',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]',
              'disabled:bg-[#F4F6F4] disabled:cursor-not-allowed',
              error ? 'border-[#A32D2D] focus:ring-[#A32D2D]/20' : 'border-[#E2E8E4]',
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9E98]">
              {rightIcon}
            </div>
          )}
        </div>
        {error     && <p className="text-xs text-[#A32D2D]">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#8A9E98]">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
