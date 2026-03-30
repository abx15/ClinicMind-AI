import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { authenticate, requireRole } from '../middlewares/auth'

const router = Router()

// All admin routes require superadmin authentication
const adminAuth = [authenticate, requireRole('superadmin')]

// Platform stats
router.get('/stats', ...adminAuth, AdminController.getPlatformStats)

// Hospital management
router.get('/hospitals',              ...adminAuth, AdminController.getAllHospitals)
router.get('/hospitals/:id',          ...adminAuth, AdminController.getHospitalById)
router.patch('/hospitals/:id/approve',    ...adminAuth, AdminController.approveHospital)
router.patch('/hospitals/:id/reject',     ...adminAuth, AdminController.rejectHospital)
router.patch('/hospitals/:id/suspend',    ...adminAuth, AdminController.suspendHospital)
router.patch('/hospitals/:id/reactivate', ...adminAuth, AdminController.reactivateHospital)
router.patch('/hospitals/:id',            ...adminAuth, AdminController.updateHospital)

// Doctors across all hospitals
router.get('/doctors',  ...adminAuth, AdminController.getAllDoctors)

// Patients across platform
router.get('/patients', ...adminAuth, AdminController.getAllPatients)

export default router
