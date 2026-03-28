'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'
import DataTable from '@/components/common/DataTable'

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'patients', search],
    queryFn: () => adminService.getAllPatients({
      search: search || undefined,
      page: 1,
    }),
  })

  const patients = data?.data?.patients || []

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center
                          font-syne font-extrabold text-sm text-[#0F6E56]">
            {value?.charAt(0) || 'P'}
          </div>
          <div>
            <div className="font-semibold text-sm text-[#1A2420]">{value || 'Unknown'}</div>
            <div className="text-xs text-[#8A9E98]">ID: {row.patientId || 'N/A'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: any) => (
        <span className="text-sm text-[#4A5E58]">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: any) => (
        <span className="text-sm text-[#4A5E58]">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined Date',
      render: (value: any) => (
        <span className="text-sm text-[#8A9E98]">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'appointmentCount',
      label: 'Appointments',
      render: (value: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                         bg-[#E6F1FB] text-[#1D63B5]">
          {value || 0} appointments
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-syne font-bold text-xl text-[#1A2420]">
            All Patients
          </h2>
          <p className="text-sm text-[#8A9E98] mt-0.5">
            {patients.length} patients registered on platform
          </p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="w-64 pl-9 pr-4 py-2 border border-[#E2E8E4] rounded-xl text-sm
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
      <DataTable
        columns={columns}
        data={patients}
        isLoading={isLoading}
        emptyText="No patients found"
      />
    </div>
  )
}
