import mongoose, { Schema, Document } from 'mongoose'

export type AppointmentStatus = 'booked' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled'

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId
  doctorId: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  date: Date
  timeSlot: string
  status: AppointmentStatus
  notes?: string
  cancelReason?: string
}

const AppointmentSchema = new Schema<IAppointment>({
  patientId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:     { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  hospitalId:   { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  date:         { type: Date, required: true },
  timeSlot:     { type: String, required: true },
  status:       { type: String, enum: ['booked','confirmed','ongoing','completed','cancelled'], default: 'booked' },
  notes:        { type: String },
  cancelReason: { type: String },
}, { 
  timestamps: true,
  strict: true,
  strictQuery: true
})

// Compound indexes for scale
AppointmentSchema.index({ patientId: 1, date: -1 }) // Patient's appointments newest first
AppointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }) // Check slot availability
AppointmentSchema.index({ hospitalId: 1, date: 1 }) // Hospital's daily schedule

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema)
