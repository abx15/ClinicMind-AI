'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon } from '@/components/icons'
import BookingModal from '@/components/appointment/BookingModal'
import { hospitalService } from '@/lib/services/hospitalService'
import { useState } from 'react'

export default function BookAppointmentPage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const { data } = useQuery({
    queryKey: ['hospitals'],
    queryFn:  () => hospitalService.getHospitals(),
  })

  const hospitals = (data as any)?.data?.hospitals ?? (data as any)?.hospitals ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl md:text-2xl text-text-1">
          Book Appointment
        </h1>
        <p className="text-sm text-text-3 mt-0.5">
          Find a verified doctor and book your slot
        </p>
      </div>

      <BookingModal
        isOpen={open}
        onClose={() => {
          setOpen(false)
          router.push('/dashboard/appointments')
        }}
        hospitals={hospitals}
      />

      {!open && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <p className="text-sm text-text-3 mb-4">Booking window closed.</p>
          <button
            onClick={() => router.push('/dashboard/appointments')}
            className="flex items-center gap-2 mx-auto px-4 py-2.5 bg-primary text-white
                       text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            View Appointments
            <ArrowRightIcon size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
