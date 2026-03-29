'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CalendarIcon, ClockIcon, UserIcon, SearchIcon,
  CheckIcon, XIcon, LoaderIcon, AlertCircleIcon, FilterIcon,
} from '@/components/icons'
import { toast } from 'sonner'
import { useUser } from '@/stores/authStore'
import { appointmentService } from '@/lib/services/appointmentService'

type StatusFilter = 'all' | 'booked' | 'confirmed' | 'completed' | 'cancelled' | 'ongoing'

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  booked:    { bg: 'bg-accent-light',   text: 'text-accent',  label: 'Booked'      },
  confirmed: { bg: 'bg-primary-light',  text: 'text-primary', label: 'Confirmed'   },
  completed: { bg: 'bg-surface',        text: 'text-text-2',  label: 'Completed'   },
  cancelled: { bg: 'bg-danger-light',   text: 'text-danger',  label: 'Cancelled'   },
  ongoing:   { bg: 'bg-warn-light',     text: 'text-warn',    label: 'In Progress' },
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
  return `${hour % 12 || 12}:${m} ${ampm}`
}

const TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'booked',    label: 'Booked'    },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'ongoing',   label: 'Ongoing'   },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function HospitalAppointmentsPage() {
  const user           = useUser()
  const hospitalId     = (user as any)?.hospitalId
  const queryClient    = useQueryClient()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search,       setSearch]       = useState('')
  const [confirmId,    setConfirmId]    = useState<string | null>(null)
  const [cancelId,     setCancelId]     = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['hospital', 'appointments', hospitalId, statusFilter],
    queryFn:  () => appointmentService.getAppointments({
      hospitalId,
      ...(statusFilter !== 'all' ? { status: statusFilter } as any : {}),
    }),
    enabled: !!hospitalId,
    refetchInterval: 30000,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: (_, { data: { status } }) => {
      toast.success(`Appointment ${status === 'confirmed' ? 'confirmed' : 'cancelled'}`)
      queryClient.invalidateQueries({ queryKey: ['hospital', 'appointments'] })
      setConfirmId(null)
      setCancelId(null)
    },
    onError: (e: any) => toast.error(e?.response?.data?.error || 'Action failed'),
  })

  const allAppts: any[] = (data as any)?.data?.appointments ?? (data as any)?.appointments ?? []

  const filtered = allAppts.filter(a => {
    const q = search.toLowerCase()
    return (
      a.patient?.name?.toLowerCase().includes(q) ||
      a.doctor?.name?.toLowerCase().includes(q) ||
      a.tokenNumber?.toString().includes(q)
    )
  })

  // Summary counts
  const counts = allAppts.reduce((acc: Record<string, number>, a: any) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  const summaryCards = [
    { label: 'Total',     value: allAppts.length,         color: 'bg-surface          text-text-1'  },
    { label: 'Confirmed', value: counts['confirmed'] ?? 0, color: 'bg-primary-light   text-primary'  },
    { label: 'Ongoing',   value: counts['ongoing']   ?? 0, color: 'bg-warn-light       text-warn'    },
    { label: 'Completed', value: counts['completed'] ?? 0, color: 'bg-primary-light/50 text-text-2'  },
  ]

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-xl md:text-2xl text-text-1">
            Appointments
          </h1>
          <p className="text-sm text-text-3 mt-0.5">
            Manage all patient appointments in real-time
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map(c => (
          <div
            key={c.label}
            className="bg-white rounded-2xl border border-border p-4"
          >
            <p className="text-xs text-text-3 mb-1">{c.label}</p>
            <p className={`font-heading font-bold text-2xl ${c.color.split(' ')[1]}`}>
              {isLoading ? '—' : c.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filters Bar ── */}
      <div className="bg-white rounded-2xl border border-border p-4 flex flex-col sm:flex-row
                      gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            id="appointment-search"
            type="text"
            placeholder="Search patient, doctor, token..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-border rounded-xl text-sm
                       text-text-1 placeholder:text-text-3 outline-none
                       focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
          />
        </div>

        {/* Status Tabs — horizontal scroll */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 flex-shrink-0 max-w-full sm:max-w-none">
          {TABS.map(t => (
            <button
              key={t.key}
              id={`filter-${t.key}`}
              onClick={() => setStatusFilter(t.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === t.key
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-2 hover:bg-primary-light hover:text-primary'
              }`}
            >
              {t.label}
              {t.key !== 'all' && counts[t.key] != null && (
                <span className={`ml-1 ${statusFilter === t.key ? 'opacity-70' : 'text-text-3'}`}>
                  ({counts[t.key]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Appointments List ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-border p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-surface flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface rounded w-1/3" />
                  <div className="h-3 bg-surface rounded w-1/4" />
                  <div className="h-3 bg-surface rounded w-1/2" />
                </div>
                <div className="h-6 bg-surface rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
            <CalendarIcon size={28} className="text-text-3" />
          </div>
          <h3 className="font-heading font-bold text-text-1 mb-1">No appointments found</h3>
          <p className="text-sm text-text-3">
            {search ? `No results for "${search}"` : 'No appointments match the current filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt: any) => {
            const s = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.completed
            const canConfirm = appt.status === 'booked'
            const canCancel  = appt.status === 'booked' || appt.status === 'confirmed'

            return (
              <div
                key={appt._id}
                className="bg-white rounded-2xl border border-border p-5
                           hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center
                                  justify-center flex-shrink-0">
                    <UserIcon size={18} className="text-text-3" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-sm text-text-1">
                          {appt.patient?.name ?? 'Patient'}
                        </p>
                        <p className="text-xs text-text-3">
                          Dr. {appt.doctor?.name ?? 'TBD'}
                          {appt.doctor?.specialization ? ` · ${appt.doctor.specialization}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {appt.tokenNumber && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold
                                           bg-purple-light text-purple">
                            #{appt.tokenNumber}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
                          {s.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-1.5 text-xs text-text-3">
                      <span className="flex items-center gap-1">
                        <CalendarIcon size={11} />
                        {formatDate(appt.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon size={11} />
                        {formatTime(appt.timeSlot)}
                      </span>
                      {appt.patient?.phone && (
                        <span className="text-text-3">📞 {appt.patient.phone}</span>
                      )}
                    </div>

                    {appt.notes && (
                      <p className="mt-1.5 text-xs text-text-3 line-clamp-1">
                        Note: {appt.notes}
                      </p>
                    )}

                    {/* Actions */}
                    {(canConfirm || canCancel) && (
                      <div className="flex gap-2 mt-3">
                        {canConfirm && (
                          <button
                            id={`confirm-${appt._id}`}
                            onClick={() => setConfirmId(appt._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary
                                       text-white text-xs font-semibold rounded-lg
                                       hover:bg-primary-dark transition-colors"
                          >
                            <CheckIcon size={12} />
                            Confirm
                          </button>
                        )}
                        {canCancel && (
                          <button
                            id={`cancel-${appt._id}`}
                            onClick={() => setCancelId(appt._id)}
                            className="flex items-center gap-1 px-3 py-1.5 border border-danger/30
                                       text-danger text-xs font-medium rounded-lg
                                       hover:bg-danger-light transition-colors"
                          >
                            <XIcon size={12} />
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Confirm Modal ── */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-heading font-bold text-text-1 mb-2">Confirm Appointment</h3>
            <p className="text-sm text-text-3 mb-5">
              Are you sure you want to confirm this appointment? The patient will be notified.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 border border-border rounded-xl text-sm
                           font-medium text-text-2 hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMutation.mutate({ id: confirmId, data: { status: 'confirmed' } })}
                disabled={updateMutation.isPending}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm
                           font-semibold hover:bg-primary-dark transition-colors
                           disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {updateMutation.isPending && <LoaderIcon size={14} />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Modal ── */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-heading font-bold text-text-1 mb-2">Cancel Appointment</h3>
            <div className="flex items-center gap-3 mb-5 p-3 bg-warn-light rounded-xl border border-warn/20">
              <AlertCircleIcon size={18} className="text-warn flex-shrink-0" />
              <p className="text-sm text-text-1">
                Are you sure you want to cancel this appointment?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 border border-border rounded-xl text-sm
                           font-medium text-text-2 hover:bg-surface transition-colors"
              >
                Keep It
              </button>
              <button
                onClick={() => updateMutation.mutate({ id: cancelId, data: { status: 'cancelled' } })}
                disabled={updateMutation.isPending}
                className="flex-1 py-2.5 bg-danger text-white rounded-xl text-sm
                           font-semibold hover:opacity-90 transition-opacity
                           disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {updateMutation.isPending && <LoaderIcon size={14} />}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
