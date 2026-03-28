'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  url?: string
  autoConnect?: boolean
}

export function useSocket(options: UseSocketOptions = {}) {
  const { url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', autoConnect = true } = options
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (autoConnect) {
      const socket = io(url)
      socketRef.current = socket

      socket.on('connect', () => {
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })

      return () => {
        socket.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
    }
  }, [url, autoConnect])

  return {
    socket: socketRef.current,
    isConnected,
  }
}
