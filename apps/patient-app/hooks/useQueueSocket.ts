'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { QueueToken, QueueEventType } from '@clinicmind/types'

interface UseQueueSocketProps {
  doctorId: string
  onTokenCalled?: (token: QueueToken) => void
  onEtaUpdated?: (tokens: QueueToken[]) => void
  onTokenDone?: (token: QueueToken) => void
  onTokenSkipped?: (token: QueueToken) => void
}

export function useQueueSocket({
  doctorId,
  onTokenCalled,
  onEtaUpdated,
  onTokenDone,
  onTokenSkipped,
}: UseQueueSocketProps) {
  const socketRef = useRef<Socket | null>(null)
  const isConnectedRef = useRef(false)

  useEffect(() => {
    if (!doctorId) return

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
    
    socketRef.current = io(socketUrl, {
      transports: ['websocket'],
      upgrade: false,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
      isConnectedRef.current = true
      // Join doctor's queue room
      socket.emit('join-doctor-queue', { doctorId })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
      isConnectedRef.current = false
    })

    // Queue event listeners
    socket.on('queue:token-called', (token: QueueToken) => {
      onTokenCalled?.(token)
    })

    socket.on('queue:eta-updated', (tokens: QueueToken[]) => {
      onEtaUpdated?.(tokens)
    })

    socket.on('queue:token-done', (token: QueueToken) => {
      onTokenDone?.(token)
    })

    socket.on('queue:token-skipped', (token: QueueToken) => {
      onTokenSkipped?.(token)
    })

    return () => {
      socket.emit('leave-doctor-queue', { doctorId })
      socket.disconnect()
      isConnectedRef.current = false
    }
  }, [doctorId, onTokenCalled, onEtaUpdated, onTokenDone, onTokenSkipped])

  return {
    isConnected: isConnectedRef.current,
    socket: socketRef.current,
  }
}
