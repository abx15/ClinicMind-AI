'use client'

import { useUser } from '@/stores/authStore'
import { UserRole } from '@clinicmind/types'

export function useRole() {
  const user = useUser()
  const role = user?.role as UserRole | undefined

  return {
    role,
    isHospitalAdmin: role === 'hospital_admin',
    isDoctor:        role === 'doctor',
    isStaff:         role === 'staff',
    isSuperAdmin:    role === 'superadmin',
    isVerified:      user?.isVerified ?? false,
    hospitalId:      user?.hospitalId ?? null,
    userId:          user?._id ?? null,
    // Helper: can this role do X?
    can: {
      manageDoctors:  role === 'hospital_admin',
      manageStaff:    role === 'hospital_admin',
      viewQueue:      role === 'doctor' || role === 'staff',
      writePrescription: role === 'doctor',
      viewAnalytics:  role === 'hospital_admin' || role === 'doctor',
    },
  }
}
