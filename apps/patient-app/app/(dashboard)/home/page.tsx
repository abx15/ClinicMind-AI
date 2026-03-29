'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { CalendarIcon, ClockIcon, FileTextIcon, SearchIcon, ArrowRightIcon, ActivityIcon, UsersIcon, StarIcon } from '@/components/icons'
import { useUser } from '@/stores/authStore'
import { appointmentService } from '@/lib/services/appointmentService'
import { queueService } from '@/lib/services/queueService'
import { prescriptionService } from '@/lib/services/prescriptionService'
import { QueueToken } from '@clinicmind/types'

export default function PatientHomePage() {
  const user = useUser()
  const router = useRouter()
  const [greeting, setGreeting] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Fetch appointments
  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAppointments(),
  })

  // Fetch queue status
  const { data: queueData } = useQuery({
    queryKey: ['queue', 'my-status'],
    queryFn: () => queueService.getMyStatus(),
    refetchInterval: 30000, // Poll every 30s
  })

  // Fetch prescriptions
  const { data: prescriptionsData } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => prescriptionService.getMyPrescriptions(),
  })

  const appointments = appointmentsData?.appointments || []
  const activeToken = queueData?.data?.token
  const prescriptions = prescriptionsData?.prescriptions || []

  // Calculate stats
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'booked' || apt.status === 'confirmed'
  ).length

  const recentAppointments = appointments
    .filter((apt) => apt.status === 'completed')
    .slice(0, 3)

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

  return (
    <div>
      {/* Greeting Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary font-heading mb-2">
          {greeting}, {user?.name} 👋
        </h1>
        <p className="text-text-muted">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Active Queue Token */}
      {activeToken && (
        <div className="card p-6 mb-8 border-l-4 border-amber-500 bg-amber-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-amber-500" />
                Active Queue Token
              </h3>
              <div className="flex items-center space-x-4 text-sm text-text-muted">
                <span>Token: #{activeToken.tokenNumber}</span>
                <span>•</span>
                <span>Dr. {activeToken.doctorId}</span>
                <span>•</span>
                <span>Est. wait: {activeToken.estimatedWaitMinutes} min</span>
              </div>
            </div>
            <div className="text-right">
              <div className="px-3 py-1 bg-amber-500 text-white text-xs rounded-full font-medium mb-2">
                {activeToken.status.toUpperCase()}
              </div>
              <button
                onClick={() => router.push('/dashboard/queue')}
                className="text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-text-primary">{upcomingAppointments}</span>
          </div>
          <h3 className="font-semibold text-text-primary">Upcoming Appointments</h3>
          <p className="text-sm text-text-muted mt-1">Scheduled visits</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-text-primary">{activeToken ? '1' : '0'}</span>
          </div>
          <h3 className="font-semibold text-text-primary">Active Queue Token</h3>
          <p className="text-sm text-text-muted mt-1">Current status</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileTextIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-text-primary">{prescriptions.length}</span>
          </div>
          <h3 className="font-semibold text-text-primary">Total Prescriptions</h3>
          <p className="text-sm text-text-muted mt-1">Medical records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Recent Appointments</h2>
            <button
              onClick={() => router.push('/dashboard/appointments')}
              className="text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-text-muted">No recent appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <UsersIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Dr. {appointment.doctorId}</p>
                      <p className="text-sm text-text-muted">
                        {formatDate(appointment.date)} at {formatTime(appointment.timeSlot)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium mb-1">
                      COMPLETED
                    </div>
                    <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/hospitals')}
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <SearchIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-text-primary">Find Hospital</p>
                  <p className="text-sm text-text-muted">Search verified hospitals</p>
                </div>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-text-muted group-hover:text-primary-500 transition-colors" />
            </button>

            <button
              onClick={() => router.push('/dashboard/appointments')}
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-text-primary">Book Appointment</p>
                  <p className="text-sm text-text-muted">Schedule a visit</p>
                </div>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-text-muted group-hover:text-primary-500 transition-colors" />
            </button>

            <button
              onClick={() => router.push('/dashboard/records')}
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <FileTextIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-text-primary">View Records</p>
                  <p className="text-sm text-text-muted">Prescription history</p>
                </div>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-text-muted group-hover:text-primary-500 transition-colors" />
            </button>

            <button
              onClick={() => router.push('/dashboard/queue')}
              className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <ClockIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-text-primary">Queue Status</p>
                  <p className="text-sm text-text-muted">Live tracking</p>
                </div>
              </div>
              <ArrowRightIcon className="w-5 h-5 text-text-muted group-hover:text-primary-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
