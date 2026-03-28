'use client'

import { useState } from 'react'
import { X, Download, Print, FileText, Users, Calendar, Clock, ChevronRight } from 'lucide-react'
import { Prescription } from '@clinicmind/types'

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
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
}

export default function PrescriptionModal({ isOpen, onClose, prescription }: PrescriptionModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'medications'>('details')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    { 
      name: 'Paracetamol', 
      dosage: '500mg', 
      frequency: 'Twice daily', 
      duration: '5 days',
      instructions: 'Take after meals, avoid alcohol',
      quantity: '10 tablets',
      refills: '0'
    },
    { 
      name: 'Amoxicillin', 
      dosage: '250mg', 
      frequency: 'Three times daily', 
      duration: '7 days',
      instructions: 'Complete full course, even if feeling better',
      quantity: '21 capsules',
      refills: '0'
    },
    { 
      name: 'Ibuprofen', 
      dosage: '400mg', 
      frequency: 'As needed for pain', 
      duration: '3 days',
      instructions: 'Take with food if stomach upset',
      quantity: '6 tablets',
      refills: '1'
    },
    { 
      name: 'Vitamin C', 
      dosage: '1000mg', 
      frequency: 'Once daily', 
      duration: '30 days',
      instructions: 'Take with water, preferably in morning',
      quantity: '30 tablets',
      refills: '2'
    },
  ]

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log('Downloading prescription...')
  }

  const handlePrint = () => {
    // Placeholder for print functionality
    window.print()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 rounded-t-card">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary font-heading">
              Prescription Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'details'
                    ? 'border-primary-500 text-primary-500'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('medications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'medications'
                    ? 'border-primary-500 text-primary-500'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                Medications
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Doctor & Hospital Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-4">Doctor Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">
                            {prescription.doctor?.name || 'Dr. Unknown'}
                          </p>
                          <p className="text-sm text-text-muted">
                            {prescription.doctor?.specialization || 'General Medicine'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-text-muted">
                          <span className="font-medium">License:</span>
                          <span>MBBS, MD, DM</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-text-muted">
                          <span className="font-medium">Experience:</span>
                          <span>15 years</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-text-primary mb-4">Hospital Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">
                            {prescription.hospital?.name || 'Unknown Hospital'}
                          </p>
                          <p className="text-sm text-text-muted">
                            {prescription.hospital?.city || 'Unknown City'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-text-muted">
                          <span className="font-medium">Address:</span>
                          <span>123 Medical Complex, Main Road</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-text-muted">
                          <span className="font-medium">Phone:</span>
                          <span>+91 98765 43210</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-text-primary mb-4">Prescription Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <div>
                      <span className="text-sm text-text-muted">Date:</span>
                      <span className="text-sm font-medium text-text-primary ml-2">
                        {formatDate(prescription.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-text-muted" />
                    <div>
                      <span className="text-sm text-text-muted">Time:</span>
                      <span className="text-sm font-medium text-text-primary ml-2">
                        {formatTime(prescription.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-text-muted" />
                    <div>
                      <span className="text-sm text-text-muted">Prescription ID:</span>
                      <span className="text-sm font-medium text-text-primary ml-2">
                        #{prescription._id?.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Diagnosis */}
                {prescription.diagnosis && (
                  <div className="mt-4">
                    <h4 className="font-medium text-text-secondary mb-2">Diagnosis</h4>
                    <div className="bg-white rounded p-4 border border-border">
                      <p className="text-text-secondary">{prescription.diagnosis}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {prescription.notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-text-secondary mb-2">Doctor's Notes</h4>
                    <div className="bg-white rounded p-4 border border-border">
                      <p className="text-text-secondary">{prescription.notes}</p>
                    </div>
                  </div>
                )}

                {/* Follow-up */}
                <div className="mt-4">
                  <h4 className="font-medium text-text-secondary mb-2">Follow-up Instructions</h4>
                  <div className="bg-white rounded p-4 border border-border">
                    <p className="text-text-secondary">
                      Please follow up after 1 week or earlier if symptoms persist.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleDownload}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Print className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Prescribed Medications
                </h3>
              </div>

              {/* Medications Table */}
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Medicine Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Dosage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Frequency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Instructions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Refills
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {medications.map((med, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-text-primary">{med.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {med.dosage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {med.frequency}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {med.duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {med.instructions}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-text-primary">{med.quantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-text-primary">{med.refills}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-3">Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Total Medicines:</span>
                    <span className="font-medium text-text-primary">{medications.length}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Total Quantity:</span>
                    <span className="font-medium text-text-primary">
                      {medications.reduce((sum, med) => sum + (med.quantity || 0), 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Total Refills:</span>
                    <span className="font-medium text-text-primary">
                      {medications.reduce((sum, med) => sum + (med.refills || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleDownload}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Print className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
