export interface Hospital {
  _id: string
  name: string
  email: string
  phone: string
  city: string
  state: string
  address: string
  specialization: string[]
  isVerified: boolean
  doctorCount?: number
  patientCount?: number
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  role: string
}
