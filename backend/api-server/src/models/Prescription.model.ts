import mongoose, { Schema, Document } from 'mongoose'

interface IMedication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface IPrescription extends Document {
  patientId: mongoose.Types.ObjectId
  doctorId: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  appointmentId?: mongoose.Types.ObjectId
  diagnosis: string
  medications: IMedication[]
  notes?: string
  voiceTranscript?: string
  aiGenerated: boolean
}

const MedicationSchema = new Schema<IMedication>({
  name:         { type: String, required: true },
  dosage:       { type: String, required: true },
  frequency:    { type: String, required: true },
  duration:     { type: String, required: true },
  instructions: { type: String },
}, { _id: false })

const PrescriptionSchema = new Schema<IPrescription>({
  patientId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:       { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  hospitalId:     { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  appointmentId:  { type: Schema.Types.ObjectId, ref: 'Appointment' },
  diagnosis:      { type: String, required: true },
  medications:    [MedicationSchema],
  notes:          { type: String },
  voiceTranscript: { type: String },
  aiGenerated:    { type: Boolean, default: false },
}, { timestamps: true })

PrescriptionSchema.index({ patientId: 1 })
PrescriptionSchema.index({ hospitalId: 1, doctorId: 1 })

export const Prescription = mongoose.model<IPrescription>('Prescription', PrescriptionSchema)
