'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/hooks/useRole'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@clinicmind/ui'

// Nav items for hospital admin
const navItems = [
  {
    label: 'Overview',
    href:  '/dashboard/overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Doctors',
    href:  '/dashboard/doctors',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="5" r="3"/>
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Staff',
    href:  '/dashboard/staff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="5" r="2.5"/>
        <circle cx="11" cy="5" r="2.5"/>
        <path d="M0 13c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
        <path d="M11 8c1.7.5 3 2.1 3 4"/>
      </svg>
    ),
  },
  {
    label: 'Appointments',
    href:  '/dashboard/appointments',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="3" width="14" height="11" rx="1.5"/>
        <path d="M5 3V1M11 3V1M1 7h14"/>
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href:  '/dashboard/analytics',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1"  y="10" width="3" height="5" rx="1"/>
        <rect x="6"  y="7"  width="3" height="8" rx="1"/>
        <rect x="11" y="4"  width="3" height="11" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    href:  '/dashboard/settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="2"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4"/>
      </svg>
    ),
  },
]

export default function HospitalSidebar() {
  const pathname  = usePathname()
  const { logout } = useAuthStore()
  const { user }  = useRole()

  return (
    <aside className="w-[220px] flex-shrink-0 h-screen bg-[#0B2920] flex flex-col">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/[0.07]">
        <div className="font-syne font-extrabold text-[17px] text-white tracking-tight">
          ClinicMind
        </div>
        <div className="text-[10px] text-white/30 mt-0.5 font-mono">
          manage.clinicmind.in
        </div>
        <span className="inline-block mt-2 text-[9px] font-semibold uppercase tracking-widest
                         px-2 py-0.5 rounded-full bg-[#0d3d2b] text-[#5DCAA5]">
          Hospital Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <div className="text-[9px] font-semibold text-white/25 uppercase tracking-widest
                        px-2 py-1.5 mt-2 mb-1">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium',
                'transition-all duration-150',
                isActive
                  ? 'bg-[#0F6E56] text-white'
                  : 'text-white/45 hover:bg-white/[0.06] hover:text-white/75'
              )}
            >
              <span className={cn('w-4 h-4', isActive ? 'opacity-100' : 'opacity-70')}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.07]">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.05] cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#0F6E56] flex items-center justify-center
                          text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user?.name || 'Admin'}</div>
            <div className="text-[10px] text-white/35">Hospital Admin</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full mt-2 px-3 py-2 text-xs text-white/40 hover:text-white/70
                     hover:bg-white/[0.05] rounded-lg transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
