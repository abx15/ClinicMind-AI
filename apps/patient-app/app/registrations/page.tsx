'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon, UserIcon, BuildingIcon, CheckIcon, ClockIcon, XIcon } from '@/components/icons'
import Navbar from '@/components/layout/Navbar'
import { LoadingSpinner } from '@/components/common/LoadingSkeleton'
import apiClient from '@/lib/apiClient'

export default function RegistrationStatusPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'hospitals' | 'patients'>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['registrations', filter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('type', filter)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await apiClient.get(`/admin/registrations?${params.toString()}`)
      return response.data
    },
  })

  const registrations = data?.data || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-heading mb-4">
              Registration Status
            </h1>
            <p className="text-primary-100 max-w-2xl mx-auto">
              Track all hospital and patient registrations
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg
                           text-text-primary placeholder-text-muted
                           bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All Registrations' },
                { key: 'hospitals', label: 'Hospitals' },
                { key: 'patients', label: 'Patients' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No registrations found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration: any) => (
              <div key={registration._id} className="card p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    registration.type === 'hospital'
                      ? 'bg-blue-100'
                      : 'bg-green-100'
                  }`}>
                    {registration.type === 'hospital' ? (
                      <BuildingIcon className="w-6 h-6 text-blue-600" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-green-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                          {registration.name}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {registration.type === 'hospital' ? 'Hospital' : 'Patient'} • {registration.email}
                        </p>
                        <p className="text-sm text-text-muted">{registration.phone}</p>
                        {registration.type === 'hospital' && registration.city && (
                          <p className="text-sm text-text-muted">{registration.city}, {registration.pincode}</p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          registration.status === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : registration.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : registration.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {registration.status === 'verified' && <CheckIcon className="w-3 h-3 mr-1" />}
                          {registration.status === 'pending' && <ClockIcon className="w-3 h-3 mr-1" />}
                          {registration.status === 'rejected' && <XIcon className="w-3 h-3 mr-1" />}
                          {registration.status || 'Unknown'}
                        </span>
                        <span className="text-xs text-text-muted">
                          {new Date(registration.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {registration.type === 'hospital' && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-muted">License:</span>
                            <span className="text-text-primary ml-2">{registration.licenseNumber}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Plan:</span>
                            <span className="text-text-primary ml-2 capitalize">{registration.plan || 'Free'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
