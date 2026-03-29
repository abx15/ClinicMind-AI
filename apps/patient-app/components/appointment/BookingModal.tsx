'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  XIcon, CalendarIcon, ClockIcon, UserIcon,
  FileTextIcon, SearchIcon, ChevronRightIcon, CheckIcon, LoaderIcon,
} from '@/components/icons'
import { toast } from 'sonner'
import { useIsAuthenticated } from '@/stores/authStore'
import { appointmentService } from '@/lib/services/appointmentService'

interface Hospital {
  _id: string
  name: string
  city: string
  [key: string]: any
}

interface Doctor {
  _id: string
  name: string
  specialization: string
  qualifications?: string[]
  experience?: number
  consultationFee?: number
  [key: string]: any
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  hospitals?: Hospital[]
  doctor?: Doctor
  hospitalId?: string
}

interface BookingData {
  hospitalId: string
  doctorId:   string
  date:       string
  timeSlot:   string
  notes:      string
}

const STEP_LABELS = ['Hospital & Doctor', 'Date & Time', 'Confirm']

const MOCK_DOCTORS: Record<string, Doctor[]> = {}

function getMockDoctors(hospitalId: string): Doctor[] {
  if (!MOCK_DOCTORS[hospitalId]) {
    MOCK_DOCTORS[hospitalId] = [
      {
        _id: `doc_${hospitalId}_1`,
        name: 'Dr. Priya Sharma',
        specialization: 'Cardiology',
        qualifications: ['MBBS', 'MD', 'DM'],
        experience: 8,
        consultationFee: 800,
      },
      {
        _id: `doc_${hospitalId}_2`,
        name: 'Dr. Rahul Verma',
        specialization: 'General Medicine',
        qualifications: ['MBBS', 'MD'],
        experience: 12,
        consultationFee: 500,
      },
      {
        _id: `doc_${hospitalId}_3`,
        name: 'Dr. Anjali Patel',
        specialization: 'Orthopedics',
        qualifications: ['MBBS', 'MS'],
        experience: 6,
        consultationFee: 600,
      },
    ]
  }
  return MOCK_DOCTORS[hospitalId]
}

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
}

