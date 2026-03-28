'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface QueueSocketOptions {
  doctorId: string
  onNewToken?: (token: any) => void
  onTokenCalled?: (token: any) => void
  onTokenDone?: (token: any) => void
  onEtaUpdated?: (tokens: any[]) => void
}

export function useQueueSocket({
  doctorId,
  onNewToken,
  onTokenCalled,
  onTokenDone,
  onEtaUpdated
}: QueueSocketOptions) {
  const socketRef = useRef<Socket | null>(null)
  const isConnectedRef = useRef(false)

  useEffect(() => {
    if (!doctorId) return

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        doctorId,
        role: 'doctor'
      }
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to queue socket')
      isConnectedRef.current = true
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from queue socket')
      isConnectedRef.current = false
    })

    // Queue events
    socket.on('new-token', (token) => {
      console.log('New token:', token)
      onNewToken?.(token)
    })

    socket.on('token-called', (token) => {
      console.log('Token called:', token)
      onTokenCalled?.(token)
    })

    socket.on('token-done', (token) => {
      console.log('Token done:', token)
      onTokenDone?.(token)
    })

    socket.on('eta-updated', (tokens) => {
      console.log('ETA updated:', tokens)
      onEtaUpdated?.(tokens)
    })

    // Join doctor's room
    socket.emit('join-doctor-room', { doctorId })

    return () => {
      socket.disconnect()
      socketRef.current = null
      isConnectedRef.current = false
    }
  }, [doctorId, onNewToken, onTokenCalled, onTokenDone, onEtaUpdated])

  return {
    isConnected: isConnectedRef.current,
    socket: socketRef.current
  }
}
