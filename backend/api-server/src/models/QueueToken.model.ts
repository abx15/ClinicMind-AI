import mongoose, { Schema, Document } from 'mongoose'

export type QueueStatus = 'waiting' | 'called' | 'in-progress' | 'done' | 'skipped'

export interface IQueueToken extends Document {
  tokenNumber: number
  patientId: mongoose.Types.ObjectId
  doctorId: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  appointmentId?: mongoose.Types.ObjectId
  status: QueueStatus
  estimatedWaitMinutes: number
  date: Date
  calledAt?: Date
  completedAt?: Date
}

const QueueTokenSchema = new Schema<IQueueToken>({
  tokenNumber:          { type: Number, required: true },
  patientId:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:             { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  hospitalId:           { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  appointmentId:        { type: Schema.Types.ObjectId, ref: 'Appointment' },
  status:               { type: String, enum: ['waiting','called','in-progress','done','skipped'], default: 'waiting' },
  estimatedWaitMinutes: { type: Number, default: 0 },
  date:                 { type: Date, required: true, default: () => new Date() },
  calledAt:             { type: Date },
  completedAt:          { type: Date },
}, { 
  timestamps: true,
  strict: true,
  strictQuery: true
})

// Compound indexes for scale
QueueTokenSchema.index({ hospitalId: 1, doctorId: 1, date: 1, status: 1 }) // Today's queue per doctor
QueueTokenSchema.index({ patientId: 1, status: 1 }) // Patient's active token
// TTL index to auto delete tokens older than 7 days
QueueTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 * 7 })

export const QueueToken = mongoose.model<IQueueToken>('QueueToken', QueueTokenSchema)
