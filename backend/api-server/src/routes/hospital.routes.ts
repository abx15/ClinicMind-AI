import { Router } from 'express';
import { HospitalController } from '../controllers/hospital.controller';
import { authenticate, requireRole } from '../middlewares/auth';
import { tenantGuard } from '../middlewares/tenantGuard';

const router = Router();

// Public routes (no auth required)
router.get('/', HospitalController.getPublicHospitals);
router.get('/:slug([a-zA-Z0-9-]+)', HospitalController.getHospitalBySlug);

// Hospital Admin routes (auth + hospital_admin role required)
router.post('/register', 
  authenticate, 
  requireRole('hospital_admin'), 
  HospitalController.registerHospital
);

router.put('/:id', 
  authenticate, 
  requireRole('hospital_admin'), 
  tenantGuard, 
  HospitalController.updateHospital
);

router.get('/:id/dashboard', 
  authenticate, 
  requireRole('hospital_admin'), 
  tenantGuard, 
  HospitalController.getHospitalDashboard
);

// Superadmin routes (auth + superadmin role required)
router.get('/admin/hospitals', 
  authenticate, 
  requireRole('superadmin'), 
  HospitalController.getAllHospitalsAdmin
);

router.get('/admin/hospitals/:id', 
  authenticate, 
  requireRole('superadmin'), 
  HospitalController.getHospitalById
);

router.patch('/admin/hospitals/:id/approve', 
  authenticate, 
  requireRole('superadmin'), 
  HospitalController.approveHospital
);

router.patch('/admin/hospitals/:id/reject', 
  authenticate, 
  requireRole('superadmin'), 
  HospitalController.rejectHospital
);

router.patch('/admin/hospitals/:id/suspend', 
  authenticate, 
  requireRole('superadmin'), 
  HospitalController.suspendHospital
);

export default router;
