export const PROTECTED_ROUTES = {
  patient: ['/dashboard'],
  hospital_admin: ['/dashboard/overview', '/dashboard/doctors', '/dashboard/staff'],
  doctor: ['/dashboard/doctor'],
  staff: ['/dashboard/staff'],
  superadmin: ['/dashboard'],
}

export const PUBLIC_ROUTES = [
  '/hospitals',
  '/search',
  '/login',
  '/register',
]
