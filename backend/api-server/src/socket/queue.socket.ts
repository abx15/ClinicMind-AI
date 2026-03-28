import type { Server } from 'socket.io'

let io: Server

export function initializeQueueSocket(socketIo: Server) {
  io = socketIo
}

export function emitQueueUpdate(hospitalId: string, doctorId: string, event: string, data: any) {
  if (!io) return
  
  const room = `hospital:${hospitalId}:queue:${doctorId}`
  io.to(room).emit(`queue:${event}`, data)
}

export function registerQueueSocket(_io: Server) {
  io = _io
}
