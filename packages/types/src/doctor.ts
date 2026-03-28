export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export interface Doctor {
  _id: string
  userId: string
  hospitalId: string
  name: string
  specialization: string
  qualifications: string[]
  experience: number
  photo?: string
  bio?: string
  isVerified: boolean
  isPublic: boolean
  verifiedBy?: string
  inviteToken?: string
  inviteExpiry?: Date
  createdAt: Date
}
