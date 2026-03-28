'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/hooks/useRole'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@clinicmind/ui'

// Nav items for staff
const staffNavItems = [
  {
    label: 'Queue',
    href: '/dashboard/staff/queue',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Patients',
    href: '/dashboard/staff/patients',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="5" r="3"/>
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Appointments',
    href: '/dashboard/staff/appointments',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="3" width="14" height="11" rx="1.5"/>
        <path d="M5 3V1M11 3V1M1 7h14"/>
      </svg>
    ),
  },
]

export default function StaffSidebar() {
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
                         px-2 py-0.5 rounded-full bg-[#0F6E56] text-[#5DCAA5]">
          Receptionist
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <div className="text-[9px] font-semibold text-white/25 uppercase tracking-widest
                        px-2 py-1.5 mt-2 mb-1">
          Operations
        </div>
        {staffNavItems.map((item) => {
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
          <div className="w-8 h-8 rounded-full bg-[#1D63B5] flex items-center justify-center
                          text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user?.name || 'Staff'}</div>
            <div className="text-[10px] text-white/35">Receptionist</div>
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
