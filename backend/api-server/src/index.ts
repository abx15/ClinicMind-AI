import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { connectDB } from './config/db'
import { env } from './config/env'
import { errorHandler } from './middlewares/errorHandler'
import { authRoutes } from './routes/auth.routes'
import hospitalRoutes from './routes/hospital.routes'
import doctorRoutes from './routes/doctor.routes'
import patientRoutes from './routes/patient.routes'
import staffRoutes from './routes/staff.routes'
import appointmentRoutes from './routes/appointment.routes'
import queueRoutes from './routes/queue.routes'
import prescriptionRoutes from './routes/prescription.routes'
import whatsappRoutes from './routes/whatsapp.routes'
import aiRoutes from './routes/ai.routes'
import billingRoutes from './routes/billing.routes'
import { registerSocketHandlers } from './socket'

const app = express()
const httpServer = createServer(app)

// CORS
const allowedOrigins = env.FRONTEND_URLS.split(',').map(o => o.trim())
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

registerSocketHandlers(io)

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'ClinicMind API',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  })
})

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/hospitals', hospitalRoutes)
app.use('/api/v1/doctors', doctorRoutes)
app.use('/api/v1/patients', patientRoutes)
app.use('/api/v1/staff', staffRoutes)
app.use('/api/v1/appointments', appointmentRoutes)
app.use('/api/v1/queue', queueRoutes)
app.use('/api/v1/prescriptions', prescriptionRoutes)
app.use('/api/v1/whatsapp', whatsappRoutes)
app.use('/api/v1/ai', aiRoutes)
app.use('/api/v1/billing', billingRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.path} not found` })
})

// Global error handler
app.use(errorHandler)

// Start server
const bootstrap = async () => {
  await connectDB()

  httpServer.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
    console.log(`📋 Health: http://localhost:${env.PORT}/health`)
    console.log(`🌍 Environment: ${env.NODE_ENV}`)
  })
}

bootstrap()
