import mongoose, { Schema, Document } from 'mongoose'

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  name: string
  specialization: string
  qualifications: string[]
  experience: number
  photo?: string
  bio?: string
  consultationFee: number
  isVerified: boolean
  isPublic: boolean
  verifiedBy?: mongoose.Types.ObjectId
  verifiedAt?: Date
  inviteToken?: string
  inviteExpiry?: Date
}

const DoctorSchema = new Schema<IDoctor>({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospitalId:      { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  name:            { type: String, required: true },
  specialization:  { type: String, required: true },
  qualifications:  [{ type: String }],
  experience:      { type: Number, default: 0 },
  photo:           { type: String },
  bio:             { type: String },
  consultationFee: { type: Number, default: 0 },
  isVerified:      { type: Boolean, default: false },
  isPublic:        { type: Boolean, default: false },
  verifiedBy:      { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt:      { type: Date },
  inviteToken:     { type: String },
  inviteExpiry:    { type: Date },
}, { timestamps: true })

DoctorSchema.index({ hospitalId: 1, isVerified: 1 })
DoctorSchema.index({ hospitalId: 1, isPublic: 1 })
DoctorSchema.index({ specialization: 1 })

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema)
