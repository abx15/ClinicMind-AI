import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
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
import adminRoutes from './routes/admin.routes'
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

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}))

// Compression
app.use(compression({
  threshold: 1024, // Only compress responses larger than 1KB
  level: 6, // Compression level (1-9, 6 is default)
}))

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP for auth endpoints
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per user for AI endpoints
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    error: 'Too many AI requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute for admin endpoints
  message: {
    error: 'Too many admin requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply global rate limiting
app.use(globalLimiter)

// Response time middleware
app.use((req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    res.setHeader('X-Response-Time', `${duration}ms`)
    
    // Log slow requests
    if (duration > 500) {
      console.warn(`⚠️  Slow request: ${req.method} ${req.path} - ${duration}ms`)
    }
  })
  
  next()
})

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

// Routes with specific rate limiting
app.use('/api/v1/auth', authLimiter, authRoutes)
app.use('/api/v1/hospitals', hospitalRoutes)
app.use('/api/v1/doctors', doctorRoutes)
app.use('/api/v1/patients', patientRoutes)
app.use('/api/v1/staff', staffRoutes)
app.use('/api/v1/appointments', appointmentRoutes)
app.use('/api/v1/queue', queueRoutes)
app.use('/api/v1/prescriptions', prescriptionRoutes)
app.use('/api/v1/whatsapp', whatsappRoutes)
app.use('/api/v1/ai', aiLimiter, aiRoutes)
app.use('/api/v1/billing', billingRoutes)
app.use('/api/v1/admin', adminLimiter, adminRoutes)

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
