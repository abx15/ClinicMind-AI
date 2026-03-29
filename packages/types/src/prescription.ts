export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  quantity?: string | number
  refills?: string | number
}

export interface Prescription {
  _id: string
  patientId: string
  doctorId: string
  hospitalId: string
  appointmentId?: string
  medications: Medication[]
  diagnosis: string
  notes?: string
  voiceTranscript?: string
  followUpDate?: Date
  createdAt: Date
}
