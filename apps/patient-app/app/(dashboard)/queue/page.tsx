'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { SearchIcon, ClockIcon, UsersIcon, WifiIcon, WifiOffIcon } from '@/components/icons'
import { useQueueSocket } from '@/hooks/useQueueSocket'
import { queueService } from '@/lib/services/queueService'
import { QueueToken } from '@clinicmind/types'
import QueueStatusCard from '@/components/queue/QueueStatusCard'
import EmptyState from '@/components/common/EmptyState'

export default function QueuePage() {
  const router = useRouter()
  const [myToken, setMyToken] = useState<QueueToken | null>(null)
  const [liveEta, setLiveEta] = useState<number>(0)
  const [isConnected, setIsConnected] = useState(false)

  // Get current token status
  const { data, refetch } = useQuery({
    queryKey: ['queue', 'my-status'],
    queryFn: () => queueService.getMyStatus(),
    refetchInterval: 30000, // Poll every 30s as fallback
  })

  useEffect(() => {
    if (data?.data?.token) {
      setMyToken(data.data.token)
      setLiveEta(data.data.token.estimatedWaitMinutes)
    } else {
      setMyToken(null)
    }
  }, [data])

  // Socket.IO for live updates — join doctor's queue room
  const { isConnected: socketConnected } = useQueueSocket({
    doctorId: myToken?.doctorId || '',
    onTokenCalled: (token) => {
      if (token._id === myToken?._id) {
        setMyToken(prev => prev ? { ...prev, status: 'called' } : prev)
        // Show notification: "It's your turn!"
        // Could use toast here
      }
    },
    onEtaUpdated: (tokens) => {
      const mine = tokens.find(t => t._id === myToken?._id)
      if (mine) setLiveEta(mine.estimatedWaitMinutes)
    },
    onTokenDone: (token) => {
      if (token._id === myToken?._id) {
        setMyToken(prev => prev ? { ...prev, status: 'done' } : prev)
      }
    },
  })

  useEffect(() => {
    setIsConnected(socketConnected)
  }, [socketConnected])

  const handleJoinQueue = () => {
    router.push('/hospitals')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Queue Status
          </h1>
          <p className="text-text-muted">
            Real-time queue tracking for your appointments
          </p>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-text-muted">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Content */}
      {myToken ? (
        <QueueStatusCard
          token={myToken}
          liveEta={liveEta}
          isConnected={isConnected}
        />
      ) : (
        <EmptyState
          title="No Active Queue Token"
          description="You don't have any active queue tokens. Book an appointment to join the queue."
          actionLabel="Find Hospital"
          onAction={handleJoinQueue}
          icon={
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-gray-400" />
            </div>
          }
        />
      )}

      {/* FAQ Section */}
      {!myToken && (
        <div className="mt-8 card p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">How Queue Tracking Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-500 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">Book an Appointment</h3>
                <p className="text-sm text-text-muted">
                  Schedule an appointment with a verified doctor at any hospital.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-500 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">Get Queue Token</h3>
                <p className="text-sm text-text-muted">
                  When your appointment is confirmed, you'll get a queue token.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-500 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">Track Live Updates</h3>
                <p className="text-sm text-text-muted">
                  Monitor your queue position and estimated wait time in real-time.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-500 font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">Get Notified</h3>
                <p className="text-sm text-text-muted">
                  Receive instant notifications when your token is called.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
