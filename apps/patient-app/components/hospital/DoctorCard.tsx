'use client'

import { useState } from 'react'
import { Doctor } from '@clinicmind/types'
import { Star, Clock, DollarSign, CheckCircle } from 'lucide-react'

interface DoctorCardProps {
  doctor: Doctor & {
    consultationFee?: number
  }
  onBookAppointment?: (doctor: Doctor) => void
}

export default function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  const initials = doctor.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-bold text-xl font-heading">
              {initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-text-primary font-heading truncate">
                {doctor.name}
              </h3>
              {doctor.isVerified && (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-text-muted text-sm mb-2">{doctor.specialization}</p>
            <div className="flex items-center text-text-muted text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{doctor.experience} years experience</span>
            </div>
          </div>
        </div>

        {/* Qualifications */}
        {doctor.qualifications && doctor.qualifications.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-text-secondary mb-2">Qualifications</p>
            <div className="flex flex-wrap gap-1">
              {doctor.qualifications.slice(0, 3).map((qual, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {qual}
                </span>
              ))}
              {doctor.qualifications.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{doctor.qualifications.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {doctor.bio && (
          <div className="mb-4">
            <p className="text-sm text-text-muted line-clamp-2">{doctor.bio}</p>
          </div>
        )}

        {/* Fee */}
        {doctor.consultationFee && (
          <div className="flex items-center text-text-primary font-medium mb-4">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>₹{doctor.consultationFee} per consultation</span>
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={() => onBookAppointment?.(doctor)}
          className="w-full btn-primary"
        >
          Book Appointment
        </button>
      </div>
    </div>
  )
}
