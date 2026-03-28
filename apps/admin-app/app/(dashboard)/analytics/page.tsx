'use client'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'

export default function AdminAnalyticsPage() {
  const { data } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn:  () => adminService.getPlatformStats(),
  })

  const stats = data?.data

  return (
    <div className="space-y-5">
      {/* MRR card */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-syne font-bold text-lg text-[#1A2420]">
              Monthly Revenue
            </h3>
            <p className="text-xs text-[#8A9E98] mt-0.5">Subscription MRR</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full
                           bg-[#E1F5EE] text-[#0F6E56]">
            ↑ 18% vs last month
          </span>
        </div>

        {/* Big MRR number */}
        <div className="font-syne font-extrabold text-4xl text-[#0F6E56] mb-1">
          ₹{((stats?.mrr || 374500) / 1000).toFixed(1)}K
        </div>
        <p className="text-sm text-[#8A9E98] mb-6">This month</p>

        {/* Plan breakdown bars */}
        <div className="space-y-3">
          {[
            { plan: 'Free plan',    count: 98,  pct: 69, color: '#E2E8E4', revenue: '₹0'      },
            { plan: 'Pro plan',     count: 38,  pct: 27, color: '#0F6E56', revenue: '₹94,962' },
            { plan: 'Growth plan',  count: 6,   pct: 4,  color: '#B86E0A', revenue: '₹35,994' },
          ].map((p) => (
            <div key={p.plan}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#4A5E58]">
                  {p.plan} ({p.count} hospitals)
                </span>
                <span className="font-medium text-[#1A2420]">{p.revenue}</span>
              </div>
              <div className="h-2 bg-[#F4F6F4] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${p.pct}%`, background: p.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform health grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Verified hospitals', value: stats?.verifiedHospitals || 134, color: '#E1F5EE', text: '#0F6E56' },
          { label: 'Total patients',     value: stats?.totalPatients || 24851,   color: '#E6F1FB', text: '#1D63B5' },
          { label: 'Platform uptime',    value: '99.8%',                          color: '#E1F5EE', text: '#0F6E56' },
        ].map((item) => (
          <div key={item.label}
               className="bg-white rounded-2xl border border-[#E2E8E4] p-5">
            <div className="font-syne font-bold text-2xl text-[#1A2420]">
              {item.value}
            </div>
            <div className="text-xs text-[#8A9E98] mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Verification progress donut (CSS-based) */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <h3 className="font-semibold text-sm text-[#1A2420] mb-4">
          Hospital verification rate
        </h3>
        <div className="flex items-center gap-8">
          {/* Donut ring */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#F4F6F4" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#0F6E56" strokeWidth="3"
                      strokeDasharray="75 25"
                      strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-syne font-bold text-sm text-[#0F6E56]">75%</span>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Verified',  count: 134, color: '#0F6E56' },
              { label: 'Pending',   count: 8,   color: '#B86E0A' },
              { label: 'Rejected',  count: 12,  color: '#A32D2D' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-sm">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }} />
                <span className="text-[#8A9E98]">{item.label}</span>
                <span className="font-semibold text-[#1A2420] ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights placeholder */}
      <div className="bg-white rounded-2xl border border-[#E2E8E4] p-6">
        <h3 className="font-syne font-bold text-lg text-[#1A2420] mb-4">
          AI-Powered Insights
        </h3>
        <div className="space-y-3">
          {[
            'Mumbai region shows 23% higher patient acquisition rate',
            'Cardiology specialization has fastest growth (45% this month)',
            'Weekend appointments increased by 18% across all hospitals',
            'Patient retention rate improved to 87% from 82% last quarter',
          ].map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-[#F4F6F4] rounded-xl">
              <span className="w-6 h-6 rounded-full bg-[#0F6E56] text-white text-xs
                           flex items-center justify-center font-bold flex-shrink-0">
                AI
              </span>
              <p className="text-sm text-[#4A5E58]">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
