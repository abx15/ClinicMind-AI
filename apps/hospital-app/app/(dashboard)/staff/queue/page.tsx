'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRole } from '@/hooks/useRole'
import { queueService } from '@/lib/services/queueService'

// Mock data - replace with actual API calls
const mockTokens = [
  {
    _id: '1',
    tokenNumber: 15,
    patient: {
      name: 'Rohit Kumar',
      complaint: 'Regular checkup'
    },
    status: 'waiting',
    estimatedWaitMinutes: 5
  },
  {
    _id: '2',
    tokenNumber: 16,
    patient: {
      name: 'Meera Devi',
      complaint: 'Follow-up consultation'
    },
    status: 'waiting',
    estimatedWaitMinutes: 12
  },
  {
    _id: '3',
    tokenNumber: 17,
    patient: {
      name: 'Amit Sharma',
      complaint: 'New patient registration'
    },
    status: 'waiting',
    estimatedWaitMinutes: 18
  },
]

export default function StaffQueuePage() {
  const { userId, hospitalId } = useRole()
  const queryClient = useQueryClient()
  const [tokens, setTokens] = useState(mockTokens)

  // Fetch today's queue
  const { data, isLoading } = useQuery({
    queryKey: ['queue', 'staff-today', hospitalId],
    queryFn: () => Promise.resolve({ data: { tokens: mockTokens } }),
    enabled: !!hospitalId,
    refetchInterval: 30000, // fallback poll
  })

  useEffect(() => {
    if (data?.data?.tokens) setTokens(data.data.tokens)
  }, [data])

  // Add token mutation
  const addTokenMutation = useMutation({
    mutationFn: async (data: { patientName: string, complaint: string }) => {
      console.log('Adding token:', data)
      const newToken = {
        _id: Date.now().toString(),
        tokenNumber: Math.max(...tokens.map(t => t.tokenNumber)) + 1,
        patient: {
          name: data.patientName,
          complaint: data.complaint
        },
        status: 'waiting',
        estimatedWaitMinutes: 5
      }
      setTokens(prev => [...prev, newToken])
      return { data: { token: newToken } }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
    },
  })

  // Call token mutation
  const callMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      console.log('Calling token:', tokenId)
      const called = tokens.find(t => t._id === tokenId)
      if (called) {
        setTokens(prev => prev.map(t =>
          t._id === tokenId ? { ...t, status: 'called', calledAt: new Date().toISOString() } : t
        ))
      }
      return { data: { token: called } }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
    },
  })

  // Separate by status
  const currentToken  = tokens.find(t => t.status === 'called')
  const waitingTokens = tokens.filter(t => t.status === 'waiting')
  const doneTokens    = tokens.filter(t => t.status === 'done')
  const nextToken     = waitingTokens[0]

  // Stats
  const stats = [
    { label: 'Waiting',   value: waitingTokens.length, color: 'amber'  },
    { label: 'In Progress', value: currentToken ? 1 : 0, color: 'teal' },
    { label: 'Completed', value: doneTokens.length,     color: 'blue'  },
    { label: 'Total',     value: tokens.length,         color: 'gray'  },
  ]

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="font-syne font-bold text-2xl text-[#1A2420]">
              {s.value}
            </div>
            <div className="text-xs text-[#8A9E98] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Queue management */}
      <div className="grid grid-cols-[1fr_300px] gap-5">
        {/* Left: Queue list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#1A2420]">Patient Queue</h3>
            <button
              onClick={() => {
                // Show add token modal or form
                const patientName = prompt('Enter patient name:')
                const complaint = prompt('Enter chief complaint:')
                if (patientName && complaint) {
                  addTokenMutation.mutate({ patientName, complaint })
                }
              }}
              className="px-4 py-1.5 bg-[#0F6E56] text-white rounded-lg text-xs
                         font-semibold hover:bg-[#094D3C] transition-colors"
            >
              + Add Patient
            </button>
          </div>

          {/* Current patient */}
          {currentToken && (
            <div className="bg-[#E1F5EE] rounded-xl border-2 border-[#5DCAA5] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0F6E56] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {currentToken.tokenNumber.toString().padStart(3, '0')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A2420] text-lg">NOW SERVING</h3>
                    <p className="text-xs text-[#0F6E56] font-medium">Token #{currentToken.tokenNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Mark as done
                    setTokens(prev => prev.map(t =>
                      t._id === currentToken._id ? { ...t, status: 'done' } : t
                    ))
                  }}
                  className="px-4 py-2 bg-[#0F6E56] text-white text-sm font-semibold rounded-lg
                           hover:bg-[#094D3C] transition-colors"
                >
                  Mark Done ✓
                </button>
              </div>

              {/* Patient info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#1A2420] text-xl">
                  {currentToken.patient?.name || 'Patient Name'}
                </h4>
                <p className="text-sm text-[#4A5E58] mt-1">
                  Chief complaint: {currentToken.patient?.complaint || 'Not specified'}
                </p>
                {currentToken.calledAt && (
                  <div className="flex items-center gap-2 text-sm text-[#8A9E98]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Called at: {new Date(currentToken.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="mt-4 pt-4 border-t border-[#5DCAA5]/30 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-white text-[#0F6E56] text-xs font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
                  View Profile
                </button>
                <button className="flex-1 px-3 py-2 bg-white text-[#0F6E56] text-xs font-semibold rounded-lg hover:bg-[#F4F6F4] transition-colors">
                  Notes
                </button>
              </div>
            </div>
          )}

          {/* Waiting list */}
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-[#E2E8E4] animate-pulse" />
            ))
          ) : waitingTokens.length === 0 && !currentToken ? (
            <div className="bg-white rounded-2xl border border-[#E2E8E4] p-10 text-center">
              <p className="text-[#8A9E98] text-sm">No patients in queue</p>
            </div>
          ) : (
            waitingTokens.map((token) => (
              <div key={token._id} className="bg-white rounded-xl border border-[#E2E8E4] p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Token number */}
                  <div className="w-10 h-10 bg-[#F4F6F4] border border-[#E2E8E4] rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-[#8A9E98]">
                      #{token.tokenNumber.toString().padStart(3, '0')}
                    </span>
                  </div>

                  {/* Patient info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#1A2420] text-sm truncate">
                      {token.patient?.name || 'Patient Name'}
                    </h4>
                    <p className="text-xs text-[#8A9E98] mt-0.5">
                      {token.patient?.complaint || 'No complaint specified'}
                    </p>
                  </div>

                  {/* ETA */}
                  {token.estimatedWaitMinutes && (
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FEF3E2] text-[#B86E0A]">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                          <circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M6 3v3l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        ~{token.estimatedWaitMinutes} min
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Quick actions */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8E4]">
              <h4 className="text-sm font-semibold text-[#1A2420]">Today's Summary</h4>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A9E98]">Total Patients</span>
                <span className="font-semibold text-[#1A2420]">{tokens.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A9E98]">Avg Wait Time</span>
                <span className="font-semibold text-[#1A2420]">12 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A9E98]">Completed</span>
                <span className="font-semibold text-[#1A2420]">{doneTokens.length}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8E4]">
              <h4 className="text-sm font-semibold text-[#1A2420]">Quick Actions</h4>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full py-2 text-center text-sm text-[#0F6E56] font-semibold rounded-lg hover:bg-[#E1F5EE] transition-colors">
                Register New Patient
              </button>
              <button className="w-full py-2 text-center text-sm text-[#1D63B5] font-semibold rounded-lg hover:bg-[#E6F1FB] transition-colors">
                View All Patients
              </button>
              <button className="w-full py-2 text-center text-sm text-[#534AB7] font-semibold rounded-lg hover:bg-[#EEEDFE] transition-colors">
                View Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
