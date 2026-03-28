import mongoose, { Schema, Document } from 'mongoose'

export interface IStaff extends Document {
  userId: mongoose.Types.ObjectId
  hospitalId: mongoose.Types.ObjectId
  role: 'receptionist' | 'nurse' | 'pharmacist'
  isActive: boolean
}

const StaffSchema = new Schema<IStaff>({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId:  { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  role:        { type: String, enum: ['receptionist','nurse','pharmacist'], default: 'receptionist' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

StaffSchema.index({ hospitalId: 1 })

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema)
