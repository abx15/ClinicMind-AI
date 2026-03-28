'use client'

import { Menu, Bell } from 'lucide-react'
import { useUser } from '@/stores/authStore'

interface TopBarProps {
  title?: string
  subtitle?: string
  onMenuClick?: () => void
}

export default function TopBar({ title, subtitle, onMenuClick }: TopBarProps) {
  const user = useUser()

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="flex-1">
          {title && (
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-heading">
                {title}
              </h1>
              {subtitle && (
                <p className="text-text-muted">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User avatar */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-text-primary">{user?.name}</div>
              <div className="text-xs text-text-muted">Patient</div>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
