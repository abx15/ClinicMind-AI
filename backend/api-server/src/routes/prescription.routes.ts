import { Router } from 'express'
import { authenticate, AuthRequest, requireRole } from '../middlewares/auth'
import { prescriptionService } from '../services/prescription.service'

const router = Router()

router.post('/', authenticate, requireRole('doctor'), async (req: AuthRequest, res, next) => {
  try {
    const { patientId, appointmentId, diagnosis, medications, notes, voiceTranscript, aiGenerated } = req.body
    const doctorId = req.user!.userId

    const prescription = await prescriptionService.createPrescription({
      patientId,
      appointmentId,
      diagnosis,
      medications,
      notes,
      voiceTranscript,
      aiGenerated
    }, doctorId)

    res.status(201).json({
      message: 'Prescription created successfully',
      data: prescription
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/patient/:patientId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { patientId } = req.params
    const requestingUserId = req.user!.userId
    const role = req.user!.role

    if (role === 'patient' && patientId !== requestingUserId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const prescriptions = await prescriptionService.getPrescriptionsByPatient(
      patientId,
      requestingUserId,
      role
    )

    res.json({
      message: 'Prescriptions retrieved successfully',
      data: prescriptions
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/my-prescriptions', authenticate, requireRole('doctor'), async (req: AuthRequest, res, next) => {
  try {
    const doctorId = req.user!.userId
    const { patientId, startDate, endDate } = req.query

    const prescriptions = await prescriptionService.getDoctorPrescriptions(doctorId, {
      patientId: patientId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined
    })

    res.json({
      message: 'Doctor prescriptions retrieved successfully',
      data: prescriptions
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params

    const prescription = await prescriptionService.getPrescriptionById(
      id,
      req.user!.userId,
      req.user!.role
    )

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' })
    }

    res.json({
      message: 'Prescription retrieved successfully',
      data: prescription
    })
  } catch (error: any) {
    next(error)
  }
})

router.patch('/:id', authenticate, requireRole('doctor'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const { diagnosis, medications, notes, voiceTranscript } = req.body
    const doctorId = req.user!.userId

    const prescription = await prescriptionService.updatePrescription(
      id,
      {
        diagnosis,
        medications,
        notes,
        voiceTranscript
      },
      doctorId
    )

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' })
    }

    res.json({
      message: 'Prescription updated successfully',
      data: prescription
    })
  } catch (error: any) {
    next(error)
  }
})

export default router
