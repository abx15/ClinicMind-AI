'use client'

import { useState, useEffect } from 'react'
import { ClockIcon, UsersIcon, WifiIcon, WifiOffIcon, BellIcon, Volume2Icon } from '@/components/icons'
import { QueueToken } from '@clinicmind/types'

interface QueueStatusCardProps {
  token: QueueToken
  liveEta: number
  isConnected: boolean
}

export default function QueueStatusCard({ token, liveEta, isConnected }: QueueStatusCardProps) {
  const [timeLeft, setTimeLeft] = useState(liveEta * 60) // Convert minutes to seconds
  const [positionInQueue, setPositionInQueue] = useState(3) // Mock position

  // Countdown timer
  useEffect(() => {
    if (token.status === 'waiting' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [token.status, timeLeft])

  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = () => {
    switch (token.status) {
      case 'waiting':
        return 'bg-amber-500'
      case 'called':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-blue-500'
      case 'done':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (token.status) {
      case 'waiting':
        return 'WAITING'
      case 'called':
        return 'CALLED'
      case 'in-progress':
        return 'IN PROGRESS'
      case 'done':
        return 'COMPLETED'
      default:
        return 'UNKNOWN'
    }
  }

  const getCardBackground = () => {
    if (token.status === 'called') {
      return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
    }
    return 'bg-white'
  }

  const progressPercentage = positionInQueue > 0 ? ((token.tokenNumber - positionInQueue + 1) / token.tokenNumber) * 100 : 100

  return (
    <div className={`card p-8 ${getCardBackground()} ${token.status === 'called' ? 'border-2' : ''}`}>
      {/* Status Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${token.status === 'waiting' ? 'animate-pulse' : ''}`}></div>
          <h3 className={`text-lg font-semibold ${token.status === 'called' ? 'text-green-700' : 'text-text-primary'}`}>
            {getStatusText()}
          </h3>
          {token.status === 'waiting' && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <WifiIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Live</span>
            </>
          ) : (
            <>
              <WifiOffIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Token Number */}
      <div className="text-center mb-8">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${
          token.status === 'called' 
            ? 'bg-green-500 text-white shadow-lg' 
            : 'bg-primary-100 text-primary-600'
        }`}>
          <span className="text-5xl font-bold font-heading">
            #{String(token.tokenNumber).padStart(3, '0')}
          </span>
        </div>
        
        {token.status === 'called' && (
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold animate-pulse">
            🎉 IT'S YOUR TURN!
          </div>
        )}
      </div>

      {/* Token Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-text-muted">Doctor:</span>
          <span className="font-medium text-text-primary">Dr. {token.doctorId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-muted">Hospital:</span>
          <span className="font-medium text-text-primary">Apollo Hospitals</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-muted">Time joined:</span>
          <span className="font-medium text-text-primary">10:45 AM</span>
        </div>
      </div>

      {/* ETA Section */}
      {token.status === 'waiting' && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted">Estimated wait:</span>
            <span className="font-semibold text-text-primary">
              ~{liveEta} minutes
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Time remaining:</span>
            <span className="font-mono font-semibold text-primary-600">
              {formatTimeLeft(timeLeft)}
            </span>
          </div>
        </div>
      )}

      {/* Position in Queue */}
      {token.status === 'waiting' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted">You are #{positionInQueue} in line</span>
            <span className="text-sm text-primary-500 font-medium">
              {token.tokenNumber - positionInQueue + 1} of {token.tokenNumber}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Called State Special Message */}
      {token.status === 'called' && (
        <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <BellIcon className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Please proceed to Doctor's room</p>
              <p className="text-sm text-green-700">Your consultation is about to begin</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button className="flex-1 btn-outline flex items-center justify-center space-x-2">
          <Volume2Icon className="w-4 h-4" />
          <span>Sound On</span>
        </button>
        <button className="flex-1 btn-outline flex items-center justify-center space-x-2">
          <BellIcon className="w-4 h-4" />
          <span>Get WhatsApp Updates</span>
        </button>
      </div>
    </div>
  )
}
