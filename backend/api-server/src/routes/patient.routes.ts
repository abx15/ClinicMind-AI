import { Router } from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth'
import { requireRole } from '../middlewares/auth'
import { patientService } from '../services/patient.service'

const router = Router()

// POST /patients/register — public
router.post('/register', async (req: AuthRequest, res: any) => {
  try {
    const result = await patientService.registerPatient(req.body)
    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        user: result.user,
        patient: result.patient
      },
      token: result.token
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

// GET /patients/me — authenticated patient
router.get('/me',
  authenticate,
  requireRole('patient'),
  async (req: AuthRequest, res: any) => {
    try {
      const patient = await patientService.getPatientProfile(req.user!.userId)
      res.status(200).json({
        success: true,
        data: patient
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      })
    }
  }
)

// PUT /patients/me — authenticated patient
router.put('/me',
  authenticate,
  requireRole('patient'),
  async (req: AuthRequest, res: any) => {
    try {
      const patient = await patientService.updatePatientProfile(req.user!.userId, req.body)
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: patient
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
)

export default router
