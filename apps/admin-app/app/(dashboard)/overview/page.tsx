'use client'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn:  () => adminService.getPlatformStats(),
    refetchInterval: 30000,
  })

  const stats = data?.data

  // Top stat cards — 4 in a row
  const statCards = [
    {
      label: 'Total Hospitals',
      value: stats?.totalHospitals || 0,
      sub:   `${stats?.verifiedHospitals || 0} verified`,
      color: 'teal',
      trend: '↑ 18 this month',
    },
    {
      label: 'Pending Approval',
      value: stats?.pendingHospitals || 0,
      sub:   'Need review',
      color: 'amber',
      trend: 'Action needed',
    },
    {
      label: 'Total Doctors',
      value: stats?.totalDoctors || 0,
      sub:   'Across all hospitals',
      color: 'purple',
      trend: '↑ 124 this month',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${((stats?.mrr || 0) / 1000).toFixed(0)}K`,
      sub:   'MRR',
      color: 'blue',
      trend: '↑ 18%',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} isLoading={isLoading} />
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5">
        {/* Pending approvals */}
        <PendingApprovalsSection />

        {/* Right panel */}
        <div className="space-y-4">
          <RevenueBreakdownCard mrr={stats?.mrr || 0} />
          <PlatformHealthCard stats={stats} />
        </div>
      </div>
    </div>
  )
}

// StatCard component
function StatCard({
  label, value, sub, color, trend, isLoading
}: {
  label: string; value: string | number; sub: string
  color: string; trend: string; isLoading: boolean
}) {
  const colors: Record<string, { bg: string; icon: string }> = {
    teal:   { bg: '#E1F5EE', icon: '#0F6E56' },
    amber:  { bg: '#FEF3E2', icon: '#B86E0A' },
    purple: { bg: '#EEEDFE', icon: '#534AB7' },
    blue:   { bg: '#E6F1FB', icon: '#1D63B5' },
    red:    { bg: '#FCEBEB', icon: '#A32D2D' },
  }
  const c = colors[color] || colors.teal

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 animate-pulse">
        <div className="h-9 w-9 rounded-xl bg-[#F4F6F4] mb-3" />
        <div className="h-7 w-16 bg-[#F4F6F4] rounded mb-2" />
        <div className="h-3 w-24 bg-[#F4F6F4] rounded" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
             style={{ background: c.bg }}>
          <div className="w-4 h-4 rounded-sm" style={{ background: c.icon }} />
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: c.bg, color: c.icon }}>
          {trend}
        </span>
      </div>
      <div className="font-syne font-bold text-3xl text-[#1A2420] leading-none">
        {value}
      </div>
      <div className="text-xs text-[#8A9E98] mt-1">{label}</div>
      <div className="text-[10px] text-[#8A9E98] mt-0.5">{sub}</div>
    </div>
  )
}

// Placeholder components for the sections
function PendingApprovalsSection() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
      <h3 className="font-syne font-bold text-lg text-[#1A2420] mb-4">
        Pending Hospital Approvals
      </h3>
      <div className="text-center py-8 text-[#8A9E98]">
        <div className="text-3xl mb-2">📋</div>
        <p>No pending approvals at this time</p>
      </div>
    </div>
  )
}

function RevenueBreakdownCard({ mrr }: { mrr: number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
      <h3 className="font-semibold text-sm text-[#1A2420] mb-3">
        Revenue Breakdown
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#8A9E98]">Monthly Recurring</span>
          <span className="font-semibold text-[#0F6E56]">₹{(mrr / 1000).toFixed(1)}K</span>
        </div>
        <div className="w-full h-2 bg-[#F4F6F4] rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-[#0F6E56] rounded-full" />
        </div>
      </div>
    </div>
  )
}

function PlatformHealthCard({ stats }: { stats: any }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
      <h3 className="font-semibold text-sm text-[#1A2420] mb-3">
        Platform Health
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#8A9E98]">Uptime</span>
          <span className="font-semibold text-[#0F6E56]">99.8%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#8A9E98]">Active Users</span>
          <span className="font-semibold text-[#1D63B5]">{stats?.totalPatients || 0}</span>
        </div>
      </div>
    </div>
  )
}
