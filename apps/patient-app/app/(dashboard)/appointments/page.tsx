'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, Users, Plus, X, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { appointmentService } from '@/lib/services/appointmentService'
import { hospitalService } from '@/lib/services/hospitalService'
import { Appointment, AppointmentStatus } from '@clinicmind/types'
import AppointmentCard from '@/components/appointment/AppointmentCard'
import BookingModal from '@/components/appointment/BookingModal'
import { AppointmentCardSkeleton } from '@/components/common/LoadingSkeleton'
import EmptyState from '@/components/common/EmptyState'

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)

  const queryClient = useQueryClient()

  // Fetch appointments
  const { data: appointmentsData, isLoading, error } = useQuery({
    queryKey: ['appointments', activeTab],
    queryFn: () => {
      if (activeTab === 'upcoming') {
        return appointmentService.getAppointments(['booked', 'confirmed'])
      } else if (activeTab === 'past') {
        return appointmentService.getAppointments(['completed', 'cancelled'])
      } else {
        return appointmentService.getAppointments()
      }
    },
  })

  // Fetch hospitals for booking flow
  const { data: hospitalsData } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => hospitalService.getHospitals(),
  })

  // Cancel appointment mutation
  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      appointmentService.updateAppointmentStatus(appointmentId, 'cancelled'),
    onSuccess: () => {
      toast.success('Appointment cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      setCancelModalOpen(false)
      setAppointmentToCancel(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment')
    },
  })

  const appointments = appointmentsData?.appointments || []
  const hospitals = hospitalsData?.hospitals || []

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId)
    setCancelModalOpen(true)
  }

  const confirmCancel = () => {
    if (appointmentToCancel) {
      cancelMutation.mutate(appointmentToCancel)
    }
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-700'
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-gray-100 text-gray-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'ongoing':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case 'booked':
        return 'Booked'
      case 'confirmed':
        return 'Confirmed'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      case 'ongoing':
        return 'In Progress'
      default:
        return status
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Appointments
          </h1>
          <p className="text-text-muted">
            Manage your hospital visits and consultations
          </p>
        </div>
        
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {(['upcoming', 'past', 'all'] as const).map((tab) => (
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

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
        </div>
      ) : error ? (
        <EmptyState
          title="Failed to load appointments"
          description="Please try again later"
          actionLabel="Try again"
          onAction={() => window.location.reload()}
        />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description={
            activeTab === 'upcoming'
              ? "You don't have any upcoming appointments"
              : activeTab === 'past'
              ? "You don't have any past appointments"
              : "You don't have any appointments yet"
          }
          actionLabel="Book Appointment"
          onAction={() => setIsBookingModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment: Appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onCancel={() => handleCancelAppointment(appointment._id)}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Cancel Appointment
              </h3>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-4 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Are you sure you want to cancel this appointment?
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 btn-outline"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelMutation.isPending}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hospitals={hospitals}
      />
    </div>
  )
}
