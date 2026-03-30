'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'

export default function AdminDoctorsPage() {
  const [search,        setSearch]        = useState('')
  const [hospitalFilter, setHospitalFilter] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'doctors', search, hospitalFilter, verifiedFilter, page],
    queryFn: () => adminService.getAllDoctors({
      hospitalId: hospitalFilter || undefined,
      isVerified: verifiedFilter === 'all' ? undefined
        : verifiedFilter === 'verified',
      search:  search   || undefined,
      page,
      limit: 20,
    }),
  })

  // For populating hospital dropdown
  const { data: hospitalsRes } = useQuery({
    queryKey: ['admin', 'hospitals', 'all'],
    queryFn: () => adminService.getAllHospitals({ status: undefined, limit: 200 }),
  })

  const doctors:   any[]  = data?.data?.data?.doctors    ?? []
  const total:     number = data?.data?.data?.total       ?? 0
  const totalPages:number = data?.data?.data?.totalPages  ?? 1
  const allHospitals: any[] = hospitalsRes?.data?.data?.hospitals ?? []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-syne font-bold text-xl text-[#1A2420]">All Doctors</h2>
          <p className="text-sm text-[#8A9E98] mt-0.5">
            {isLoading ? '...' : `${total} doctors`} across all hospitals
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name or specialization..."
            className="w-72 pl-9 pr-4 py-2 border border-[#E2E8E4] rounded-xl text-sm
                       text-[#1A2420] placeholder:text-[#8A9E98] bg-white outline-none
                       focus:border-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56]/10"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-[#8A9E98]"
               viewBox="0 0 16 16" fill="currentColor">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor"
                    strokeWidth="1.5" fill="none"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#4A5E58]">Hospital:</label>
          <select
            value={hospitalFilter}
            onChange={(e) => { setHospitalFilter(e.target.value); setPage(1) }}
            className="px-3 py-1.5 border border-[#E2E8E4] rounded-lg text-sm
                       text-[#1A2420] bg-white outline-none focus:border-[#0F6E56]"
          >
            <option value="">All Hospitals</option>
            {allHospitals.map((h: any) => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-1.5">
          {(['all', 'verified', 'unverified'] as const).map(v => (
            <button
              key={v}
              onClick={() => { setVerifiedFilter(v); setPage(1) }}
              className={[
                'px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize',
                verifiedFilter === v
                  ? 'bg-[#0F6E56] text-white'
                  : 'bg-white border border-[#E2E8E4] text-[#8A9E98] hover:text-[#4A5E58]',
              ].join(' ')}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-[#F4F6F4] animate-pulse border-b border-[#E2E8E4]" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-16 text-center">
          <div className="text-4xl mb-3">👨‍⚕️</div>
          <p className="font-semibold text-[#1A2420]">No doctors found</p>
          <p className="text-sm text-[#8A9E98] mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F4F6F4] border-b border-[#E2E8E4]">
                {['Doctor', 'Specialization', 'Hospital', 'Verified', 'Fee', 'Joined'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold
                                        text-[#4A5E58] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E4]">
              {doctors.map((doctor: any) => (
                <tr key={doctor._id} className="hover:bg-[#F8FAF9] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center
                                      font-syne font-extrabold text-xs text-[#1D63B5] flex-shrink-0">
                        {doctor.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#1A2420]">
                          Dr. {doctor.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-[#8A9E98]">{doctor.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#4A5E58]">
                    {doctor.specialization || 'General'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-[#1A2420]">
                      {doctor.hospitalName || 'N/A'}
                    </div>
                    <div className="text-xs text-[#8A9E98]">{doctor.hospitalCity || ''}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${doctor.isVerified
                        ? 'bg-[#E1F5EE] text-[#0F6E56]'
                        : 'bg-[#FEF3E2] text-[#B86E0A]'}`}>
                      {doctor.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#4A5E58]">
                    {doctor.consultationFee
                      ? `₹${doctor.consultationFee}`
                      : 'N/A'}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#8A9E98]">
                    {doctor.createdAt
                      ? new Date(doctor.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8E4]">
              <span className="text-xs text-[#8A9E98]">
                Page {page} of {totalPages} · {total} doctors total
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium border border-[#E2E8E4] rounded-lg
                             disabled:opacity-40 hover:bg-[#F4F6F4] transition-colors"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-medium border border-[#E2E8E4] rounded-lg
                             disabled:opacity-40 hover:bg-[#F4F6F4] transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
