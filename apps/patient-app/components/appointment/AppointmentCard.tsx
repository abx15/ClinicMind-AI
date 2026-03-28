'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, FileText, X } from 'lucide-react'
import { Appointment, AppointmentStatus } from '@clinicmind/types'

interface AppointmentCardProps {
  appointment: Appointment & {
    doctor?: {
      name: string
      specialization: string
    }
    hospital?: {
      name: string
      city: string
    }
  }
  onCancel?: (appointmentId: string) => void
}

export default function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
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

  const canCancel = appointment.status === 'booked' || appointment.status === 'confirmed'
  const canViewPrescription = appointment.status === 'completed'
  const canGetToken = appointment.status === 'confirmed'

  return (
    <div className="card p-6">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-primary-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-text-primary">
                {appointment.doctor?.name || 'Dr. Unknown'}
              </h3>
              <p className="text-sm text-text-muted">
                {appointment.doctor?.specialization || 'General Medicine'}
              </p>
            </div>
            <div className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </div>
          </div>

          <div className="text-sm text-text-muted mb-3">
            <p>{appointment.hospital?.name || 'Unknown Hospital'}</p>
            <p>{appointment.hospital?.city || 'Unknown City'}</p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-text-muted mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatTime(appointment.timeSlot)}</span>
            </div>
          </div>

          {appointment.notes && (
            <div className="text-sm text-text-muted mb-4 p-2 bg-gray-50 rounded">
              <p className="line-clamp-2">{appointment.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {canGetToken && (
              <button className="btn-primary text-sm py-2 px-4">
                Get Queue Token
              </button>
            )}
            
            {canViewPrescription && (
              <button className="btn-outline text-sm py-2 px-4">
                <FileText className="w-4 h-4 mr-1" />
                View Prescription
              </button>
            )}

            {canCancel && onCancel && (
              <button
                onClick={() => onCancel(appointment._id)}
                className="text-red-500 hover:text-red-600 font-medium text-sm py-2 px-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
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
