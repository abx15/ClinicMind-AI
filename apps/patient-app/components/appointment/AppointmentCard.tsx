'use client'

import { CalendarIcon, ClockIcon, UserIcon, FileTextIcon } from '@/components/icons'

interface Appointment {
  _id: string
  status: 'booked' | 'confirmed' | 'completed' | 'cancelled' | 'ongoing'
  date: string
  timeSlot: string
  notes?: string
  doctor?: { name: string; specialization: string }
  hospital?: { name: string; city: string }
}

interface AppointmentCardProps {
  appointment: Appointment
  onCancel?: (id: string) => void
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  booked:    { bg: 'bg-accent-light',  text: 'text-accent',   label: 'Booked' },
  confirmed: { bg: 'bg-primary-light', text: 'text-primary',  label: 'Confirmed' },
  completed: { bg: 'bg-surface',       text: 'text-text-2',   label: 'Completed' },
  cancelled: { bg: 'bg-danger-light',  text: 'text-danger',   label: 'Cancelled' },
  ongoing:   { bg: 'bg-warn-light',    text: 'text-warn',     label: 'In Progress' },
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

export default function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const s = STATUS_STYLES[appointment.status] ?? STATUS_STYLES.completed
  const canCancel      = appointment.status === 'booked' || appointment.status === 'confirmed'
  const canViewRx      = appointment.status === 'completed'
  const canGetToken    = appointment.status === 'confirmed'

  return (
    <div className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center
                        justify-center flex-shrink-0">
          <UserIcon size={20} className="text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-text-1 text-sm">
                {appointment.doctor?.name ?? 'Dr. TBD'}
              </h3>
              <p className="text-xs text-text-3">
                {appointment.doctor?.specialization ?? 'General Medicine'}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
              {s.label}
            </span>
          </div>

          <p className="text-xs text-text-2 mt-1">
            {appointment.hospital?.name ?? 'Unknown Hospital'}
            {appointment.hospital?.city ? ` · ${appointment.hospital.city}` : ''}
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-text-3">
            <span className="flex items-center gap-1">
              <CalendarIcon size={12} />
              {formatDate(appointment.date)}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon size={12} />
              {formatTime(appointment.timeSlot)}
            </span>
          </div>

          {appointment.notes && (
            <p className="mt-2 text-xs text-text-3 bg-surface rounded-lg px-3 py-1.5
                          border border-border line-clamp-2">
              {appointment.notes}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {canGetToken && (
              <button className="px-3 py-1.5 bg-primary text-white text-xs font-semibold
                                 rounded-lg hover:bg-primary-dark transition-colors">
                Get Queue Token
              </button>
            )}
            {canViewRx && (
              <button className="flex items-center gap-1 px-3 py-1.5 border border-border
                                 text-xs font-medium text-text-2 rounded-lg
                                 hover:bg-surface transition-colors">
                <FileTextIcon size={12} />
                View Prescription
              </button>
            )}
            {canCancel && onCancel && (
              <button
                onClick={() => onCancel(appointment._id)}
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
}