function getTimeSlots() {
  const slots: string[] = []
  for (let h = 9; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
}

export default function BookingModal({
  isOpen, onClose, hospitals = [],
}: BookingModalProps) {
  const router          = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const [step,          setStep]          = useState(1)
  const [search,        setSearch]        = useState('')
  const [selectedHosp,  setSelectedHosp]  = useState<Hospital | null>(null)
  const [selectedDoc,   setSelectedDoc]   = useState<Doctor | null>(null)
  const [booking,       setBooking]       = useState<BookingData>({
    hospitalId: '', doctorId: '', date: '', timeSlot: '', notes: '',
  })

  const { data: slotsData } = useQuery({
    queryKey: ['slots', selectedDoc?._id, booking.date],
    queryFn:  () => {
      if (selectedDoc && booking.date)
        return appointmentService.getAvailableSlots(selectedDoc._id, booking.date)
      return { slots: [] }
    },
    enabled: !!(selectedDoc && booking.date),
  })

  const bookMutation = useMutation({
    mutationFn: (data: BookingData) => appointmentService.bookAppointment(data),
    onSuccess: () => {
      toast.success('Appointment booked successfully!')
      handleClose()
      router.push('/dashboard/appointments')
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message || 'Failed to book appointment'),
  })

  const handleClose = () => {
    setStep(1); setSearch(''); setSelectedHosp(null); setSelectedDoc(null)
    setBooking({ hospitalId: '', doctorId: '', date: '', timeSlot: '', notes: '' })
    onClose()
  }

  const selectHospital = (h: Hospital) => {
    setSelectedHosp(h); setSelectedDoc(null)
    setBooking(b => ({ ...b, hospitalId: h._id, doctorId: '', date: '', timeSlot: '' }))
  }

  const selectDoctor = (d: Doctor) => {
    setSelectedDoc(d)
    setBooking(b => ({ ...b, doctorId: d._id, date: '', timeSlot: '' }))
    setStep(2)
  }

  const selectDate = (date: string) => {
    setBooking(b => ({ ...b, date, timeSlot: '' }))
  }

  const selectTime = (t: string) => {
    setBooking(b => ({ ...b, timeSlot: t }))
    setStep(3)
  }

  const confirm = () => {
    if (!booking.hospitalId || !booking.doctorId || !booking.date || !booking.timeSlot) {
      toast.error('Please complete all selections')
      return
    }
    bookMutation.mutate(booking)
  }

  const bookedSlots: string[] = (slotsData as any)?.slots ?? []
  const filtered = hospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  )
  const doctors = selectedHosp ? getMockDoctors(selectedHosp._id) : []

  if (!isOpen) return null
  if (!isAuthenticated) { router.push('/login'); return null }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center
                    justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl
                      max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4
                        flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
          <div>
            <h2 className="font-heading font-bold text-lg text-text-1">Book Appointment</h2>
            <p className="text-xs text-text-3">Step {step} of 3 — {STEP_LABELS[step - 1]}</p>
          </div>
          <button
            id="booking-close"
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-surface text-text-3 transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-surface">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6">

          {/* ── STEP 1: Hospital & Doctor ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-text-1 flex items-center gap-2">
                <SearchIcon size={16} className="text-primary" />
                Select Hospital &amp; Doctor
              </h3>

              {/* Search */}
              <div className="relative">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input
                  id="hospital-search"
                  type="text"
                  placeholder="Search hospital or city..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm
                             text-text-1 placeholder:text-text-3 outline-none
                             focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>

              {/* Hospitals */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {filtered.length === 0 ? (
                  <div className="py-8 text-center text-sm text-text-3">No hospitals found</div>
                ) : filtered.map(h => (
                  <button
                    key={h._id}
                    id={`hospital-${h._id}`}
                    onClick={() => selectHospital(h)}
                    className={`w-full text-left p-3.5 border rounded-xl flex items-center
                                justify-between transition-all ${
                      selectedHosp?._id === h._id
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-primary hover:bg-primary-light/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-light flex items-center
                                      justify-center text-primary font-bold text-sm flex-shrink-0">
                        {h.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-text-1">{h.name}</p>
                        <p className="text-xs text-text-3">{h.city}</p>
                      </div>
                    </div>
                    {selectedHosp?._id === h._id
                      ? <CheckIcon size={14} className="text-primary" />
                      : <ChevronRightIcon size={14} className="text-text-3" />
                    }
                  </button>
                ))}
              </div>

              {/* Doctors */}
              {selectedHosp && (
                <div>
                  <h4 className="text-sm font-semibold text-text-1 mb-2">
                    Doctors at {selectedHosp.name}
                  </h4>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {doctors.map(d => (
                      <button
                        key={d._id}
                        id={`doctor-${d._id}`}
                        onClick={() => selectDoctor(d)}
                        className={`w-full text-left p-3.5 border rounded-xl flex items-center
                                    justify-between transition-all ${
                          selectedDoc?._id === d._id
                            ? 'border-primary bg-primary-light'
                            : 'border-border hover:border-primary hover:bg-primary-light/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-light flex items-center
                                          justify-center text-purple font-bold text-sm flex-shrink-0">
                            {d.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-text-1">{d.name}</p>
                            <p className="text-xs text-text-3">{d.specialization}</p>
                            <p className="text-xs font-semibold text-primary mt-0.5">
                              ₹{d.consultationFee} / visit
                            </p>
                          </div>
                        </div>
                        {selectedDoc?._id === d._id
                          ? <CheckIcon size={14} className="text-primary" />
                          : <ChevronRightIcon size={14} className="text-text-3" />
                        }
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Date & Time ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-text-1 flex items-center gap-2">
                <CalendarIcon size={16} className="text-primary" />
                Select Date &amp; Time
              </h3>

              {/* Selected doctor info */}
              {selectedDoc && (
                <div className="bg-primary-light rounded-xl px-4 py-3 border border-primary/20">
                  <p className="text-sm font-semibold text-text-1">{selectedDoc.name}</p>
                  <p className="text-xs text-text-3">{selectedDoc.specialization} · ₹{selectedDoc.consultationFee}</p>
                </div>
              )}

              {/* Dates */}
              <div>
                <p className="text-sm font-medium text-text-1 mb-2">Select Date</p>
                <div className="grid grid-cols-7 gap-1.5">
                  {getNext7Days().map((d, i) => {
                    const ds = d.toISOString().split('T')[0]
                    const selected = booking.date === ds
                    return (
                      <button
                        key={i}
                        id={`date-${ds}`}
                        onClick={() => selectDate(ds)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selected
                            ? 'border-primary bg-primary text-white'
                            : 'border-border hover:border-primary hover:bg-primary-light/40'
                        }`}
                      >
                        <div className={`text-[10px] ${selected ? 'text-white/70' : 'text-text-3'}`}>
                          {d.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className={`font-bold text-sm ${selected ? 'text-white' : 'text-text-1'}`}>
                          {d.getDate()}
                        </div>
                        <div className={`text-[10px] ${selected ? 'text-white/70' : 'text-text-3'}`}>
                          {d.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {booking.date && (
                <div>
                  <p className="text-sm font-medium text-text-1 mb-2">Select Time</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                    {getTimeSlots().map(t => {
                      const booked   = bookedSlots.includes(t)
                      const selected = booking.timeSlot === t
                      return (
                        <button
                          key={t}
                          id={`time-${t}`}
                          onClick={() => !booked && selectTime(t)}
                          disabled={booked}
                          className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                            booked
                              ? 'border-border text-text-3 bg-surface cursor-not-allowed'
                              : selected
                              ? 'border-primary bg-primary text-white'
                              : 'border-border hover:border-primary hover:bg-primary-light/40 text-text-2'
                          }`}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                  {bookedSlots.length > 0 && (
                    <p className="text-xs text-text-3 mt-1.5">
                      {bookedSlots.length} slots already booked
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                className="text-sm text-text-2 hover:text-text-1 font-medium flex items-center gap-1"
              >
                ← Back
              </button>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-semibold text-text-1 flex items-center gap-2">
                <FileTextIcon size={16} className="text-primary" />
                Confirm Booking
              </h3>

              {/* Summary */}
              <div className="bg-surface rounded-2xl border border-border p-4 space-y-3">
                {[
                  { label: 'Hospital', value: selectedHosp?.name },
                  { label: 'Doctor',   value: selectedDoc?.name },
                  { label: 'Date',     value: booking.date },
                  { label: 'Time',     value: booking.timeSlot },
                  { label: 'Fee',      value: selectedDoc?.consultationFee ? `₹${selectedDoc.consultationFee}` : undefined },
                ].map(({ label, value }) => value ? (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-text-3">{label}</span>
                    <span className="font-semibold text-text-1">{value}</span>
                  </div>
                ) : null)}
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-text-1 block mb-1.5">
                  Additional Notes <span className="text-text-3">(optional)</span>
                </label>
                <textarea
                  id="booking-notes"
                  value={booking.notes}
                  onChange={e => setBooking(b => ({ ...b, notes: e.target.value }))}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows={3}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm
                             text-text-1 placeholder:text-text-3 outline-none
                             focus:border-primary focus:ring-2 focus:ring-primary/15
                             transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium
                             text-text-2 hover:bg-surface transition-colors"
                >
                  Back
                </button>
                <button
                  id="confirm-booking-btn"
                  onClick={confirm}
                  disabled={bookMutation.isPending}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white
                             font-semibold text-sm rounded-xl transition-colors
                             disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {bookMutation.isPending && <LoaderIcon size={14} />}
                  {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
