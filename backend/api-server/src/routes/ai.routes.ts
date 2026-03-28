import { Router, Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

const router = Router();

// POST /ai/triage - Symptom triage (doctor or staff only)
router.post('/triage', authenticate, requireRole('doctor', 'staff'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symptoms, age, gender } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array is required' });
    }

    if (!age || !gender) {
      return res.status(400).json({ error: 'Age and gender are required' });
    }

    const result = await aiService.callTriage(symptoms, age, gender);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

// POST /ai/prescription/voice - Voice prescription (doctor only)
router.post('/prescription/voice', authenticate, requireRole('doctor'), upload.single('audio'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const result = await aiService.callVoicePrescription(req.file.buffer);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

// POST /ai/drug-check - Drug interaction check (doctor only)
router.post('/drug-check', authenticate, requireRole('doctor'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { medications } = req.body;

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ error: 'Medications array is required' });
    }

    const result = await aiService.callDrugCheck(medications);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

// GET /ai/analytics/demand - Demand analytics (hospital_admin only)
router.get('/analytics/demand', authenticate, requireRole('hospital_admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hospitalId } = req.query;
    const { days = 30 } = req.query;

    // Use hospitalId from user if not provided
    const targetHospitalId = hospitalId || req.user.hospitalId;

    const result = await aiService.getDemandAnalytics(targetHospitalId as string, parseInt(days as string));
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

// GET /ai/analytics/platform - Platform analytics (superadmin only)
router.get('/analytics/platform', authenticate, requireRole('superadmin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await aiService.getPlatformAnalytics(req.user.role);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

export default router;
