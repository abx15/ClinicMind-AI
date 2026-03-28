import { Router, Request, Response } from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth'
import { requireRole } from '../middlewares/auth'
import { doctorService } from '../services/doctor.service'

const router = Router()

// POST /doctors/invite — hospital_admin only
router.post('/invite',
  authenticate,
  requireRole('hospital_admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const doctor = await doctorService.inviteDoctor(req.body, req.user!.userId)
      res.status(201).json({
        success: true,
        message: 'Doctor invited successfully',
        data: doctor
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
)

// POST /doctors/setup — public (token-based, no auth needed)
router.post('/setup',
  async (req: AuthRequest, res: Response) => {
    try {
      const { token } = req.query
      if (!token || typeof token !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invite token is required'
        })
      }

      const result = await doctorService.setupDoctorProfile(token, req.body)
      res.status(200).json({
        success: true,
        message: 'Doctor profile setup completed',
        data: result.doctor,
        token: result.token
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
)

// GET /doctors — public, only verified+public, filter by hospitalId/specialization
router.get('/',
  async (req: AuthRequest, res: Response) => {
    try {
      const { hospitalId, specialization } = req.query
      const filters: any = {}
      if (specialization) filters.specialization = specialization

      let doctors: any[]
      if (hospitalId) {
        doctors = await doctorService.getDoctorsByHospital(hospitalId as string, filters, false)
      } else {
        // For public endpoint without hospitalId, get all verified+public doctors
        doctors = await doctorService.getPublicDoctors(filters)
      }

      res.status(200).json({
        success: true,
        data: doctors
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
)

// GET /hospitals/:hospitalId/doctors — public, verified doctors of hospital
router.get('/hospitals/:hospitalId/doctors',
  async (req: AuthRequest, res: Response) => {
    try {
      const doctors = await doctorService.getDoctorsByHospital(req.params.hospitalId, {}, false)
      res.status(200).json({
        success: true,
        data: doctors
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
)

// GET /doctors/me — authenticated doctor only (own profile) - must come before /:id
router.get('/me',
  authenticate,
  requireRole('doctor'),
  async (req: AuthRequest, res: Response) => {
    try {
      const doctor = await doctorService.getMyDoctorProfile(req.user!.userId)
      res.status(200).json({
        success: true,
        data: doctor
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      })
    }
  }
)

// PUT /doctors/me — authenticated doctor only (update own profile) - must come before /:id
router.put('/me',
  authenticate,
  requireRole('doctor'),
  async (req: AuthRequest, res: Response) => {
    try {
      const doctor = await doctorService.updateMyDoctorProfile(req.user!.userId, req.body)
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: doctor
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
)

// GET /doctors/:id — public, single doctor profile
router.get('/:id',
  async (req: AuthRequest, res: Response) => {
    try {
      const doctor = await doctorService.getDoctorProfile(req.params.id)
      res.status(200).json({
        success: true,
        data: doctor
      })
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      })
    }
  }
)

// PATCH /doctors/:id/verify — hospital_admin only
router.patch('/:id/verify',
  authenticate,
  requireRole('hospital_admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const doctor = await doctorService.verifyDoctor(req.params.id, req.user!.userId)
      res.status(200).json({
        success: true,
        message: 'Doctor verified successfully',
        data: doctor
      })
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message
      })
    }
  }
)

// PATCH /doctors/:id/unverify — hospital_admin only
router.patch('/:id/unverify',
  authenticate,
  requireRole('hospital_admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const doctor = await doctorService.unverifyDoctor(req.params.id, req.user!.userId)
      res.status(200).json({
        success: true,
        message: 'Doctor unverified successfully',
        data: doctor
      })
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message
      })
    }
  }
)

// DELETE /doctors/:id — hospital_admin only
router.delete('/:id',
  authenticate,
  requireRole('hospital_admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await doctorService.removeDoctor(req.params.id, req.user!.userId)
      res.status(200).json({
        success: true,
        message: 'Doctor removed successfully',
        data: result
      })
    } catch (error: any) {
      res.status(403).json({
        success: false,
        error: error.message
      })
    }
  }
)

export default router
