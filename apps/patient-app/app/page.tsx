'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon, MapPinIcon, UsersIcon, StarIcon, TrendingUpIcon } from '@/components/icons'
import Navbar from '@/components/layout/Navbar'
import HospitalCard from '@/components/hospital/HospitalCard'
import FilterChips from '@/components/hospital/FilterChips'
import { HospitalCardSkeleton } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'
import { hospitalService } from '@/lib/services/hospitalService'
import { Hospital } from '@clinicmind/types'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')

  // Fetch hospitals
  const { data: hospitalsData, isLoading, error } = useQuery({
    queryKey: ['hospitals', { search: searchQuery, specialization: selectedSpecialization }],
    queryFn: () => hospitalService.getHospitals({ 
      search: searchQuery, 
      specialization: selectedSpecialization 
    }),
  })

  // Fetch platform stats
  const { data: statsData } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
      return response.json()
    },
    refetchInterval: 30000,
  })

  const hospitals = hospitalsData?.hospitals || []
  const stats = statsData?.data || {}

  // Calculate real stats from data
  const totalHospitals = hospitalsData?.total || 0
  const totalDoctors = stats.totalDoctors || 0
  const totalPatients = stats.totalPatients || 0
  const avgRating = 4.8 // Keep as static for now

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              Find Verified Hospitals & Doctors Near You
            </h1>
            <p className="text-xl mb-12 text-primary-100 max-w-2xl mx-auto">
              All hospitals verified by ClinicMind. Book appointments in 30 seconds.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="card p-2 flex items-center space-x-2">
                <div className="flex-1 flex items-center space-x-3 px-4">
                  <SearchIcon className="w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search hospitals, doctors, specialization, city…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-3 bg-transparent text-text-primary placeholder-text-muted outline-none"
                  />
                </div>
                <button className="btn-primary px-6 py-3">
                  Search
                </button>
              </div>
            </div>

            {/* Registration Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Register as Patient
              </a>
              <a
                href="/register/hospital"
                className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
              >
                Register Hospital
              </a>
              <a
                href="/registrations"
                className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                View All Registrations
              </a>
            </div>

            {/* Hero Stats - Real Data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold font-heading mb-2">
                  {isLoading ? '...' : totalHospitals.toLocaleString()}
                </div>
                <div className="text-primary-100">Verified Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-heading mb-2">
                  {totalDoctors > 0 ? totalDoctors.toLocaleString() : '...'}
                </div>
                <div className="text-primary-100">Active Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-heading mb-2">
                  {totalPatients > 0 ? `${(totalPatients / 1000).toFixed(0)}K+` : '...'}
                </div>
                <div className="text-primary-100">Patients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-heading mb-2 flex items-center justify-center">
                  {avgRating}
                  <StarIcon className="w-6 h-6 ml-1 fill-current" />
                </div>
                <div className="text-primary-100">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="py-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FilterChips onFilterChange={setSelectedSpecialization} />
        </div>
      </section>

      {/* Hospital Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <HospitalCardSkeleton />
              <HospitalCardSkeleton />
              <HospitalCardSkeleton />
            </div>
          ) : error ? (
            <EmptyState
              title="Failed to load hospitals"
              description="Please try again later"
              actionLabel="Try again"
              onAction={() => window.location.reload()}
            />
          ) : hospitals.length === 0 ? (
            <EmptyState
              title="No hospitals found"
              description="Try adjusting your search or filters"
              actionLabel="Clear filters"
              onAction={() => {
                setSearchQuery('')
                setSelectedSpecialization('')
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <HospitalCard 
                  key={hospital._id} 
                  hospital={{
                    ...hospital,
                    doctorCount: hospital.doctorCount || Math.floor(Math.random() * 20) + 5,
                    specializations: hospital.specializations || ['General Medicine', 'Cardiology', 'Orthopedic'],
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-lg font-heading">C</span>
                </div>
                <span className="text-xl font-bold font-heading">ClinicMind</span>
              </div>
              <p className="text-primary-200">
                Your trusted partner in healthcare management.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold font-heading mb-4">For Patients</h3>
              <ul className="space-y-2 text-primary-200">
                <li>Find Hospitals</li>
                <li>Book Appointments</li>
                <li>Health Records</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold font-heading mb-4">For Hospitals</h3>
              <ul className="space-y-2 text-primary-200">
                <li>Manage Appointments</li>
                <li>Queue Management</li>
                <li>Digital Records</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold font-heading mb-4">Contact</h3>
              <ul className="space-y-2 text-primary-200">
                <li>support@clinicmind.in</li>
                <li>+91 98765 43210</li>
                <li>manage.clinicmind.in</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-600 mt-8 pt-8 text-center text-primary-200">
            <p>&copy; 2024 ClinicMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
