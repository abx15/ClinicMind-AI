'use client'

import { Hospital } from '@/types'

interface HospitalCardProps {
  hospital: Hospital
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
          <p className="text-sm text-gray-600">{hospital.city}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          hospital.isVerified 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {hospital.isVerified ? 'Verified' : 'Pending'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>Doctors:</strong> {hospital.doctorCount || 0}</p>
        <p><strong>Patients:</strong> {hospital.patientCount || 0}</p>
        <p><strong>Registered:</strong> {new Date(hospital.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
          View Details
        </button>
        {!hospital.isVerified && (
          <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
            Approve
          </button>
        )}
      </div>
    </div>
  )
}
