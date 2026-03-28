export type HospitalStatus = 'pending' | 'verified' | 'rejected' | 'suspended'

export interface Hospital {
  _id: string
  name: string
  slug: string
  address: string
  city: string
  pincode: string
  licenseNumber: string
  adminUserId: string
  status: HospitalStatus
  plan: 'free' | 'pro' | 'growth'
  verifiedAt?: Date
  verifiedBy?: string
  createdAt: Date
}
