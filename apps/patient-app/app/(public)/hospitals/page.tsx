'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SearchIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@/components/icons'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/shared/Badge'
import { Avatar } from '@/components/shared/Avatar'
import { hospitalService } from '@/lib/services/hospitalService'
import { Hospital } from '@clinicmind/types'
import { cn, debounce } from '@/lib/utils'

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
              <FilterIcon className="w-3 h-3 mr-1" />
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

export default function HospitalsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedSpecialization, setSelectedSpecialization] = useState(searchParams.get('specialization') || '')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL({ search: searchQuery, page: 1 })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const updateURL = (params: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, value.toString())
      }
    })
    
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization)
    setCurrentPage(1)
    updateURL({ specialization, page: 1 })
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    setCurrentPage(1)
    updateURL({ city, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL({ page })
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['hospitals', { 
      search: searchQuery, 
      specialization: selectedSpecialization,
      city: selectedCity,
      page: currentPage,
      limit: 12
    }],
    queryFn: () => hospitalService.getHospitals({ 
      search: searchQuery, 
      specialization: selectedSpecialization,
      city: selectedCity,
      page: currentPage,
      limit: 12
    }),
  })

  const hospitals = data?.hospitals || []
  const totalPages = data?.totalPages || 1
  const total = data?.total || 0

  const specializations = [
    { id: '', label: 'All Specialties' },
    { id: 'general-medicine', label: 'General Medicine' },
    { id: 'cardiology', label: 'Cardiology' },
    { id: 'orthopedic', label: 'Orthopedic' },
    { id: 'pediatrics', label: 'Pediatrics' },
    { id: 'dermatology', label: 'Dermatology' },
    { id: 'neurology', label: 'Neurology' },
  ]

  const cities = [
    { id: '', label: 'All Cities' },
    { id: 'mumbai', label: 'Mumbai' },
    { id: 'delhi', label: 'Delhi' },
    { id: 'bangalore', label: 'Bangalore' },
    { id: 'pune', label: 'Pune' },
    { id: 'chennai', label: 'Chennai' },
    { id: 'kolkata', label: 'Kolkata' },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text3" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Count Text */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text1 font-heading mb-2">
            Verified Hospitals
          </h1>
          <p className="text-text3">
            {total} {total === 1 ? 'hospital' : 'hospitals'} found
          </p>
        </div>

        {/* Specialization Filters */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {specializations.map((spec) => (
              <button
                key={spec.id}
                onClick={() => handleSpecializationChange(spec.id)}
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

        {/* Results Grid */}
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
              setSelectedCity('')
              setCurrentPage(1)
              updateURL({ search: '', specialization: '', city: '', page: 1 })
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-text3">
                  Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, total)} of {total} hospitals
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            "w-10 h-10 rounded-lg font-medium transition-colors",
                            currentPage === pageNum
                              ? "bg-primary text-white"
                              : "border border-border hover:bg-primary-light"
                          )}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
