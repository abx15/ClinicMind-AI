'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Phone, Mail, Globe, Star, CheckCircle, Users, Award } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import DoctorCard from '@/components/hospital/DoctorCard'
import BookingModal from '@/components/appointment/BookingModal'
import { DoctorCardSkeleton } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'
import { hospitalService } from '@/lib/services/hospitalService'
import { Doctor } from '@clinicmind/types'

export default function HospitalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('doctors')

  const { data: hospitalData, isLoading, error } = useQuery({
    queryKey: ['hospital', slug],
    queryFn: () => hospitalService.getHospitalBySlug(slug),
    enabled: !!slug,
  })

  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['hospital-doctors', hospitalData?.hospital?._id],
    queryFn: () => hospitalService.getHospitalDoctors(hospitalData?.hospital?._id || ''),
    enabled: !!hospitalData?.hospital?._id,
  })

  const hospital = hospitalData?.hospital
  const doctors = doctorsData?.doctors || []

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setIsBookingModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-border rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-border rounded w-1/2 mb-8"></div>
            <div className="card p-8">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-24 h-24 bg-border rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-border rounded w-1/2"></div>
                  <div className="h-4 bg-border rounded w-1/3"></div>
                  <div className="h-4 bg-border rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            title="Hospital not found"
            description="The hospital you're looking for doesn't exist or has been removed."
            actionLabel="Browse Hospitals"
            onAction={() => router.push('/hospitals')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-500 font-bold text-3xl font-heading">
                {hospital.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  {hospital.name}
                </h1>
                {hospital.status === 'verified' && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-text-muted mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{hospital.address}, {hospital.city}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>info@{hospital.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  <div>
                    <div className="font-semibold text-text-primary">{doctors.length}</div>
                    <div className="text-sm text-text-muted">Verified Doctors</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <div>
                    <div className="font-semibold text-text-primary">4.8</div>
                    <div className="text-sm text-text-muted">Rating</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-semibold text-text-primary capitalize">{hospital.plan}</div>
                    <div className="text-sm text-text-muted">Plan</div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-2">
                {['General Medicine', 'Cardiology', 'Orthopedic', 'Pediatrics'].map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            {['doctors', 'about', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-500'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'doctors' && (
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Verified Doctors</h2>
              
              {doctorsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DoctorCardSkeleton />
                  <DoctorCardSkeleton />
                  <DoctorCardSkeleton />
                </div>
              ) : doctors.length === 0 ? (
                <EmptyState
                  title="No doctors available"
                  description="This hospital doesn't have any verified doctors yet."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor: Doctor) => (
                    <DoctorCard
                      key={doctor._id}
                      doctor={{
                        ...doctor,
                        consultationFee: Math.floor(Math.random() * 1000) + 500, // Mock fee
                      }}
                      onBookAppointment={handleBookAppointment}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">About {hospital.name}</h2>
              <div className="prose max-w-none text-text-secondary">
                <p className="mb-4">
                  {hospital.name} is a leading healthcare institution committed to providing exceptional medical care 
                  to patients. With state-of-the-art facilities and a team of highly qualified healthcare professionals, 
                  we ensure comprehensive and compassionate treatment for all our patients.
                </p>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Our Mission</h3>
                <p className="mb-4">
                  To deliver world-class healthcare services with a focus on patient safety, comfort, and recovery. 
                  We strive to make quality healthcare accessible to all members of our community.
                </p>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Facilities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>24/7 Emergency Services</li>
                  <li>Advanced Diagnostic Center</li>
                  <li>Modern Operation Theaters</li>
                  <li>Intensive Care Units</li>
                  <li>Pharmacy Services</li>
                  <li>Ambulance Services</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Patient Reviews</h2>
              <EmptyState
                title="No reviews yet"
                description="Be the first to share your experience at this hospital."
              />
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedDoctor(null)
          }}
          doctor={selectedDoctor}
          hospitalId={hospital._id}
        />
      )}
    </div>
  )
}
