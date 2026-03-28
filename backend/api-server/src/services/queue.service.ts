import { QueueToken, IQueueToken, QueueStatus } from '../models/QueueToken.model'
import { Doctor } from '../models/Doctor.model'
import { startOfDay, endOfDay } from 'date-fns'
import { emitQueueUpdate } from '../socket/queue.socket'

export interface GenerateTokenData {
  patientId: string
  doctorId: string
  hospitalId: string
  appointmentId?: string
}

export interface QueueTokenResponse {
  _id: string
  tokenNumber: number
  patientId: any
  doctorId: string
  hospitalId: string
  appointmentId?: string
  status: QueueStatus
  estimatedWaitMinutes: number
  date: Date
  calledAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  __v: number
  position?: number
}

export const queueService = {
  async generateToken(data: GenerateTokenData): Promise<QueueTokenResponse> {
    const today = startOfDay(new Date())
    const tomorrow = endOfDay(new Date())

    const lastToken = await QueueToken
      .findOne({
        doctorId: data.doctorId,
        hospitalId: data.hospitalId,
        date: { $gte: today, $lte: tomorrow }
      })
      .sort({ tokenNumber: -1 })

    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1

    const waitingTokensCount = await QueueToken.countDocuments({
      doctorId: data.doctorId,
      hospitalId: data.hospitalId,
      date: { $gte: today, $lte: tomorrow },
      status: 'waiting'
    })

    const estimatedWaitMinutes = waitingTokensCount * 10

    const token = new QueueToken({
      tokenNumber,
      patientId: data.patientId,
      doctorId: data.doctorId,
      hospitalId: data.hospitalId,
      appointmentId: data.appointmentId,
      estimatedWaitMinutes,
      date: today
    })

    await token.save()
    await token.populate('patientId', 'name phone')

    emitQueueUpdate(data.hospitalId, data.doctorId, 'new-token', token)

    return token.toObject() as unknown as QueueTokenResponse
  },

  async callNextToken(doctorId: string, hospitalId: string): Promise<IQueueToken | null> {
    const today = startOfDay(new Date())
    const tomorrow = endOfDay(new Date())

    const currentInProgress = await QueueToken.findOne({
      doctorId,
      hospitalId,
      date: { $gte: today, $lte: tomorrow },
      status: 'in-progress'
    })

    if (currentInProgress) {
      currentInProgress.status = 'done'
      currentInProgress.completedAt = new Date()
      await currentInProgress.save()
    }

    const nextToken = await QueueToken.findOne({
      doctorId,
      hospitalId,
      date: { $gte: today, $lte: tomorrow },
      status: 'waiting'
    }).sort({ tokenNumber: 1 })

    if (!nextToken) return null

    nextToken.status = 'called'
    nextToken.calledAt = new Date()
    await nextToken.save()
    await nextToken.populate('patientId', 'name phone')

    await this.recalculateETAs(doctorId, hospitalId)

    emitQueueUpdate(hospitalId, doctorId, 'token-called', nextToken)

    return nextToken
  },

  async markTokenDone(tokenId: string, doctorId: string): Promise<IQueueToken | null> {
    const token = await QueueToken.findOne({ _id: tokenId, doctorId })
    if (!token) return null

    token.status = 'done'
    token.completedAt = new Date()
    await token.save()

    await this.recalculateETAs(doctorId, token.hospitalId.toString())

    emitQueueUpdate(token.hospitalId.toString(), doctorId, 'token-done', token)

    return token
  },

  async skipToken(tokenId: string, doctorId: string): Promise<IQueueToken | null> {
    const token = await QueueToken.findOne({ _id: tokenId, doctorId })
    if (!token) return null

    token.status = 'skipped'
    await token.save()

    await this.recalculateETAs(doctorId, token.hospitalId.toString())

    emitQueueUpdate(token.hospitalId.toString(), doctorId, 'token-skipped', token)

    return token
  },

  async getTodayQueue(doctorId: string, hospitalId: string): Promise<IQueueToken[]> {
    const today = startOfDay(new Date())
    const tomorrow = endOfDay(new Date())

    const tokens = await QueueToken.find({
      doctorId,
      hospitalId,
      date: { $gte: today, $lte: tomorrow }
    })
    .sort({ tokenNumber: 1 })
    .populate('patientId', 'name phone')

    return tokens
  },

  async getPatientQueueStatus(patientId: string): Promise<QueueTokenResponse | null> {
    const today = startOfDay(new Date())
    const tomorrow = endOfDay(new Date())

    const token = await QueueToken.findOne({
      patientId,
      date: { $gte: today, $lte: tomorrow },
      status: { $nin: ['done', 'skipped'] }
    })
    .populate('patientId', 'name phone')

    if (!token) return null

    const position = await QueueToken.countDocuments({
      doctorId: token.doctorId,
      hospitalId: token.hospitalId,
      date: { $gte: today, $lte: tomorrow },
      status: 'waiting',
      tokenNumber: { $lt: token.tokenNumber }
    })

    return {
      ...token.toObject(),
      position: position + 1
    } as unknown as QueueTokenResponse
  },

  async recalculateETAs(doctorId: string, hospitalId: string): Promise<void> {
    const today = startOfDay(new Date())
    const tomorrow = endOfDay(new Date())

    const waitingTokens = await QueueToken.find({
      doctorId,
      hospitalId,
      date: { $gte: today, $lte: tomorrow },
      status: 'waiting'
    }).sort({ tokenNumber: 1 })

    for (let i = 0; i < waitingTokens.length; i++) {
      waitingTokens[i].estimatedWaitMinutes = i * 10
      await waitingTokens[i].save()
    }
  }
}
