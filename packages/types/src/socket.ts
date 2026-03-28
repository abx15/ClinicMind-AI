export type QueueStatus = 'waiting' | 'called' | 'in-progress' | 'done' | 'skipped'

export interface QueueToken {
  _id: string
  tokenNumber: number
  patientId: string
  doctorId: string
  hospitalId: string
  status: QueueStatus
  estimatedWaitMinutes: number
  date: string
  calledAt?: string
  completedAt?: string
  patient?: { name: string; phone: string }
}

export type QueueEventType =
  | 'queue:new-token'
  | 'queue:token-called'
  | 'queue:token-done'
  | 'queue:token-skipped'
  | 'queue:eta-updated'

export interface QueueUpdatePayload {
  type: QueueEventType
  token: QueueToken
  remainingCount: number
  hospitalId: string
}
