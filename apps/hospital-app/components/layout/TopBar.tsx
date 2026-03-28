'use client'

import { usePathname } from 'next/navigation'
import { useUser } from '@/stores/authStore'

// Page title map
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard/overview':              { title: 'Overview',             subtitle: 'Today\'s summary' },
  '/dashboard/doctors':               { title: 'Doctors',              subtitle: 'Manage your medical team' },
  '/dashboard/doctors/add':           { title: 'Invite Doctor',        subtitle: 'Send invitation link' },
  '/dashboard/staff':                 { title: 'Staff',                subtitle: 'Manage receptionist & nurses' },
  '/dashboard/appointments':          { title: 'Appointments',         subtitle: 'All scheduled appointments' },
  '/dashboard/analytics':             { title: 'Analytics',            subtitle: 'Performance insights' },
  '/dashboard/settings':              { title: 'Settings',             subtitle: 'Hospital profile & preferences' },
  '/dashboard/doctor/queue':          { title: 'Live Queue',           subtitle: 'Real-time patient queue' },
  '/dashboard/doctor/patients':       { title: 'My Patients',          subtitle: 'Patient history & records' },
  '/dashboard/doctor/prescriptions':  { title: 'Prescriptions',        subtitle: 'Patient prescriptions' },
  '/dashboard/doctor/prescriptions/new': { title: 'New Prescription',  subtitle: 'AI-powered voice entry' },
  '/dashboard/staff/queue':           { title: 'Queue Management',     subtitle: 'Manage patient tokens' },
  '/dashboard/staff/patients':        { title: 'Patient Registration', subtitle: 'Register walk-in patients' },
}

export default function TopBar() {
  const pathname = usePathname()
  const user = useUser()
  const meta = pageTitles[pathname] || { title: 'Dashboard', subtitle: '' }

  return (
    <header className="h-[60px] bg-white border-b border-[#E2E8E4] flex items-center
                       px-7 gap-4 flex-shrink-0">
      <div className="flex-1">
        <h1 className="font-syne font-bold text-[18px] text-[#1A2420] leading-none">
          {meta.title}
        </h1>
        {meta.subtitle && (
          <p className="text-[11px] text-[#8A9E98] mt-0.5">{meta.subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="w-9 h-9 rounded-full bg-[#F4F6F4] border border-[#E2E8E4]
                           flex items-center justify-center relative">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#8A9E98">
            <path d="M8 1a5 5 0 0 0-5 5v3l-1.5 1.5V12h13v-1.5L13 9V6a5 5 0 0 0-5-5z"/>
            <path d="M6.5 13a1.5 1.5 0 0 0 3 0"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A32D2D]
                           rounded-full border-2 border-white" />
        </button>
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#0F6E56] flex items-center
                        justify-center text-white text-sm font-bold cursor-pointer">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  )
}
