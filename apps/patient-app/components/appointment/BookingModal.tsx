'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { XIcon, CalendarIcon, ClockIcon, UserIcon, FileTextIcon, SearchIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { toast } from 'sonner'
import { Doctor, Appointment } from '@clinicmind/types'
import { useIsAuthenticated } from '@/stores/authStore'
import { appointmentService } from '@/lib/services/appointmentService'
import { Hospital } from '@clinicmind/types'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  hospitals?: Hospital[]
  doctor?: Doctor
  hospitalId?: string
}

interface BookingData {
  hospitalId: string
  doctorId: string
  date: string
  timeSlot: string
  notes: string
}

interface DoctorWithFee extends Doctor {
  consultationFee?: number
}

export default function BookingModal({ isOpen, onClose, hospitals = [], doctor, hospitalId }: BookingModalProps) {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    hospitalId: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    notes: ''
  })
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWithFee | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Generate next 7 days
  const getNext7Days = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    return days
  }

  // Generate time slots
  const getTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  // Fetch available slots when doctor and date selected
  const { data: slotsData } = useQuery({
    queryKey: ['available-slots', selectedDoctor?._id, bookingData.date],
    queryFn: () => {
      if (selectedDoctor && bookingData.date) {
        return appointmentService.getAvailableSlots(selectedDoctor._id, bookingData.date)
      }
      return { slots: [] }
    },
    enabled: !!(selectedDoctor && bookingData.date),
  })

  // Mock doctors for hospital
  const getMockDoctors = (hospitalId: string): DoctorWithFee[] => {
    return [
      {
        _id: `doc_${hospitalId}_1`,
        userId: 'user_1',
        hospitalId,
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
        _id: `doc_${hospitalId}_2`,
        userId: 'user_2',
        hospitalId,
        name: 'Dr. Rahul Verma',
        specialization: 'General Medicine',
        qualifications: ['MBBS', 'MD'],
        experience: 12,
        consultationFee: 500,
        isVerified: true,
        isPublic: true,
        createdAt: new Date(),
      },
    ]
  }

  const hospitalMutation = useMutation({
    mutationFn: (data: BookingData) => appointmentService.bookAppointment(data),
    onSuccess: () => {
      toast.success('Appointment booked successfully!')
      onClose()
      router.push('/dashboard/appointments')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to book appointment')
    },
  })

  const handleDateSelect = (date: string) => {
    setBookingData(prev => ({ ...prev, date }))
    setCurrentStep(2)
    // Reset time slot when date changes
    setBookingData(prev => ({ ...prev, timeSlot: '' }))
  }

  const handleTimeSelect = (timeSlot: string) => {
    setBookingData(prev => ({ ...prev, timeSlot }))
    setCurrentStep(3)
  }

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital)
    setSelectedDoctor(null)
    setBookingData(prev => ({ ...prev, hospitalId: hospital._id, doctorId: '', date: '', timeSlot: '' }))
    setCurrentStep(1)
  }

  const handleDoctorSelect = (doctor: DoctorWithFee) => {
    setSelectedDoctor(doctor)
    setBookingData(prev => ({ ...prev, doctorId: doctor._id, date: '', timeSlot: '' }))
    setCurrentStep(1)
  }

  const handleConfirmBooking = () => {
    if (!bookingData.hospitalId || !bookingData.doctorId || !bookingData.date || !bookingData.timeSlot) {
      toast.error('Please select hospital, doctor, date and time')
      return
    }
    hospitalMutation.mutate(bookingData)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const doctors = selectedHospital ? getMockDoctors(selectedHospital._id) : []

  if (!isOpen) return null

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 rounded-t-card">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary font-heading">
              Book Appointment
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <XIcon className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Hospital & Doctor */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <SearchIcon className="w-5 h-5 mr-2" />
                Select Hospital & Doctor
              </h3>
              
              {/* Hospital Search */}
              <div className="mb-6">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search hospitals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              {/* Hospital List */}
              <div className="mb-6 max-h-48 overflow-y-auto">
                {filteredHospitals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-text-muted">No hospitals found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredHospitals.map((hospital) => (
                      <button
                        key={hospital._id}
                        onClick={() => handleHospitalSelect(hospital)}
                        className={`w-full text-left p-4 border rounded-lg transition-colors ${
                          selectedHospital?._id === hospital._id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-border hover:border-primary-500 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-500 font-bold">
                                {hospital.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-text-primary">{hospital.name}</p>
                              <p className="text-sm text-text-muted">{hospital.city}</p>
                            </div>
                          </div>
                          <ChevronRightIcon className="w-5 h-5 text-text-muted" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Doctor Selection */}
              {selectedHospital && (
                <div>
                  <h4 className="font-medium text-text-primary mb-4">
                    Select Doctor from {selectedHospital.name}
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor._id}
                        onClick={() => handleDoctorSelect(doctor)}
                        className={`w-full text-left p-4 border rounded-lg transition-colors ${
                          selectedDoctor?._id === doctor._id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-border hover:border-primary-500 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-bold">
                                {doctor.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-text-primary">{doctor.name}</p>
                              <p className="text-sm text-text-muted">{doctor.specialization}</p>
                              <p className="text-sm font-medium text-primary-500">
                                ₹{doctor.consultationFee} per consultation
                              </p>
                            </div>
                          </div>
                          <ChevronRightIcon className="w-5 h-5 text-text-muted" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Select Date & Time
              </h3>
              
              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Select Date</h4>
                <div className="grid grid-cols-7 gap-2">
                  {getNext7Days().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(formatDateString(date))}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        bookingData.date === formatDateString(date)
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-border hover:border-primary-500 hover:bg-primary-50'
                      }`}
                    >
                      <div className="text-xs text-text-muted">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="font-semibold">
                        {date.getDate()}
                      </div>
                      <div className="text-xs text-text-muted">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              {bookingData.date && (
                <div>
                  <h4 className="font-medium text-text-primary mb-3">Select Time Slot</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {getTimeSlots().map((time) => {
                      const isBooked = slotsData?.slots?.includes(time)
                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && handleTimeSelect(time)}
                          disabled={isBooked}
                          className={`p-3 rounded-lg border text-sm transition-colors ${
                            isBooked
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                              : 'border-border hover:border-primary-500 hover:bg-primary-50'
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                  {slotsData?.slots?.length > 0 && (
                    <p className="text-sm text-text-muted mt-2">
                      {slotsData.slots.length} slots already booked
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => setCurrentStep(1)}
                className="btn-outline"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <FileTextIcon className="w-5 h-5 mr-2" />
                Confirm Details
              </h3>
              
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Hospital:</span>
                    <span className="font-medium">
                      {hospitals.find(h => h._id === bookingData.hospitalId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Doctor:</span>
                    <span className="font-medium">
                      {doctors.find(d => d._id === bookingData.doctorId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Date:</span>
                    <span className="font-medium">{bookingData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Time:</span>
                    <span className="font-medium">{bookingData.timeSlot}</span>
                  </div>
                  {selectedDoctor?.consultationFee && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Consultation Fee:</span>
                      <span className="font-medium">
                        ₹{selectedDoctor.consultationFee}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe your symptoms or reason for visit..."
                  className="input-field resize-none"
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-outline"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={hospitalMutation.isPending}
                  className="btn-primary flex-1"
                >
                  {hospitalMutation.isPending ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
