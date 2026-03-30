'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon, MapPinIcon, ClockIcon, StarIcon } from '@/components/icons'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/shared/Badge'
import { Avatar } from '@/components/shared/Avatar'
import { doctorService } from '@/lib/services/doctorService'
import { Doctor } from '@clinicmind/types'
import { cn } from '@/lib/utils'

interface DoctorCardProps {
  doctor: Doctor & {
    hospitalName?: string
    rating?: number
  }
}

function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="h-1 bg-primary" />
      <div className="p-5">
        <div className="flex items-start space-x-3">
          <Avatar 
            fallback={doctor.name} 
            size="lg"
            className="bg-primary-light text-primary"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-text1 text-sm mb-1 truncate">
                Dr. {doctor.name}
              </h3>
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-amber-500 mr-1" />
                <span className="text-xs font-semibold text-amber-500">
                  {doctor.rating || '4.8'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-text3 text-xs mb-2">
              <MapPinIcon className="w-3 h-3 mr-1" />
              <span>{doctor.hospitalName || 'Unknown Hospital'}</span>
            </div>
            
            <div className="flex items-center text-text3 text-xs">
              <ClockIcon className="w-3 h-3 mr-1" />
              <span>{doctor.experience} years experience</span>
            </div>
          </div>
          
          <div className="mb-3">
            <Badge variant={doctor.isVerified ? 'success' : 'warning'}>
              {doctor.isVerified ? 'Verified' : 'Pending'}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {doctor.qualifications?.slice(0, 3).map((qual, index) => (
              <span key={index} className="bg-primary-light text-primary px-2 py-1 rounded text-xs">
                {qual}
              </span>
            ))}
          </div>
          
          {doctor.bio && (
            <p className="text-text3 text-sm line-clamp-2">
              {doctor.bio}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-primary font-semibold text-lg">
                ₹{doctor.consultationFee || '500'}
              </span>
              <span className="text-text3 text-xs">Consultation Fee</span>
            </div>
            <Button size="sm">
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function DoctorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gray-200" />
      <div className="p-5">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex space-x-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedHospital, setSelectedHospital] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['doctors', { search: searchQuery, specialization: selectedSpecialization, hospitalId: selectedHospital }],
    queryFn: () => doctorService.getPublicDoctors({
      search: searchQuery,
      specialization: selectedSpecialization,
      hospitalId: selectedHospital,
      page: 1,
      limit: 10
    }),
  })

  const { data: specializationsData } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => doctorService.getSpecializations(),
  })

  const doctors = data?.doctors || []
  const specializations = specializationsData?.specializations || []

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#094D3C] via-[#0F6E56] to-[#1a8a6a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="text-center">
            <h1 className="text-2xl md:text-5xl font-heading font-bold text-white mb-4 md:mb-6">
              Find Verified Doctors Near You
            </h1>
            <p className="text-sm md:text-lg text-white/70 mb-6 md:mb-8 max-w-2xl mx-auto">
              All our doctors are verified and ready to help you with expert medical care
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="bg-card py-4 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 text-text3 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors by name, specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-transparent border border-border rounded-lg text-text1 placeholder-text3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="w-full md:w-auto">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border border-border rounded-lg text-text1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
              >
                <option value="">All Specialties</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital Filter */}
            <div className="w-full md:w-auto">
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border border-border rounded-lg text-text1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm md:text-base"
              >
                <option value="">All Hospitals</option>
                {/* This would be populated dynamically from hospitals API */}
                <option value="apollo-hospitals-pune">Apollo Hospitals</option>
                <option value="continental-hyderabad-rajahmundry-179">Continental Hospitals</option>
                <option value="max-healthcare">Max Healthcare</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* DOCTORS GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-text1 mb-2">Failed to load doctors</h3>
              <p className="text-text3 mb-4">Please try again later</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-text1 mb-2">No doctors found</h3>
              <p className="text-text3 mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchQuery('')
                setSelectedSpecialization('')
                setSelectedHospital('')
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard 
                  key={doctor._id} 
                  doctor={{
                    ...doctor,
                    hospitalName: 'Apollo Hospitals', // This would be populated from hospital data
                    rating: 4.8
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
