import { Router } from 'express';
import { HospitalController } from '../controllers/hospital.controller';
import { authenticate } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roleGuard';
import { tenantGuard } from '../middlewares/tenantGuard';
import { UserRole } from '../models/User.model';

const router = Router();

// Public routes (no auth required)
router.get('/', HospitalController.getPublicHospitals);
router.get('/:slug', HospitalController.getHospitalBySlug);

// Hospital Admin routes (auth + hospital_admin role required)
router.post('/register', 
  authenticate, 
  roleGuard(UserRole.HOSPITAL_ADMIN), 
  HospitalController.registerHospital
);

router.put('/:id', 
  authenticate, 
  roleGuard(UserRole.HOSPITAL_ADMIN), 
  tenantGuard('hospital', 'id'), 
  HospitalController.updateHospital
);

router.get('/:id/dashboard', 
  authenticate, 
  roleGuard(UserRole.HOSPITAL_ADMIN), 
  tenantGuard('hospital', 'id'), 
  HospitalController.getHospitalDashboard
);

// Superadmin routes (auth + superadmin role required)
router.get('/admin/hospitals', 
  authenticate, 
  roleGuard(UserRole.SUPERADMIN), 
  HospitalController.getAllHospitalsAdmin
);

router.get('/admin/hospitals/:id', 
  authenticate, 
  roleGuard(UserRole.SUPERADMIN), 
  HospitalController.getHospitalById
);

router.patch('/admin/hospitals/:id/approve', 
  authenticate, 
  roleGuard(UserRole.SUPERADMIN), 
  HospitalController.approveHospital
);

router.patch('/admin/hospitals/:id/reject', 
  authenticate, 
  roleGuard(UserRole.SUPERADMIN), 
  HospitalController.rejectHospital
);

router.patch('/admin/hospitals/:id/suspend', 
  authenticate, 
  roleGuard(UserRole.SUPERADMIN), 
  HospitalController.suspendHospital
);

export default router;
