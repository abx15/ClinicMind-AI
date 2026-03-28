export type UserRole = 
  | 'superadmin' 
  | 'hospital_admin' 
  | 'doctor' 
  | 'staff' 
  | 'patient'

export const ROLES = {
  SUPERADMIN: 'superadmin' as const,
  HOSPITAL_ADMIN: 'hospital_admin' as const,
  DOCTOR: 'doctor' as const,
  STAFF: 'staff' as const,
  PATIENT: 'patient' as const,
}
