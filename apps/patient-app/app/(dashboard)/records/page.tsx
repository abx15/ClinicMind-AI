'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Calendar, Download, Print, Eye, X } from 'lucide-react'
import { useUser } from '@/stores/authStore'
import { prescriptionService } from '@/lib/services/prescriptionService'
import { Prescription } from '@clinicmind/types'
import PrescriptionCard from '@/components/prescription/PrescriptionCard'
import PrescriptionModal from '@/components/prescription/PrescriptionModal'
import EmptyState from '@/components/common/EmptyState'

export default function RecordsPage() {
  const user = useUser()
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch prescriptions
  const { data, isLoading, error } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => prescriptionService.getMyPrescriptions(),
  })

  const prescriptions = data?.prescriptions || []

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setIsModalOpen(true)
  }

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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Medical Records
          </h1>
          <p className="text-text-muted">
            Your prescription history and medical documents
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-outline flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Failed to load records"
          description="Please try again later"
          actionLabel="Try again"
          onAction={() => window.location.reload()}
        />
      ) : prescriptions.length === 0 ? (
        <EmptyState
          title="No Medical Records"
          description="You don't have any prescriptions yet. Your medical records will appear here after your appointments."
          actionLabel="Book Appointment"
          onAction={() => window.location.href = '/dashboard/appointments'}
          icon={
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          }
        />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription: Prescription) => (
            <PrescriptionCard
              key={prescription._id}
              prescription={prescription}
              onView={() => handleViewPrescription(prescription)}
            />
          ))}
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPrescription(null)
          }}
          prescription={selectedPrescription}
        />
      )}
    </div>
  )
}
