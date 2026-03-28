export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
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
  createdAt: Date
}
