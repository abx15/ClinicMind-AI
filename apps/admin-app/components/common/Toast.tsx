'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id:      string
  type:    ToastType
  message: string
}

interface ToastItemProps {
  toast:    Toast
  onRemove: (id: string) => void
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

const STYLES: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
  success: { bg: '#E1F5EE', border: '#0F6E56', text: '#0F6E56', icon: '#0F6E56' },
  error:   { bg: '#FCEBEB', border: '#A32D2D', text: '#A32D2D', icon: '#A32D2D' },
  warning: { bg: '#FEF3E2', border: '#B86E0A', text: '#B86E0A', icon: '#B86E0A' },
  info:    { bg: '#E6F1FB', border: '#1D63B5', text: '#1D63B5', icon: '#1D63B5' },
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false)
  const s = STYLES[toast.type]

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, 4000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [toast.id, onRemove])

  return (
    <div
      style={{
        background:   s.bg,
        borderLeft:   `4px solid ${s.border}`,
        transform:    visible ? 'translateX(0)' : 'translateX(110%)',
        opacity:      visible ? 1 : 0,
        transition:   'transform 0.3s ease, opacity 0.3s ease',
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg mb-2
                 min-w-[280px] max-w-[360px] pointer-events-auto"
    >
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{ background: s.border, color: '#fff' }}
      >
        {ICONS[toast.type]}
      </span>
      <p className="text-sm font-medium flex-1" style={{ color: s.text }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-xs opacity-60 hover:opacity-100 flex-shrink-0 transition-opacity"
        style={{ color: s.text }}
      >
        ✕
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts:   Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col items-end pointer-events-none"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
