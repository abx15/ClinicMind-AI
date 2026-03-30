'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon, UserIcon, MapPinIcon, StarIcon, PhoneIcon } from '@/components/icons'
import Navbar from '@/components/layout/Navbar'
import { DoctorCardSkeleton, LoadingSpinner } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'
import apiClient from '@/lib/apiClient'

interface Doctor {
  _id: string
  name: string
  email: string
  phone: string
  specialization: string
  qualifications: string[]
  experience: number
  consultationFee: number
  bio?: string
  isVerified: boolean
  isPublic: boolean
  hospitalId: string
  hospitalName: string
  hospitalCity: string
  createdAt: string
}

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['doctors', { search: searchQuery, specialization: selectedSpecialization, city: selectedCity }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedSpecialization) params.append('specialization', selectedSpecialization)
      if (selectedCity) params.append('city', selectedCity)
      
      const response = await apiClient.get(`/doctors?${params.toString()}`)
      return response.data
    },
  })

  const doctors: Doctor[] = data?.doctors || []

  // Extract unique specializations and cities for filters
  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))]
  const cities = [...new Set(doctors.map(d => d.hospitalCity).filter(Boolean))]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-heading mb-4">
              Find Verified Doctors
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Connect with experienced doctors across multiple specializations
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search doctors by name, specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg
                           text-text-primary placeholder-text-muted
                           bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg
                       text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg
                       text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Failed to load doctors"
            description="Please try again later"
            actionLabel="Try again"
            onAction={() => window.location.reload()}
          />
        ) : doctors.length === 0 ? (
          <EmptyState
            title="No doctors found"
            description="Try adjusting your search or filters"
            actionLabel="Clear filters"
            onAction={() => {
              setSearchQuery('')
              setSelectedSpecialization('')
              setSelectedCity('')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="card p-6 hover:shadow-lg transition-shadow">
                {/* Doctor Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        Dr. {doctor.name}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${doctor.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'}`}>
                    {doctor.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                {/* Hospital Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{doctor.hospitalName}, {doctor.hospitalCity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{doctor.phone}</span>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-text-primary mb-1">Qualifications</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.qualifications?.slice(0, 2).map((qual, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {qual}
                      </span>
                    ))}
                    {doctor.qualifications?.length > 2 && (
                      <span className="text-xs text-text-muted">
                        +{doctor.qualifications.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Experience and Fee */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-text-muted">
                    {doctor.experience} years experience
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text-primary">
                      ₹{doctor.consultationFee}
                    </div>
                    <div className="text-xs text-text-muted">Consultation</div>
                  </div>
                </div>

                {/* Bio */}
                {doctor.bio && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-text-muted line-clamp-2">
                      {doctor.bio}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button className="w-full mt-4 btn-primary">
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
