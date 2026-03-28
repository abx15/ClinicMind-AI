import { QueueStatus, QueueToken } from './socket'

export interface QueueStats {
  totalTokens: number
  waitingTokens: number
  averageWaitTime: number
  tokensPerHour: number
}
