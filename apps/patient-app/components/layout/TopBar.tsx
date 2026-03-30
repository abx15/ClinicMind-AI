'use client'

import { MenuIcon, BellIcon } from '@/components/icons'
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
          className="lg:hidden p-2 text-text-3 hover:text-text-1 hover:bg-primary-light rounded-lg"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="flex-1">
          {title && (
            <div>
              <h1 className="text-2xl font-bold text-text-1 font-heading">
                {title}
              </h1>
              {subtitle && (
                <p className="text-text-3">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-text-3 hover:text-text-1 hover:bg-primary-light rounded-lg transition-colors">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>

          {/* User avatar */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-text-1">{user?.name}</div>
              <div className="text-xs text-text-3">Patient</div>
            </div>
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-primary font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
