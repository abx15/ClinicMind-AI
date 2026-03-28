import { Router, Request, Response, NextFunction } from 'express';
import { billingService } from '../services/billing.service';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';

const router = Router();

// POST /billing/subscribe - Create subscription (hospital_admin only)
router.post('/subscribe', authenticate, requireRole('hospital_admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plan } = req.body;
    const hospitalId = req.user.hospitalId;

    if (!plan || !['pro', 'growth'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan. Must be pro or growth' });
    }

    const result = await billingService.createSubscription(hospitalId, plan);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

// GET /billing/subscription - Get current subscription (hospital_admin only)
router.get('/subscription', authenticate, requireRole('hospital_admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hospitalId = req.user.hospitalId;
    const subscription = await billingService.getSubscription(hospitalId);
    res.json(subscription);
  } catch (error: any) {
    next(error);
  }
});

// POST /billing/webhook - Handle Razorpay webhooks (public)
router.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const payload = req.body;

    await billingService.handleWebhook(payload, signature);
    res.status(200).send('OK');
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// POST /billing/cancel - Cancel subscription (hospital_admin only)
router.post('/cancel', authenticate, requireRole('hospital_admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hospitalId = req.user.hospitalId;
    const result = await billingService.cancelSubscription(hospitalId);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
});

export default router;
