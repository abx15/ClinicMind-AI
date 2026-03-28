import mongoose, { Schema, Document } from 'mongoose'

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  bloodGroup?: string
  allergies: string[]
  medicalHistory: string[]
  emergencyContact?: { name: string; phone: string; relation: string }
}

const PatientSchema = new Schema<IPatient>({
  userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dateOfBirth:      { type: Date },
  gender:           { type: String, enum: ['male','female','other'] },
  bloodGroup:       { type: String },
  allergies:        [{ type: String }],
  medicalHistory:   [{ type: String }],
  emergencyContact: {
    name:     { type: String },
    phone:    { type: String },
    relation: { type: String },
  },
}, { timestamps: true })

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema)
