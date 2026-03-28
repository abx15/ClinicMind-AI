export type QueueStatus = 
  | 'waiting' 
  | 'called' 
  | 'in-progress' 
  | 'done' 
  | 'skipped'

export interface QueueToken {
  _id: string
  tokenNumber: number
  patientId: string
  doctorId: string
  hospitalId: string
  status: QueueStatus
  estimatedWaitMinutes: number
  calledAt?: Date
  completedAt?: Date
  createdAt: Date
}

export interface QueueUpdateEvent {
  type: 'token-called' | 'token-done' | 'eta-updated' | 'new-token'
  token: QueueToken
  remainingCount: number
  hospitalId: string
}
