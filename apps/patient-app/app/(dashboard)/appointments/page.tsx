'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarIcon, ClockIcon, PlusIcon, XIcon, AlertCircleIcon, UserIcon, LoaderIcon } from '@/components/icons'
import { toast } from 'sonner'
import { appointmentService } from '@/lib/services/appointmentService'
import { hospitalService } from '@/lib/services/hospitalService'
import BookingModal from '@/components/appointment/BookingModal'

type TabType = 'upcoming' | 'past' | 'all'

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  booked:    { bg: 'bg-accent-light',   text: 'text-accent',   label: 'Booked' },
  confirmed: { bg: 'bg-primary-light',  text: 'text-primary',  label: 'Confirmed' },
  completed: { bg: 'bg-surface',        text: 'text-text-2',   label: 'Completed' },
  cancelled: { bg: 'bg-danger-light',   text: 'text-danger',   label: 'Cancelled' },
  ongoing:   { bg: 'bg-warn-light',     text: 'text-warn',     label: 'In Progress' },
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatTime(time: string) {
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const display = hour % 12 || 12
  return `${display}:${m} ${ampm}`
}

export default function AppointmentsPage() {
  const [activeTab,           setActiveTab]           = useState<TabType>('upcoming')
  const [isBookingOpen,       setIsBookingOpen]       = useState(false)
  const [cancelId,            setCancelId]            = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['appointments', activeTab],
    queryFn: () => {
      if (activeTab === 'upcoming') return appointmentService.getAppointments(['booked', 'confirmed'])
      if (activeTab === 'past')     return appointmentService.getAppointments(['completed', 'cancelled'])
      return appointmentService.getAppointments()
    },
  })

  const { data: hospitalsData } = useQuery({
    queryKey: ['hospitals'],
    queryFn:  () => hospitalService.getHospitals(),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentService.updateAppointmentStatus(id, 'cancelled'),
    onSuccess: () => {
      toast.success('Appointment cancelled')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      setCancelId(null)
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to cancel'),
  })

  const appointments = (data as any)?.data?.appointments ?? (data as any)?.appointments ?? []
  const hospitals    = (hospitalsData as any)?.data?.hospitals ?? (hospitalsData as any)?.hospitals ?? []

  const tabs: { key: TabType; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past',     label: 'Past' },
    { key: 'all',      label: 'All' },
  ]

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl md:text-2xl text-text-1">
            Appointments
          </h1>
          <p className="text-sm text-text-3 mt-0.5">
            Manage your hospital visits and consultations
          </p>
        </div>
        <button
          id="book-appointment-btn"
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white
                     text-sm font-semibold rounded-xl transition-colors w-full sm:w-auto justify-center"
        >
          <PlusIcon size={16} />
          Book Appointment
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex bg-white rounded-2xl border border-border p-1 gap-1 w-fit">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            id={`tab-${key}`}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-2 hover:text-text-1 hover:bg-surface'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-border p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-surface flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface rounded w-3/4" />
                  <div className="h-3 bg-surface rounded w-1/2" />
                  <div className="h-3 bg-surface rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
            <AlertCircleIcon size={24} className="text-danger" />
          </div>
          <h3 className="font-heading font-bold text-text-1 mb-1">Failed to load appointments</h3>
          <p className="text-sm text-text-3 mb-5">There was a problem fetching your appointments.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-5">
            <CalendarIcon size={28} className="text-primary" />
          </div>
          <h3 className="font-heading font-bold text-lg text-text-1 mb-1">
            {activeTab === 'upcoming' ? 'No upcoming appointments'
             : activeTab === 'past' ? 'No past appointments'
             : 'No appointments yet'}
          </h3>
          <p className="text-sm text-text-3 mb-5 max-w-xs mx-auto">
            {activeTab === 'upcoming'
              ? 'Book an appointment with a verified doctor near you.'
              : 'Your completed and cancelled appointments appear here.'}
          </p>
          {activeTab !== 'past' && (
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold
                         text-sm rounded-xl transition-colors"
            >
              Book Appointment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt: any) => {
            const s = STATUS_STYLES[appt.status] ?? STATUS_STYLES.completed
            const canCancel = appt.status === 'booked' || appt.status === 'confirmed'
            return (
              <div
                key={appt._id}
                className="bg-white rounded-2xl border border-border p-5
                           hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center
                                  justify-center flex-shrink-0">
                    <UserIcon size={20} className="text-primary" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-text-1 text-sm">
                          {appt.doctor?.name ?? 'Dr. TBD'}
                        </p>
                        <p className="text-xs text-text-3">
                          {appt.doctor?.specialization ?? 'General Medicine'}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </div>

                    <p className="text-xs text-text-2 mt-1">
                      {appt.hospital?.name ?? 'Unknown Hospital'}
                      {appt.hospital?.city ? ` · ${appt.hospital.city}` : ''}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-text-3">
                      <span className="flex items-center gap-1">
                        <CalendarIcon size={12} />
                        {formatDate(appt.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon size={12} />
                        {formatTime(appt.timeSlot)}
                      </span>
                    </div>

                    {appt.notes && (
                      <p className="mt-2 text-xs text-text-3 bg-surface rounded-lg px-3 py-1.5
                                    border border-border line-clamp-2">
                        {appt.notes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {appt.status === 'confirmed' && (
                        <button className="px-3 py-1.5 bg-primary text-white text-xs font-semibold
                                           rounded-lg hover:bg-primary-dark transition-colors">
                          Get Queue Token
                        </button>
                      )}
                      {appt.status === 'completed' && (
                        <button className="px-3 py-1.5 border border-border text-xs font-medium
                                           text-text-2 rounded-lg hover:bg-surface transition-colors">
                          View Prescription
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => setCancelId(appt._id)}
                          className="px-3 py-1.5 border border-danger/30 text-xs font-medium
                                     text-danger rounded-lg hover:bg-danger-light transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Cancel Modal ── */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-text-1">Cancel Appointment</h3>
              <button
                onClick={() => setCancelId(null)}
                className="p-1.5 rounded-lg hover:bg-surface text-text-3"
              >
                <XIcon size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5 p-3 bg-warn-light rounded-xl border border-warn/20">
              <AlertCircleIcon size={18} className="text-warn flex-shrink-0" />
              <p className="text-sm text-text-1">
                Are you sure you want to cancel this appointment?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium
                           text-text-2 hover:bg-surface transition-colors"
              >
                Keep It
              </button>
              <button
                onClick={() => cancelMutation.mutate(cancelId)}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm font-semibold
                           hover:opacity-90 transition-opacity disabled:opacity-60
                           flex items-center justify-center gap-2"
              >
                {cancelMutation.isPending && <LoaderIcon size={14} />}
                {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Booking Modal ── */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        hospitals={hospitals}
      />
    </div>
  )
}
