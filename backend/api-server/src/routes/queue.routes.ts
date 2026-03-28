import { Router } from 'express'
import { authenticate, AuthRequest, requireRole } from '../middlewares/auth'
import { queueService } from '../services/queue.service'

const router = Router()

router.post('/token', authenticate, requireRole('patient', 'staff'), async (req: AuthRequest, res, next) => {
  try {
    const { doctorId, hospitalId, appointmentId } = req.body
    const user = req.user!

    if (user.role === 'patient') {
      req.body.patientId = user.userId
    } else if (user.role === 'staff') {
      if (!req.body.patientId) {
        return res.status(400).json({ message: 'Patient ID required for staff' })
      }
    }

    const token = await queueService.generateToken({
      patientId: req.body.patientId,
      doctorId,
      hospitalId,
      appointmentId
    })

    res.status(201).json({
      message: 'Token generated successfully',
      data: token
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/:doctorId/today', authenticate, requireRole('doctor', 'staff'), async (req: AuthRequest, res, next) => {
  try {
    const { doctorId } = req.params
    const user = req.user!

    let hospitalId: string
    if (user.role === 'doctor') {
      if (user.userId !== doctorId) {
        return res.status(403).json({ message: 'Access denied' })
      }
      hospitalId = user.hospitalId!
    } else {
      hospitalId = user.hospitalId!
    }

    const queue = await queueService.getTodayQueue(doctorId, hospitalId)

    res.json({
      message: 'Today\'s queue retrieved successfully',
      data: queue
    })
  } catch (error: any) {
    next(error)
  }
})

router.patch('/:tokenId/call', authenticate, requireRole('doctor'), async (req: AuthRequest, res, next) => {
  try {
    const { tokenId } = req.params
    const doctorId = req.user!.userId

    const token = await queueService.callNextToken(doctorId, req.user!.hospitalId!)

    if (!token) {
      return res.status(404).json({ message: 'No tokens in queue' })
    }

    res.json({
      message: 'Next token called successfully',
      data: token
    })
  } catch (error: any) {
    next(error)
  }
})

router.patch('/:tokenId/done', authenticate, requireRole('doctor'), async (req: AuthRequest, res, next) => {
  try {
    const { tokenId } = req.params
    const doctorId = req.user!.userId

    const token = await queueService.markTokenDone(tokenId, doctorId)

    if (!token) {
      return res.status(404).json({ message: 'Token not found' })
    }

    res.json({
      message: 'Token marked as done',
      data: token
    })
  } catch (error: any) {
    next(error)
  }
})

router.patch('/:tokenId/skip', authenticate, requireRole('doctor'), async (req: AuthRequest, res, next) => {
  try {
    const { tokenId } = req.params
    const doctorId = req.user!.userId

    const token = await queueService.skipToken(tokenId, doctorId)

    if (!token) {
      return res.status(404).json({ message: 'Token not found' })
    }

    res.json({
      message: 'Token skipped',
      data: token
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/my-status', authenticate, requireRole('patient'), async (req: AuthRequest, res, next) => {
  try {
    const patientId = req.user!.userId

    const token = await queueService.getPatientQueueStatus(patientId)

    if (!token) {
      return res.status(404).json({ message: 'No active token found' })
    }

    res.json({
      message: 'Queue status retrieved',
      data: token
    })
  } catch (error: any) {
    next(error)
  }
})

export default router
