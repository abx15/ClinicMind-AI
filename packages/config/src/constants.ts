export const APP_URLS = {
  patient:  process.env.NEXT_PUBLIC_PATIENT_URL  || 'http://localhost:3000',
  hospital: process.env.NEXT_PUBLIC_HOSPITAL_URL || 'http://localhost:3001',
  admin:    process.env.NEXT_PUBLIC_ADMIN_URL    || 'http://localhost:3002',
} as const

export const API_URL     = process.env.NEXT_PUBLIC_API_URL    || 'http://localhost:5000/api/v1'
export const SOCKET_URL  = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'
export const AI_URL      = process.env.NEXT_PUBLIC_AI_URL     || 'http://localhost:8000/api/v1'

export const TOKEN_KEY = 'clinicmind_token'
export const USER_KEY  = 'clinicmind_user'

export const PLANS = {
  free:   { name: 'Free',   price: 0,    maxDoctors: 2,   maxPatientsPerDay: 20  },
  pro:    { name: 'Pro',    price: 2499, maxDoctors: 10,  maxPatientsPerDay: 999 },
  growth: { name: 'Growth', price: 5999, maxDoctors: 999, maxPatientsPerDay: 999 },
} as const

export const ROLES = {
  SUPERADMIN:     'superadmin',
  HOSPITAL_ADMIN: 'hospital_admin',
  DOCTOR:         'doctor',
  STAFF:          'staff',
  PATIENT:        'patient',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

export const SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Orthopedic',
  'Pediatrics',
  'Dermatology',
  'Neurology',
  'Gynecology',
  'Ophthalmology',
  'ENT',
  'Psychiatry',
  'Oncology',
  'Urology',
  'Nephrology',
] as const
