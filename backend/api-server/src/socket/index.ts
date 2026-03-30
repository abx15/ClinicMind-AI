import type { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import Redis from 'ioredis'
import { createAdapter } from '@socket.io/redis-adapter'
import { User } from '../models/User.model'
import { initializeQueueSocket } from './queue.socket'

interface AuthenticatedSocket extends Socket {
  data: {
    user: any
  }
}

export function registerSocketHandlers(io: Server) {
  // Create Redis adapter for scaling
  const pubClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  })

  const subClient = pubClient.duplicate()

  io.adapter(createAdapter(pubClient, subClient))

  initializeQueueSocket(io)

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      const user = await User.findById(decoded.userId).select('-password')
      
      if (!user) {
        return next(new Error('User not found'))
      }

      socket.data.user = user
      next()
    } catch (error) {
      next(new Error('Invalid authentication token'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.data.user
    console.log(`User connected: ${user._id} (${user.role})`)

    socket.join(`user:${user._id}`)
    
    if (user.role === 'patient') {
      socket.join(`patient:${user._id}`)
    } else if (user.role === 'doctor') {
      socket.join(`doctor:${user._id}`)
      if (user.hospitalId) {
        const today = new Date().toISOString().split('T')[0]
        socket.join(`queue:doctor:${user._id}:${today}`) // Include date for auto-expire
      }
    } else if (user.role === 'hospital_admin') {
      socket.join(`hospital:${user._id}`)
    } else if (user.role === 'staff') {
      if (user.hospitalId) {
        socket.join(`hospital:${user.hospitalId}`)
      }
    }

    socket.on('queue:join', (data: { doctorId: string, hospitalId: string }) => {
      if (user.role === 'patient') {
        const today = new Date().toISOString().split('T')[0]
        const room = `queue:doctor:${data.doctorId}:${today}`
        socket.join(room)
        socket.emit('queue:joined', { doctorId: data.doctorId, hospitalId: data.hospitalId })
      }
    })

    socket.on('queue:leave', (data: { doctorId: string, hospitalId: string }) => {
      if (user.role === 'patient') {
        const today = new Date().toISOString().split('T')[0]
        const room = `queue:doctor:${data.doctorId}:${today}`
        socket.leave(room)
        socket.emit('queue:left', { doctorId: data.doctorId, hospitalId: data.hospitalId })
      }
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user._id} (${user.role})`)
    })
  })
}
