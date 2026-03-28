'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/services/adminService'
import DataTable from '@/components/common/DataTable'

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState('')
  const [hospitalFilter, setHospitalFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'doctors', hospitalFilter, search],
    queryFn: () => adminService.getAllDoctors({
      hospitalId: hospitalFilter || undefined,
      page: 1,
    }),
  })

  const doctors = data?.data?.doctors || []

  const columns = [
    {
      key: 'name',
      label: 'Doctor Name',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center
                          font-syne font-extrabold text-sm text-[#1D63B5]">
            {value?.charAt(0) || 'D'}
          </div>
          <div>
            <div className="font-semibold text-sm text-[#1A2420]">{value || 'Unknown'}</div>
            <div className="text-xs text-[#8A9E98]">{row.email || 'N/A'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'specialization',
      label: 'Specialization',
      render: (value: any) => (
        <span className="text-sm text-[#4A5E58]">{value || 'General'}</span>
      ),
    },
    {
      key: 'hospital',
      label: 'Hospital',
      render: (value: any, row: any) => (
        <div>
          <div className="text-sm font-medium text-[#1A2420]">{row.hospitalName || 'N/A'}</div>
          <div className="text-xs text-[#8A9E98]">{row.hospitalCity || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'isVerified',
      label: 'Verified',
      render: (value: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${value ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#FEF3E2] text-[#B86E0A]'}`}>
          {value ? 'Verified' : 'Pending'}
        </span>
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
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-syne font-bold text-xl text-[#1A2420]">
            All Doctors
          </h2>
          <p className="text-sm text-[#8A9E98] mt-0.5">
            {doctors.length} doctors across all hospitals
          </p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors..."
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

      {/* Hospital filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-[#4A5E58]">Filter by hospital:</label>
        <select
          value={hospitalFilter}
          onChange={(e) => setHospitalFilter(e.target.value)}
          className="px-3 py-1.5 border border-[#E2E8E4] rounded-lg text-sm
                     text-[#1A2420] bg-white outline-none focus:border-[#0F6E56]"
        >
          <option value="">All Hospitals</option>
          {/* This would be populated with actual hospitals */}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={doctors}
        isLoading={isLoading}
        emptyText="No doctors found"
      />
    </div>
  )
}
