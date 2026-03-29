'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

const navItems = [
  {
    section: 'Platform',
    items: [
      { label: 'Overview',  href: '/dashboard/overview',  icon: GridIcon   },
      { label: 'Hospitals', href: '/dashboard/hospitals', icon: BuildingIcon },
      { label: 'Doctors',   href: '/dashboard/doctors',   icon: UserMdIcon  },
      { label: 'Patients',  href: '/dashboard/patients',  icon: UsersIcon   },
    ],
  },
  {
    section: 'Business',
    items: [
      { label: 'Analytics',   href: '/dashboard/analytics',         icon: ChartIcon    },
      { label: 'Billing/MRR', href: '/dashboard/analytics#billing', icon: CurrencyIcon },
      { label: 'Settings',    href: '/dashboard/settings',          icon: SettingsIcon  },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const user     = useAuthStore(s => s.user)
  const clearAuth = useAuthStore(s => s.clearAuth)

  const logout = () => {
    clearAuth()
    if (typeof document !== 'undefined') {
      document.cookie = 'clinicmind_token=; path=/; max-age=0'
    }
    router.push('/login')
  }

  return (
    <aside className="w-[220px] flex-shrink-0 h-screen bg-[#0B2920] flex flex-col
                      border-r border-white/[0.06] sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src="/logo.png"
            alt="ClinicMind"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="font-heading font-extrabold text-[17px] text-white tracking-tight">
            ClinicMind
          </span>
        </div>
        <div className="text-[10px] text-white/30 font-mono mb-1.5">
          admin.clinicmind.in
        </div>
        <span className="inline-block text-[9px] font-semibold uppercase tracking-widest
                         px-2 py-0.5 rounded-full bg-[#5c1a1a] text-[#E87878]">
          Super Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navItems.map(section => (
          <div key={section.section}>
            <div className="text-[9px] font-semibold text-white/25 uppercase tracking-widest
                            px-2 py-1 mb-1">
              {section.section}
            </div>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const isActive = pathname.startsWith(item.href.split('#')[0])
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg',
                      'text-[13px] font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#0F6E56] text-white'
                        : 'text-white/45 hover:bg-white/[0.06] hover:text-white/75',
                    ].join(' ')}
                  >
                    <item.icon className="w-4 h-4 opacity-80" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer — user + logout */}
      <div className="p-3 border-t border-white/[0.07]">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        bg-white/[0.05] mb-2">
          <div className="w-8 h-8 rounded-full bg-[#A32D2D] flex items-center
                          justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {user?.name ?? 'Super Admin'}
            </div>
            <div className="text-[10px] text-[#E87878]">Full platform access</div>
          </div>
        </div>
        <button
          id="admin-logout-btn"
          onClick={logout}
          className="w-full px-3 py-2 text-xs text-white/40 hover:text-white/70
                     hover:bg-white/[0.05] rounded-lg transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  )
}
function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="2" width="14" height="12" rx="1.5"/>
      <rect x="4" y="6" width="3" height="3" rx="0.5" fill="white" opacity=".4"/>
      <rect x="9" y="6" width="3" height="3" rx="0.5" fill="white" opacity=".4"/>
      <rect x="6" y="9" width="4" height="5" rx="0.5" fill="white" opacity=".4"/>
    </svg>
  )
}
function UserMdIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="5" r="3"/>
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
    </svg>
  )
}
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="5" r="2.5"/>
      <circle cx="11" cy="5" r="2.5"/>
      <path d="M0 13c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
      <path d="M11 8c1.7.5 3 2.1 3 4"/>
    </svg>
  )
}
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <rect x="1"  y="10" width="3" height="5" rx="1"/>
      <rect x="6"  y="7"  width="3" height="8" rx="1"/>
      <rect x="11" y="4"  width="3" height="11" rx="1"/>
    </svg>
  )
}
function CurrencyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <text x="8" y="12" textAnchor="middle" fontSize="9" fontWeight="bold">₹</text>
    </svg>
  )
}
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="2"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  )
}
