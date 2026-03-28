'use client'

import Link from 'next/link'
import { MapPin, Star, Users } from 'lucide-react'
import { Hospital } from '@clinicmind/types'

interface HospitalCardProps {
  hospital: Hospital & {
    doctorCount?: number
    specializations?: string[]
  }
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
  const initials = hospital.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const displaySpecializations = hospital.specializations?.slice(0, 3) || []
  const hasMoreSpecializations = (hospital.specializations?.length || 0) > 3

  return (
    <Link href={`/hospitals/${hospital.slug}`}>
      <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        {/* Top accent bar */}
        <div className="h-1 bg-primary-500 rounded-t-card"></div>
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-500 font-bold text-lg font-heading">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary font-heading truncate group-hover:text-primary-500 transition-colors">
                {hospital.name}
              </h3>
              <div className="flex items-center text-text-muted text-sm mt-1">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{hospital.city}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-text-muted ml-1">4.5</span>
          </div>

          {/* Specializations */}
          {displaySpecializations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {displaySpecializations.map((spec, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full font-medium"
                >
                  {spec}
                </span>
              ))}
              {hasMoreSpecializations && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{(hospital.specializations?.length || 0) - 3} more
                </span>
              )}
            </div>
          )}

          {/* Doctor count */}
          {hospital.doctorCount && (
            <div className="flex items-center text-text-muted text-sm mb-4">
              <Users className="w-4 h-4 mr-2" />
              <span>{hospital.doctorCount} verified doctors available</span>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border mb-4"></div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button className="btn-primary flex-1 text-sm py-2 group-hover:bg-primary-600 transition-colors">
              Book Appointment
            </button>
            <button className="btn-outline flex-1 text-sm py-2 group-hover:border-primary-500 group-hover:text-primary-500 transition-colors">
              View Doctors
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
