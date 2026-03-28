'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { cn } from '../utils/cn'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void
    error:   (message: string) => void
    warning: (message: string) => void
    info:    (message: string) => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

const styles: Record<ToastType, string> = {
  success: 'bg-[#0F6E56] text-white',
  error:   'bg-[#A32D2D] text-white',
  warning: 'bg-[#B86E0A] text-white',
  info:    'bg-[#1D63B5] text-white',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((type: ToastType, message: string, duration = 3500) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  const toast = {
    success: (msg: string) => addToast('success', msg),
    error:   (msg: string) => addToast('error', msg),
    warning: (msg: string) => addToast('warning', msg),
    info:    (msg: string) => addToast('info', msg),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'px-4 py-3 rounded-xl shadow-lg text-sm font-medium',
              'max-w-sm pointer-events-auto',
              'animate-in slide-in-from-right-4 fade-in duration-300',
              styles[t.type]
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.toast
}
