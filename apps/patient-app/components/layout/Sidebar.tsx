'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useUser, useAuthStore } from '@/stores/authStore'
import { LogOutIcon, MenuIcon, XIcon, HomeIcon, SearchIcon, CalendarIcon, ClockIcon, FileIcon, UserIcon } from '@/components/icons'

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
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      label: 'Find Hospitals',
      href: '/hospitals',
      icon: <SearchIcon className="w-5 h-5" />,
    },
    {
      label: 'Appointments',
      href: '/dashboard/appointments',
      icon: <CalendarIcon className="w-5 h-5" />,
    },
    {
      label: 'Queue Status',
      href: '/dashboard/queue',
      icon: <ClockIcon className="w-5 h-5" />,
    },
    {
      label: 'My Records',
      href: '/dashboard/records',
      icon: <FileIcon className="w-5 h-5" />,
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: <UserIcon className="w-5 h-5" />,
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
            <XIcon className="w-5 h-5" />
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
          <LogOutIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
