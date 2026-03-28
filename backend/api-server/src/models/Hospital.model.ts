import mongoose, { Schema, Document } from 'mongoose'

export type HospitalStatus = 'pending' | 'verified' | 'rejected' | 'suspended'
export type HospitalPlan = 'free' | 'pro' | 'growth'

export interface IHospital extends Document {
  name: string
  slug: string
  address: string
  city: string
  pincode: string
  licenseNumber: string
  phone: string
  email: string
  adminUserId: mongoose.Types.ObjectId
  status: HospitalStatus
  plan: HospitalPlan
  description?: string
  specializations: string[]
  verifiedAt?: Date
  verifiedBy?: mongoose.Types.ObjectId
  rejectedReason?: string
  createdAt: Date
  updatedAt: Date
}

const HospitalSchema = new Schema<IHospital>({
  name:            { type: String, required: true, trim: true },
  slug:            { type: String, required: true, unique: true, lowercase: true },
  address:         { type: String, required: true },
  city:            { type: String, required: true, trim: true },
  pincode:         { type: String, required: true, match: /^\d{6}$/ },
  licenseNumber:   { type: String, required: true },
  phone:           { type: String, required: true },
  email:           { type: String, required: true, lowercase: true },
  adminUserId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status:          { type: String, enum: ['pending','verified','rejected','suspended'], default: 'pending' },
  plan:            { type: String, enum: ['free','pro','growth'], default: 'free' },
  description:     { type: String },
  specializations: [{ type: String }],
  verifiedAt:      { type: Date },
  verifiedBy:      { type: Schema.Types.ObjectId, ref: 'User' },
  rejectedReason:  { type: String },
}, { timestamps: true })

HospitalSchema.index({ status: 1 })
HospitalSchema.index({ slug: 1 })
HospitalSchema.index({ adminUserId: 1 })
HospitalSchema.index({ city: 1, status: 1 })

export const Hospital = mongoose.model<IHospital>('Hospital', HospitalSchema)
