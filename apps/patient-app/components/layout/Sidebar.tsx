'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useUser, useAuthStore } from '@/stores/authStore'
import { LogOut, Menu, X } from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useUser()
  const { logout } = useAuthStore()

  const navItems = [
    {
      label: 'Home',
      href: '/dashboard/home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Find Hospitals',
      href: '/hospitals',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      label: 'Appointments',
      href: '/dashboard/appointments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Queue Status',
      href: '/dashboard/queue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'My Records',
      href: '/dashboard/records',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
    onClose?.()
  }

  const isActive = (href: string) => {
    if (href === '/dashboard/home') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-primary-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-500 font-bold text-lg font-heading">C</span>
            </div>
            <div>
              <div className="text-white font-semibold font-heading">ClinicMind</div>
              <div className="text-primary-200 text-xs">manage.clinicmind.in</div>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:bg-primary-600 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="mt-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium truncate">{user?.name}</div>
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full inline-block">
              Patient
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => {
              router.push(item.href)
              onClose?.()
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-primary-600 text-white'
                : 'text-primary-200 hover:bg-primary-600 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary-600">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-primary-200 hover:bg-primary-600 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
