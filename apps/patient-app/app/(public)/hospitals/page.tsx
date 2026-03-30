'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { SearchIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import Navbar from '@/components/layout/Navbar'
import HospitalCard from '@/components/hospital/HospitalCard'
import FilterChips from '@/components/hospital/FilterChips'
import { HospitalCardSkeleton } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'
import { hospitalService } from '@/lib/services/hospitalService'

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

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-1 font-heading mb-2">
            Verified Hospitals
          </h1>
          <p className="text-text-3">
            {total} hospitals found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-2xl border border-border shadow-card p-6 sticky top-24">
              <h3 className="font-semibold text-text-1 mb-4 flex items-center">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filters
              </h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-2 mb-2">
                  Search
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-3" />
                  <input
                    type="text"
                    placeholder="Hospital name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-text-1 placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-2 mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-text-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSpecialization('')
                  setSelectedCity('')
                  setCurrentPage(1)
                  updateURL({ search: '', specialization: '', city: '', page: 1 })
                }}
                className="w-full border border-primary text-primary hover:bg-primary hover:text-white text-sm py-2 px-4 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Search & Filters */}
            <div className="lg:hidden mb-6 space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-3" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-text-1 placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary pl-10"
                />
              </div>
              
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-text-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>

            {/* Specialization Filters */}
            <div className="mb-8">
              <FilterChips onFilterChange={handleSpecializationChange} />
            </div>

            {/* Results */}
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
                  setSelectedCity('')
                  setCurrentPage(1)
                  updateURL({ search: '', specialization: '', city: '', page: 1 })
                }}
              />
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
                      }} 
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-text-3">
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
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-primary text-white'
                                  : 'border border-border hover:bg-primary-light'
                              }`}
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
      </div>
    </div>
  )
}
