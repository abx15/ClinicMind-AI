'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon, MapPinIcon, UsersIcon, StarIcon, TrendingUpIcon } from '@/components/icons'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/shared/Badge'
import { Avatar } from '@/components/shared/Avatar'
import { hospitalService } from '@/lib/services/hospitalService'
import { Hospital } from '@clinicmind/types'
import { cn } from '@/lib/utils'

interface HospitalCardProps {
  hospital: Hospital & {
    doctorCount?: number
    specializations?: string[]
    rating?: number
  }
}

function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* 4px accent bar at top */}
      <div className="h-1 bg-primary" />
      
      <div className="p-5">
        {/* Hospital info row */}
        <div className="flex items-start space-x-3 mb-4">
          <Avatar 
            fallback={hospital.name} 
            size="lg"
            className="bg-primary-light text-primary"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text1 text-sm mb-1 truncate">
              {hospital.name}
            </h3>
            <div className="flex items-center text-text3 text-xs mb-2">
              <MapPinIcon className="w-3 h-3 mr-1" />
              {hospital.city}
            </div>
            <div className="flex items-center">
              <StarIcon className="w-3 h-3 text-amber-500 mr-1" />
              <span className="text-xs font-semibold text-amber-500">
                {hospital.rating || '4.5'}
              </span>
            </div>
          </div>
        </div>

        {/* Specialization tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(hospital.specializations || ['General Medicine', 'Cardiology', 'Orthopedic']).slice(0, 3).map((spec) => (
            <Badge key={spec} variant="default" size="sm">
              {spec}
            </Badge>
          ))}
        </div>

        {/* Doctor count */}
        <div className="text-xs text-text3 mb-4">
          {hospital.doctorCount || Math.floor(Math.random() * 20) + 5} doctors
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-4" />

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            Book Appointment
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            View Doctors
          </Button>
        </div>
      </div>
    </Card>
  )
}

function HospitalCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-border" />
      <div className="p-5">
        <div className="flex items-start space-x-3 mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="flex space-x-2 mb-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-3 w-16 mb-4" />
        <div className="border-t border-border mb-4" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="h-8 flex-1 rounded-lg" />
        </div>
      </div>
    </Card>
  )
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['hospitals', { search: searchQuery, specialization: selectedSpecialization }],
    queryFn: () => hospitalService.getHospitals({ 
      search: searchQuery, 
      specialization: selectedSpecialization 
    }),
  })

  const hospitals = data?.data || []

  const specializations = [
    { id: '', label: 'All Specialties' },
    { id: 'general-medicine', label: 'General Medicine' },
    { id: 'cardiology', label: 'Cardiology' },
    { id: 'orthopedic', label: 'Orthopedic' },
    { id: 'pediatrics', label: 'Pediatrics' },
    { id: 'dermatology', label: 'Dermatology' },
    { id: 'neurology', label: 'Neurology' },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#094D3C] via-[#0F6E56] to-[#1a8a6a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center">
            <h1 className="text-2xl md:text-5xl font-heading font-bold text-white mb-4 md:mb-6">
              Find Verified Hospitals and Doctors Near You
            </h1>
            <p className="text-sm md:text-lg text-white/70 mb-6 md:mb-8 max-w-2xl mx-auto">
              All hospitals verified by ClinicMind. Book appointments in 30 seconds.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 md:mb-12">
              <div className="bg-white rounded-2xl border border-border shadow-lg h-14 md:h-16 flex items-center">
                <div className="flex-1 flex items-center px-4">
                  <SearchIcon className="w-5 h-5 text-text3 mr-3" />
                  <input
                    type="text"
                    placeholder="Search hospitals, doctors, specialization, city…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-2 bg-transparent text-text1 placeholder-text3 outline-none text-sm md:text-base"
                  />
                </div>
                <Button className="h-full rounded-l-none rounded-r-2xl px-6">
                  Search
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-heading font-bold text-white mb-1">
                  142+
                </div>
                <div className="text-xs md:text-sm text-white/70">Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-heading font-bold text-white mb-1">
                  1,248
                </div>
                <div className="text-xs md:text-sm text-white/70">Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-heading font-bold text-white mb-1">
                  24K+
                </div>
                <div className="text-xs md:text-sm text-white/70">Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-heading font-bold text-white mb-1 flex items-center justify-center">
                  4.8
                  <StarIcon className="w-4 h-4 md:w-5 md:h-5 ml-1 fill-current text-amber-400" />
                </div>
                <div className="text-xs md:text-sm text-white/70">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER CHIPS ROW */}
      <section className="bg-card py-4 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {specializations.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialization(spec.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                  selectedSpecialization === spec.id
                    ? "bg-primary text-white border-primary"
                    : "bg-card text-text2 border-border hover:border-primary hover:text-primary"
                )}
              >
                {spec.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOSPITAL CARDS GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <HospitalCardSkeleton />
              <HospitalCardSkeleton />
              <HospitalCardSkeleton />
              <HospitalCardSkeleton />
              <HospitalCardSkeleton />
              <HospitalCardSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-text1 mb-2">Failed to load hospitals</h3>
              <p className="text-text3 mb-4">Please try again later</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : hospitals.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-text1 mb-2">No hospitals found</h3>
              <p className="text-text3 mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchQuery('')
                setSelectedSpecialization('')
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <HospitalCard 
                  key={hospital._id} 
                  hospital={{
                    ...hospital,
                    doctorCount: Math.floor(Math.random() * 20) + 5,
                    specializations: ['General Medicine', 'Cardiology', 'Orthopedic'],
                    rating: 4.5 + Math.random() * 0.5,
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
