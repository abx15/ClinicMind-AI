export const PATIENT_ROUTES = {
  home:           '/',
  hospitals:      '/hospitals',
  hospitalDetail: (slug: string) => `/hospitals/${slug}`,
  search:         '/search',
  login:          '/login',
  register:       '/register',
  dashboard:      '/dashboard/home',
  appointments:   '/dashboard/appointments',
  bookAppointment: '/dashboard/appointments/book',
  queue:          '/dashboard/queue',
  records:        '/dashboard/records',
  profile:        '/dashboard/profile',
  notifications:  '/dashboard/notifications',
} as const

export const HOSPITAL_ROUTES = {
  register:       '/register',
  pending:        '/pending',
  login:          '/login',
  overview:       '/dashboard/overview',
  doctors:        '/dashboard/doctors',
  addDoctor:      '/dashboard/doctors/add',
  doctorDetail:   (id: string) => `/dashboard/doctors/${id}`,
  staff:          '/dashboard/staff',
  appointments:   '/dashboard/appointments',
  analytics:      '/dashboard/analytics',
  settings:       '/dashboard/settings',
  // Doctor routes (same app, different role)
  doctorPending:  '/dashboard/doctor/pending',
  doctorQueue:    '/dashboard/doctor/queue',
  doctorPatients: '/dashboard/doctor/patients',
  doctorRx:       '/dashboard/doctor/prescriptions',
  doctorNewRx:    '/dashboard/doctor/prescriptions/new',
  doctorProfile:  '/dashboard/doctor/profile',
  // Staff routes
  staffQueue:     '/dashboard/staff/queue',
  staffPatients:  '/dashboard/staff/patients',
} as const

export const ADMIN_ROUTES = {
  login:     '/login',
  overview:  '/dashboard/overview',
  hospitals: '/dashboard/hospitals',
  hospitalDetail: (id: string) => `/dashboard/hospitals/${id}`,
  doctors:   '/dashboard/doctors',
  patients:  '/dashboard/patients',
  analytics: '/dashboard/analytics',
  settings:  '/dashboard/settings',
} as const
