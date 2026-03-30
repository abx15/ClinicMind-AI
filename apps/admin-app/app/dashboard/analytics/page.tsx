'use client'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn:  () => adminService.getPlatformStats(),
    refetchInterval: 60000,
  })

  const stats = data?.data?.data

  const totalHospitals    = stats?.totalHospitals    ?? 0
  const verifiedHospitals = stats?.verifiedHospitals ?? 0
  const pendingHospitals  = stats?.pendingHospitals  ?? 0
  const rejectedHospitals = stats?.rejectedHospitals ?? 0
  const totalDoctors      = stats?.totalDoctors      ?? 0
  const totalPatients     = stats?.totalPatients     ?? 0
  const mrr               = stats?.mrr               ?? 0
  const planBreakdown     = stats?.planBreakdown     ?? {}

  const approvalRate = totalHospitals
    ? Math.round((verifiedHospitals / totalHospitals) * 100)
    : 0

  // Compute donut angles for CSS SVG ring
  const verifiedPct = totalHospitals ? (verifiedHospitals / totalHospitals) * 100 : 0
  const pendingPct  = totalHospitals ? (pendingHospitals  / totalHospitals) * 100 : 0
  const circumference = 2 * Math.PI * 15.9 // r=15.9

  const Skeleton = ({ w = 'w-16', h = 'h-7' }: { w?: string; h?: string }) => (
    <div className={`${w} ${h} bg-[#F4F6F4] rounded animate-pulse`} />
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-syne font-bold text-xl text-[#1A2420]">Platform Analytics</h2>
        <p className="text-sm text-[#8A9E98] mt-0.5">Real-time platform statistics</p>
      </div>

      {/* Revenue card */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-syne font-bold text-lg text-[#1A2420]">Monthly Revenue</h3>
            <p className="text-xs text-[#8A9E98] mt-0.5">Subscription MRR</p>
          </div>
        </div>

        {/* Big MRR number */}
        <div className="font-syne font-extrabold text-4xl text-[#0F6E56] mb-1">
          {isLoading
            ? <Skeleton w="w-32" h="h-10" />
            : `₹${mrr.toLocaleString('en-IN')}`}
        </div>
        <p className="text-sm text-[#8A9E98] mb-6">Total platform MRR</p>

        {/* Plan breakdown bars */}
        <div className="space-y-4">
          {[
            { plan: 'Free plan',    key: 'free',   color: '#C9D5D0', priceLabel: '₹0/mo' },
            { plan: 'Pro plan',     key: 'pro',    color: '#0F6E56', priceLabel: '₹2,499/mo' },
            { plan: 'Growth plan',  key: 'growth', color: '#B86E0A', priceLabel: '₹5,999/mo' },
          ].map(({ plan, key, color, priceLabel }) => {
            const entry = planBreakdown[key] || { count: 0, revenue: 0 }
            const pct = verifiedHospitals > 0
              ? Math.round((entry.count / verifiedHospitals) * 100)
              : 0

            return (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#4A5E58]">
                    {plan} ({isLoading ? '...' : entry.count} hospitals · {priceLabel})
                  </span>
                  <span className="font-semibold text-[#1A2420]">
                    {isLoading ? '...' : `₹${entry.revenue.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="h-2 bg-[#F4F6F4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: isLoading ? '0%' : `${pct}%`, background: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Platform stats grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Hospitals',   value: totalHospitals,    color: '#E1F5EE', text: '#0F6E56' },
          { label: 'Total Doctors',     value: totalDoctors,      color: '#E6F1FB', text: '#1D63B5' },
          { label: 'Total Patients',    value: totalPatients,     color: '#EEEDFE', text: '#534AB7' },
          { label: 'Approval Rate',     value: `${approvalRate}%`, color: '#FEF3E2', text: '#B86E0A' },
        ].map((item) => (
          <div key={item.label}
               className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 w-16 bg-[#F4F6F4] rounded mb-2" />
                <div className="h-3 w-24 bg-[#F4F6F4] rounded" />
              </div>
            ) : (
              <>
                <div className="font-syne font-bold text-2xl text-[#1A2420]">
                  {typeof item.value === 'number'
                    ? item.value.toLocaleString()
                    : item.value}
                </div>
                <div className="text-xs text-[#8A9E98] mt-1">{item.label}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Hospital Status Donut + Breakdown */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <h3 className="font-semibold text-sm text-[#1A2420] mb-4">Hospital Status Distribution</h3>
        <div className="flex items-center gap-8">
          {/* Donut ring */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#F4F6F4" strokeWidth="3.5"/>
              {/* Verified arc */}
              <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#0F6E56" strokeWidth="3.5"
                      strokeDasharray={`${(verifiedPct / 100) * 100} ${100 - (verifiedPct / 100) * 100}`}
                      strokeLinecap="round"/>
              {/* Pending arc (offset after verified) */}
              <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#B86E0A" strokeWidth="3.5"
                      strokeDasharray={`${(pendingPct / 100) * 100} ${100 - (pendingPct / 100) * 100}`}
                      strokeDashoffset={`${-((verifiedPct / 100) * 100)}`}
                      strokeLinecap="round"
                      style={{
                        strokeDashoffset: `-${(verifiedPct / 100) * 100}`,
                      }}
                      />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-syne font-bold text-sm text-[#0F6E56]">{approvalRate}%</span>
              <span className="text-[9px] text-[#8A9E98]">verified</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'Verified',  count: verifiedHospitals, color: '#0F6E56', bg: '#E1F5EE' },
              { label: 'Pending',   count: pendingHospitals,  color: '#B86E0A', bg: '#FEF3E2' },
              { label: 'Rejected',  count: rejectedHospitals, color: '#A32D2D', bg: '#FCEBEB' },
              { label: 'Suspended', count: stats?.suspendedHospitals ?? 0, color: '#534AB7', bg: '#EEEDFE' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: item.color }} />
                <span className="text-sm text-[#4A5E58] flex-1">{item.label}</span>
                {isLoading
                  ? <div className="h-3 w-8 bg-[#F4F6F4] rounded animate-pulse" />
                  : <span className="font-semibold text-sm text-[#1A2420]"
                           style={{ color: item.color }}>
                      {item.count}
                    </span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <h3 className="font-syne font-bold text-base text-[#1A2420] mb-4">
          User Distribution
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Patients',  value: totalPatients,     color: '#E6F1FB', text: '#1D63B5' },
            { label: 'Doctors',   value: totalDoctors,      color: '#EEEDFE', text: '#534AB7' },
            { label: 'Hospitals', value: totalHospitals,    color: '#E1F5EE', text: '#0F6E56' },
          ].map(({ label, value, color, text }) => (
            <div key={label}
                 className="rounded-xl p-4 text-center"
                 style={{ background: color }}>
              <div className="font-syne font-bold text-2xl mb-1" style={{ color }}>
                {isLoading ? '...' : value.toLocaleString()}
              </div>
              <div className="text-xs font-medium" style={{ color }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
