'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useQueueSocket } from '@/hooks/useQueueSocket'
import { useRole } from '@/hooks/useRole'
import { queueService } from '@/lib/services/queueService'
import CurrentPatientCard from '@/components/queue/CurrentPatientCard'
import QueueTokenCard from '@/components/queue/QueueTokenCard'

// Mock data - replace with actual API calls
const mockTokens = [
  {
    _id: '1',
    tokenNumber: 9,
    patient: {
      name: 'Ramesh Kumar',
      complaint: 'Chest pain and shortness of breath'
    },
    status: 'called',
    calledAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedWaitMinutes: 0
  },
  {
    _id: '2',
    tokenNumber: 10,
    patient: {
      name: 'Sunita Devi',
      complaint: 'Fever and body ache'
    },
    status: 'waiting',
    estimatedWaitMinutes: 8
  },
  {
    _id: '3',
    tokenNumber: 11,
    patient: {
      name: 'Amit Sharma',
      complaint: 'Headache and dizziness'
    },
    status: 'waiting',
    estimatedWaitMinutes: 15
  },
  {
    _id: '4',
    tokenNumber: 12,
    patient: {
      name: 'Priya Patel',
      complaint: 'Stomach pain'
    },
    status: 'waiting',
    estimatedWaitMinutes: 22
  },
]

export default function DoctorQueuePage() {
  const { userId, hospitalId } = useRole()
  const queryClient = useQueryClient()
  const [tokens, setTokens] = useState(mockTokens)

  // Fetch today's queue
  const { data, isLoading } = useQuery({
    queryKey: ['queue', 'today', userId],
    queryFn: () => Promise.resolve({ data: { tokens: mockTokens } }),
    enabled: !!userId,
    refetchInterval: 60000, // fallback poll
  })

  useEffect(() => {
    if (data?.data?.tokens) setTokens(data.data.tokens)
  }, [data])

  // Real-time Socket.IO updates
  const { isConnected } = useQueueSocket({
    doctorId: userId || '',
    onNewToken: (token) => {
      setTokens(prev => [...prev, token])
      alert(`New patient: ${token.patient?.name || 'Token #' + token.tokenNumber}`)
    },
    onTokenCalled: (token) => {
      setTokens(prev => prev.map(t =>
        t._id === token._id ? { ...t, status: 'called', calledAt: new Date().toISOString() } : t
      ))
    },
    onTokenDone: (token) => {
      setTokens(prev => prev.map(t =>
        t._id === token._id ? { ...t, status: 'done' } : t
      ))
    },
    onEtaUpdated: (updatedTokens) => {
      setTokens(prev => prev.map(t => {
        const updated = updatedTokens.find(u => u._id === t._id)
        return updated ? { ...t, estimatedWaitMinutes: updated.estimatedWaitMinutes } : t
      }))
    },
  })

  // Call next token mutation
  const callMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      console.log('Calling next token:', tokenId)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { data: { token: tokens.find(t => t._id === tokenId) } }
    },
    onSuccess: (res) => {
      const called = res.data.token
      setTokens(prev => prev.map(t =>
        t._id === called._id ? { ...t, status: 'called', calledAt: new Date().toISOString() } : t
      ))
      alert(`Called: ${called.patient?.name || 'Token #' + called.tokenNumber}`)
    },
  })

  // Mark done mutation
  const doneMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      console.log('Marking token done:', tokenId)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { data: { token: tokens.find(t => t._id === tokenId) } }
    },
    onSuccess: (res) => {
      const done = res.data.token
      setTokens(prev => prev.map(t =>
        t._id === done._id ? { ...t, status: 'done' } : t
      ))
    },
  })

  // Separate by status
  const currentToken  = tokens.find(t => t.status === 'called' || t.status === 'in-progress')
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
      {/* Connection status */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          isConnected 
            ? 'bg-[#E1F5EE] text-[#0F6E56]' 
            : 'bg-[#FCEBEB] text-[#A32D2D]'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isConnected ? 'bg-[#0F6E56]' : 'bg-[#A32D2D]'}`}/>
          {isConnected ? 'Live' : 'Offline'}
        </span>
        <span className="text-xs text-[#8A9E98]">
          {isConnected ? 'Real-time updates active' : 'Reconnecting...'}
        </span>
      </div>

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

      {/* Two column layout */}
      <div className="grid grid-cols-[1fr_300px] gap-5">
        {/* Left: Queue list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#1A2420]">Patient Queue</h3>
            {nextToken && (
              <button
                onClick={() => callMutation.mutate(nextToken._id)}
                disabled={callMutation.isPending || !!currentToken}
                className="px-4 py-1.5 bg-[#0F6E56] text-white rounded-lg text-xs
                           font-semibold hover:bg-[#094D3C] disabled:opacity-50
                           disabled:cursor-not-allowed transition-colors"
              >
                Call Next →
              </button>
            )}
          </div>

          {/* Current patient */}
          {currentToken && (
            <CurrentPatientCard
              token={currentToken}
              onMarkDone={() => doneMutation.mutate(currentToken._id)}
              isLoading={doneMutation.isPending}
            />
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
              <QueueTokenCard key={token._id} token={token} />
            ))
          )}
        </div>

        {/* Right: AI tools panel */}
        <div className="space-y-4">
          {/* Voice prescription */}
          <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8E4]">
              <h4 className="text-sm font-semibold text-[#1A2420]">
                Voice Prescription
              </h4>
              <p className="text-xs text-[#8A9E98] mt-0.5">AI-powered entry</p>
            </div>
            <div className="p-4">
              <div className="bg-[#E1F5EE] border-2 border-dashed border-[#5DCAA5] rounded-xl
                         p-6 text-center cursor-pointer hover:bg-[#0F6E56] group transition-all">
                <div className="text-3xl mb-2">🎙️</div>
                <p className="text-sm font-semibold text-[#0F6E56] group-hover:text-white">
                  Tap to Record
                </p>
                <p className="text-xs text-[#8A9E98] group-hover:text-white/70">
                  Speak prescription details
                </p>
              </div>
            </div>
          </div>

          {/* Drug checker */}
          <div className="bg-white rounded-2xl border border-[#E2E8E4] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8E4]">
              <h4 className="text-sm font-semibold text-[#1A2420]">Drug Checker</h4>
              <p className="text-xs text-[#8A9E98] mt-0.5">AI interaction check</p>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Drug 1 (e.g. Aspirin 75mg)"
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-xs
                           text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                           focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]/20"
                />
                <input
                  type="text"
                  placeholder="Drug 2 (e.g. Paracetamol 500mg)"
                  className="w-full border border-[#E2E8E4] rounded-lg px-3 py-2 text-xs
                           text-[#1A2420] placeholder:text-[#8A9E98] outline-none
                           focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]/20"
                />
                <button className="w-full py-2 bg-[#0F6E56] text-white rounded-lg text-xs font-semibold
                         hover:bg-[#094D3C] transition-colors">
                  Check Interactions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
