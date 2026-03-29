'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const stats = [
    {
      title: 'Today\'s Appointments',
      value: '24',
      change: '+3 from yesterday',
      icon: Calendar,
      color: 'teal'
    },
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+18 this week',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Queue Status',
      value: 'Active',
      change: '12 patients waiting',
      icon: Clock,
      color: 'amber'
    },
    {
      title: 'Revenue This Month',
      value: '₹84,500',
      change: '+12% vs last month',
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  const todayAppointments = [
    { id: 1, patient: 'Rahul Sharma', time: '09:00 AM', type: 'Consultation', status: 'completed' },
    { id: 2, patient: 'Priya Patel', time: '09:30 AM', type: 'Follow-up', status: 'in-progress' },
    { id: 3, patient: 'Amit Kumar', time: '10:00 AM', type: 'New Patient', status: 'waiting' },
    { id: 4, patient: 'Sneha Reddy', time: '10:30 AM', type: 'Consultation', status: 'waiting' },
    { id: 5, patient: 'Vikram Singh', time: '11:00 AM', type: 'Emergency', status: 'scheduled' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-heading">
          Welcome back, {user?.name}
        </h1>
        <p className="text-text-secondary">
          Here's what's happening at your hospital today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">{stat.title}</p>
                <p className="text-2xl font-bold text-text-primary font-heading">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color === 'teal' ? 'bg-[#E1F5EE]' :
                stat.color === 'blue' ? 'bg-[#E6F1FB]' :
                stat.color === 'amber' ? 'bg-[#FEF3E2]' :
                'bg-[#EEEDFE]'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'teal' ? 'text-[#0F6E56]' :
                  stat.color === 'blue' ? 'text-[#1D63B5]' :
                  stat.color === 'amber' ? 'text-[#B86E0A]' :
                  'text-[#534AB7]'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary font-heading">
                Today's Appointments
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
            
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-500 font-medium text-sm">
                        {appointment.patient.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{appointment.patient}</p>
                      <p className="text-sm text-text-secondary">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">{appointment.time}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'waiting' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary font-heading mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full btn-primary text-left">
                Book New Appointment
              </button>
              <button className="w-full btn-outline text-left">
                Manage Queue
              </button>
              <button className="w-full btn-outline text-left">
                Add New Patient
              </button>
              <button className="w-full btn-outline text-left">
                View Reports
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary font-heading mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-text-secondary">
                  New patient registered
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-text-secondary">
                  Appointment completed
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p className="text-sm text-text-secondary">
                  Payment received
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
