'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'patients', search, page],
    queryFn: () => adminService.getAllPatients({
      search: search || undefined,
      page,
      limit: 20,
    }),
  })

  const patients:   any[]  = data?.data?.data?.patients   ?? []
  const total:      number = data?.data?.data?.total       ?? 0
  const totalPages: number = data?.data?.data?.totalPages  ?? 1

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-syne font-bold text-xl text-[#1A2420]">All Patients</h2>
          <p className="text-sm text-[#8A9E98] mt-0.5">
            {isLoading ? '...' : `${total} patients`} registered on platform
          </p>
        </div>
        <div className="relative">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, email or phone..."
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

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-[#F4F6F4] animate-pulse border-b border-[#E2E8E4]" />
          ))}
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] p-16 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="font-semibold text-[#1A2420]">No patients found</p>
          <p className="text-sm text-[#8A9E98] mt-1">
            {search ? 'Try a different search term' : 'No patients have registered yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F4F6F4] border-b border-[#E2E8E4]">
                {['Patient', 'Email', 'Phone', 'Status', 'Joined'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold
                                        text-[#4A5E58] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E4]">
              {patients.map((patient: any) => (
                <tr key={patient._id} className="hover:bg-[#F8FAF9] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center
                                      font-syne font-extrabold text-xs text-[#0F6E56] flex-shrink-0">
                        {patient.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#1A2420]">
                          {patient.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-[#8A9E98]">
                          ID: {patient._id?.slice(-8).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#4A5E58]">
                    {patient.email || 'N/A'}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#4A5E58]">
                    {patient.phone || 'N/A'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${patient.isActive !== false
                        ? 'bg-[#E1F5EE] text-[#0F6E56]'
                        : 'bg-[#F4F6F4] text-[#8A9E98]'}`}>
                      {patient.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#8A9E98]">
                    {patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8E4]">
            <span className="text-xs text-[#8A9E98]">
              Page {page} of {totalPages} · {total} patients total
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
              <span className="px-3 py-1.5 text-xs text-[#8A9E98]">
                {page} / {totalPages}
              </span>
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
        </div>
      )}
    </div>
  )
}
