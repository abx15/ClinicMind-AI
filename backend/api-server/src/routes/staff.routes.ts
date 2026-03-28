import { Router } from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth'
import { requireRole } from '../middlewares/auth'
import { staffService } from '../services/staff.service'

const router = Router()

// POST /:hospitalId/staff — hospital_admin only
router.post('/:hospitalId/staff',
  authenticate,
  requireRole('hospital_admin'),
  async (req: AuthRequest, res: any) => {
    try {
      const staff = await staffService.addStaff(req.body, req.user!.userId)
      res.status(201).json({
        success: true,
        message: 'Staff added successfully',
        data: staff
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
)

// DELETE /:hospitalId/staff/:staffId — hospital_admin only
router.delete('/:hospitalId/staff/:staffId',
  authenticate,
  requireRole('hospital_admin'),
  async (req: AuthRequest, res: any) => {
    try {
      const result = await staffService.removeStaff(req.params.staffId, req.user!.userId)
      res.status(200).json({
        success: true,
        message: 'Staff removed successfully',
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

// GET /:hospitalId/staff — hospital_admin only
router.get('/:hospitalId/staff',
  authenticate,
  requireRole('hospital_admin'),
  async (req: AuthRequest, res: any) => {
    try {
      const staff = await staffService.getStaffByHospital(req.params.hospitalId)
      res.status(200).json({
        success: true,
        data: staff
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
