import mongoose, { Schema, Document, Model } from 'mongoose'

export type UserRole = 'superadmin' | 'hospital_admin' | 'doctor' | 'staff' | 'patient'

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  passwordHash?: string
  role: UserRole
  hospitalId: mongoose.Types.ObjectId | null
  isVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  toSafeObject(): Omit<IUser, 'passwordHash'>
}

const UserSchema = new Schema<IUser>({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:        { type: String, required: true, trim: true },
  passwordHash: { type: String, required: false, select: false },
  role:         {
    type: String,
    enum: ['superadmin','hospital_admin','doctor','staff','patient'],
    required: true
  },
  hospitalId:   { type: Schema.Types.ObjectId, ref: 'Hospital', default: null },
  isVerified:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
}, { 
  timestamps: true,
  strict: true,
  strictQuery: true
})

// Compound indexes for scale
UserSchema.index({ email: 1 }, { unique: true }) // Already exists, ensuring unique
UserSchema.index({ hospitalId: 1, role: 1 }) // For fetching all doctors of a hospital
UserSchema.index({ role: 1, isActive: 1 }) // For filtering active users by role

UserSchema.methods.toSafeObject = function() {
  const obj = this.toObject()
  delete obj.passwordHash
  return obj
}

export const User = mongoose.model<IUser>('User', UserSchema)
