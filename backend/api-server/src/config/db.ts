import mongoose from 'mongoose'
import dns from 'dns'

// DNS override — must happen before any network call
dns.setServers(['8.8.8.8', '8.8.4.4'])

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 3000

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment variables')
    process.exit(1)
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 MongoDB connection attempt ${attempt}/${MAX_RETRIES}...`)

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4
        maxPoolSize: 10,
        minPoolSize: 2,
      })

      console.log('✅ MongoDB connected successfully')
      console.log(`📦 Database: ${mongoose.connection.db?.databaseName}`)

      // Connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB error:', err)
      })

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected')
      })

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected')
      })

      return // success — exit retry loop

    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message)

      if (attempt === MAX_RETRIES) {
        console.error('❌ All MongoDB connection attempts failed. Exiting.')
        process.exit(1)
      }

      console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`)
      await sleep(RETRY_DELAY_MS)
    }
  }
}

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect()
  console.log('🔌 MongoDB disconnected cleanly')
}
