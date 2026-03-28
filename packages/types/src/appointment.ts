export type AppointmentStatus = 
  | 'booked' 
  | 'confirmed' 
  | 'ongoing' 
  | 'completed' 
  | 'cancelled'

export interface Appointment {
  _id: string
  patientId: string
  doctorId: string
  hospitalId: string
  date: Date
  timeSlot: string
  status: AppointmentStatus
  notes?: string
  createdAt: Date
}
