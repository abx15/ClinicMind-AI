'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Search, Users, MapPin, Building, Calendar, Clock } from 'lucide-react'
import { hospitalService } from '@/lib/services/hospitalService'
import { Hospital } from '@clinicmind/types'
import HospitalCard from '@/components/hospital/HospitalCard'
import DoctorCard from '@/components/hospital/DoctorCard'
import EmptyState from '@/components/common/EmptyState'
import { HospitalCardSkeleton } from '@/components/common/LoadingSkeleton'

export default function SearchPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors'>('hospitals')
  const [doctorSearch, setDoctorSearch] = useState('')
  const [citySearch, setCitySearch] = useState('')
  const [debouncedDoctorSearch, setDebouncedDoctorSearch] = useState('')
  const [debouncedCitySearch, setDebouncedCitySearch] = useState('')

  // Debounce search inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDoctorSearch(doctorSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [doctorSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCitySearch(citySearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [citySearch])

  // Mock doctors data (since we don't have a real doctor search API)
  const mockDoctors = [
    {
      _id: 'doc_1',
      userId: 'user_1',
      hospitalId: 'hospital_1',
      name: 'Dr. Priya Sharma',
      specialization: 'Cardiology',
      qualifications: ['MBBS', 'MD', 'DM'],
      experience: 8,
      consultationFee: 800,
      isVerified: true,
      isPublic: true,
      createdAt: new Date(),
    },
    {
      _id: 'doc_2',
      userId: 'user_2',
      hospitalId: 'hospital_2',
      name: 'Dr. Rahul Verma',
      specialization: 'General Medicine',
      qualifications: ['MBBS', 'MD'],
      experience: 12,
      consultationFee: 500,
      isVerified: true,
      isPublic: true,
      createdAt: new Date(),
    },
    {
      _id: 'doc_3',
      userId: 'user_3',
      hospitalId: 'hospital_1',
      name: 'Dr. Anjali Patel',
      specialization: 'Pediatrics',
      qualifications: ['MBBS', 'MD'],
      experience: 6,
      consultationFee: 600,
      isVerified: true,
      isPublic: true,
      createdAt: new Date(),
    },
    {
      _id: 'doc_4',
      userId: 'user_4',
      hospitalId: 'hospital_3',
      name: 'Dr. Vikram Singh',
      specialization: 'Orthopedics',
      qualifications: ['MBBS', 'MS'],
      experience: 15,
      consultationFee: 900,
      isVerified: true,
      isPublic: true,
      createdAt: new Date(),
    },
    {
      _id: 'doc_5',
      userId: 'user_5',
      hospitalId: 'hospital_2',
      name: 'Dr. Neha Gupta',
      specialization: 'Dermatology',
      qualifications: ['MBBS', 'MD'],
      experience: 10,
      consultationFee: 700,
      isVerified: true,
      isPublic: true,
      createdAt: new Date(),
    },
  ]

  // Fetch hospitals
  const { data: hospitalsData, isLoading: isLoadingHospitals, error: hospitalsError } = useQuery({
    queryKey: ['hospitals', 'search', debouncedCitySearch],
    queryFn: () => hospitalService.getHospitals({ city: debouncedCitySearch }),
    enabled: activeTab === 'hospitals',
  })

  // Filter doctors based on search
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesDoctor = !debouncedDoctorSearch || 
      doctor.name.toLowerCase().includes(debouncedDoctorSearch.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(debouncedDoctorSearch.toLowerCase())
    
    const matchesCity = !debouncedCitySearch || 
      doctor.name.toLowerCase().includes(debouncedCitySearch.toLowerCase()) // Mock city filtering
    
    return matchesDoctor && matchesCity
  })

  const hospitals = hospitalsData?.hospitals || []
  const doctors = filteredDoctors

  const handleHospitalClick = (hospital: Hospital) => {
    router.push(`/hospitals/${hospital.slug}`)
  }

  const handleBookAppointment = (doctorId: string) => {
    // For now, redirect to hospitals page
    // In a real implementation, this would open a booking modal
    router.push('/hospitals')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary font-heading">
          Search
        </h1>
        <p className="text-text-muted">
          Find hospitals and doctors near you
        </p>
      </div>

      {/* Search Inputs */}
      <div className="bg-white rounded-card p-6 mb-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Search by Doctor Name / Specialization
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="e.g. Dr. Priya Sharma, Cardiology, Pediatrics..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Search by City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="e.g. Mumbai, Delhi, Bangalore..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {(['hospitals', 'doctors'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Results */}
      <div>
        {activeTab === 'hospitals' ? (
          <div>
            {isLoadingHospitals ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <HospitalCardSkeleton />
                <HospitalCardSkeleton />
                <HospitalCardSkeleton />
              </div>
            ) : hospitalsError ? (
              <EmptyState
                title="Failed to load hospitals"
                description="Please try again later"
                actionLabel="Try again"
                onAction={() => window.location.reload()}
              />
            ) : hospitals.length === 0 ? (
              <EmptyState
                title="No hospitals found"
                description="Try adjusting your search criteria or check back later"
                icon={
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {hospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital._id}
                    hospital={hospital}
                    onClick={() => handleHospitalClick(hospital)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {doctors.length === 0 ? (
              <EmptyState
                title="No doctors found"
                description="Try adjusting your search criteria or check back later"
                icon={
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    onBook={() => handleBookAppointment(doctor._id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Search Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-text-secondary mb-2">For Hospitals:</h4>
            <ul className="space-y-1 text-sm text-text-muted">
              <li>• Search by hospital name (e.g., Apollo, Fortis)</li>
              <li>• Search by city (e.g., Mumbai, Delhi)</li>
              <li>• Search by specialization (e.g., Cardiology, Pediatrics)</li>
              <li>• Use partial names for better results</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text-secondary mb-2">For Doctors:</h4>
            <ul className="space-y-1 text-sm text-text-muted">
              <li>• Search by doctor name (e.g., Dr. Sharma)</li>
              <li>• Search by specialization (e.g., Cardiologist)</li>
              <li>• Search by medical condition (e.g., Heart, Skin)</li>
              <li>• Combine search terms for specific results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
