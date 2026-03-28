import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  MONGODB_URI:          z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET:           z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_EXPIRES_IN:       z.string().default('7d'),
  PORT:                 z.string().default('5000'),
  NODE_ENV:             z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URLS:        z.string().default('http://localhost:3000,http://localhost:3001,http://localhost:3002'),
  AI_SERVICE_URL:       z.string().default('http://localhost:8000'),
  WHATSAPP_TOKEN:       z.string().optional(),
  WHATSAPP_PHONE_ID:    z.string().optional(),
  RAZORPAY_KEY_ID:      z.string().optional(),
  RAZORPAY_SECRET:      z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Environment validation failed:')
  parsed.error.issues.forEach(issue => {
    console.error(`   ${issue.path.join('.')}: ${issue.message}`)
  })
  process.exit(1)
}

export const env = parsed.data
console.log('✅ Environment variables validated')
