'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, Eye, FileText } from 'lucide-react'
import { Prescription } from '@clinicmind/types'

interface PrescriptionCardProps {
  prescription: Prescription & {
    doctor?: {
      name: string
      specialization: string
    }
    hospital?: {
      name: string
      city: string
    }
  }
  onView?: () => void
}

export default function PrescriptionCard({ prescription, onView }: PrescriptionCardProps) {
  const [showMore, setShowMore] = useState(false)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Mock medications for demonstration
  const medications = prescription.medications || [
    { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '5 days' },
    { name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times daily', duration: '7 days' },
    { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '3 days' },
    { name: 'Vitamin C', dosage: '1000mg', frequency: 'Once daily', duration: '30 days' },
  ]

  const displayMedications = showMore ? medications : medications.slice(0, 2)
  const hasMoreMedications = medications.length > 2

  return (
    <div className="card p-6">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-green-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-text-primary">
                {prescription.doctor?.name || 'Dr. Unknown'}
              </h3>
              <p className="text-sm text-text-muted">
                {prescription.doctor?.specialization || 'General Medicine'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-muted">
                {prescription.hospital?.name || 'Unknown Hospital'}
              </div>
              <div className="text-xs text-text-muted">
                {prescription.hospital?.city || 'Unknown City'}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-4 text-sm text-text-muted mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(prescription.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatTime(prescription.createdAt)}</span>
            </div>
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Diagnosis</h4>
              <p className="text-sm text-text-muted bg-gray-50 rounded p-3">
                {prescription.diagnosis}
              </p>
            </div>
          )}

          {/* Medications */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-text-secondary mb-2">Medications</h4>
            <div className="space-y-2">
              {displayMedications.map((med, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <span className="font-medium text-text-primary">{med.name}</span>
                    <span className="text-text-muted ml-2">
                      {med.dosage} - {med.frequency}
                    </span>
                  </div>
                  <span className="text-text-muted">{med.duration}</span>
                </div>
              ))}
              {hasMoreMedications && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  {showMore ? 'Show less' : `+${medications.length - 2} more medications`}
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          {prescription.notes && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Doctor's Notes</h4>
              <p className="text-sm text-text-muted bg-gray-50 rounded p-3">
                {prescription.notes}
              </p>
            </div>
          )}

          {/* Follow-up */}
          {prescription.followUpDate && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Follow-up</h4>
              <p className="text-sm text-text-muted">
                {prescription.followUpDate 
                  ? `Next appointment: ${formatDate(prescription.followUpDate)}`
                  : 'No follow-up scheduled'
                }
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={onView}
              className="btn-primary flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Prescription</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
