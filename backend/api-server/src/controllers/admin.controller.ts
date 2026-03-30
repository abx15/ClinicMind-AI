import { Request, Response } from 'express';
import { HospitalService } from '../services/hospital.service';
import { Hospital } from '../models/Hospital.model';
import { Doctor } from '../models/Doctor.model';
import { Patient } from '../models/Patient.model';
import { User } from '../models/User.model';
import { AuthRequest } from '../middlewares/auth';
import mongoose from 'mongoose';

// Plan pricing (monthly)
const PLAN_PRICES: Record<string, number> = {
  free:   0,
  pro:    2499,
  growth: 5999,
};

export class AdminController {
  /**
   * GET /admin/stats — Platform overview numbers
   */
  static async getPlatformStats(req: Request, res: Response) {
    try {
      const [
        totalHospitals,
        verifiedHospitals,
        pendingHospitals,
        rejectedHospitals,
        suspendedHospitals,
        totalDoctors,
        totalPatients,
        planCounts,
      ] = await Promise.all([
        Hospital.countDocuments({}),
        Hospital.countDocuments({ status: 'verified' }),
        Hospital.countDocuments({ status: 'pending' }),
        Hospital.countDocuments({ status: 'rejected' }),
        Hospital.countDocuments({ status: 'suspended' }),
        Doctor.countDocuments({}),
        Patient.countDocuments({}),
        Hospital.aggregate([
          { $match: { status: 'verified' } },
          { $group: { _id: '$plan', count: { $sum: 1 } } },
        ]),
      ]);

      // Compute MRR from plan counts
      let mrr = 0;
      const planBreakdown: Record<string, { count: number; revenue: number }> = {
        free:   { count: 0, revenue: 0 },
        pro:    { count: 0, revenue: 0 },
        growth: { count: 0, revenue: 0 },
      };

      for (const pc of planCounts) {
        const plan = pc._id || 'free';
        const price = PLAN_PRICES[plan] || 0;
        planBreakdown[plan] = { count: pc.count, revenue: pc.count * price };
        mrr += pc.count * price;
      }

      res.json({
        success: true,
        data: {
          totalHospitals,
          verifiedHospitals,
          pendingHospitals,
          rejectedHospitals,
          suspendedHospitals,
          totalDoctors,
          totalPatients,
          mrr,
          planBreakdown,
        },
      });
    } catch (error: any) {
      console.error('getPlatformStats error:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch stats' });
    }
  }

  /**
   * GET /admin/hospitals — All hospitals with optional status filter
   */
  static async getAllHospitals(req: Request, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const page   = parseInt(req.query.page as string)  || 1;
      const limit  = parseInt(req.query.limit as string) || 20;

      const query: any = {};
      if (status && status !== 'all') query.status = status;
      if (search) {
        query.$or = [
          { name:  new RegExp(search, 'i') },
          { city:  new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { licenseNumber: new RegExp(search, 'i') },
        ];
      }

      const skip = (page - 1) * limit;
      const [hospitals, total] = await Promise.all([
        Hospital.find(query)
          .populate('adminUserId', 'name email phone isVerified')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Hospital.countDocuments(query),
      ]);

      // Flatten adminUserId fields for easy frontend access
      const hospitalsFlat = hospitals.map((h: any) => {
        const obj = h.toObject();
        const admin = obj.adminUserId || {};
        return {
          ...obj,
          adminName:  admin.name  || null,
          adminEmail: admin.email || null,
          adminPhone: admin.phone || null,
        };
      });

      res.json({
        success: true,
        data: {
          hospitals: hospitalsFlat,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error('getAllHospitals error:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch hospitals' });
    }
  }

  /**
   * GET /admin/hospitals/:id — Single hospital with doctors
   */
  static async getHospitalById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [hospital, doctors] = await Promise.all([
        Hospital.findById(id).populate('adminUserId', 'name email phone isVerified role'),
        Doctor.find({ hospitalId: id })
          .populate('userId', 'name email phone')
          .sort({ createdAt: -1 }),
      ]);

      if (!hospital) {
        return res.status(404).json({ success: false, error: 'Hospital not found' });
      }

      res.json({
        success: true,
        data: {
          hospital: hospital.toObject(),
          doctors:  doctors.map((d: any) => d.toObject()),
        },
      });
    } catch (error: any) {
      console.error('getHospitalById error:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch hospital' });
    }
  }

  /**
   * PATCH /admin/hospitals/:id/approve
   */
  static async approveHospital(req: AuthRequest, res: Response) {
    try {
      const hospital = await HospitalService.approveHospital(req.params.id, req.user!.userId);
      res.json({ success: true, data: hospital, message: 'Hospital approved successfully' });
    } catch (error: any) {
      const status = error.message === 'Hospital not found' ? 404
        : error.message === 'Hospital is not in pending status' ? 400
        : 500;
      res.status(status).json({ success: false, error: error.message || 'Failed to approve hospital' });
    }
  }

  /**
   * PATCH /admin/hospitals/:id/reject
   */
  static async rejectHospital(req: AuthRequest, res: Response) {
    try {
      const { reason } = req.body;
      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Rejection reason is required' });
      }
      const hospital = await HospitalService.rejectHospital(req.params.id, req.user!.userId, reason);
      res.json({ success: true, data: hospital, message: 'Hospital rejected successfully' });
    } catch (error: any) {
      const status = error.message === 'Hospital not found' ? 404 : 500;
      res.status(status).json({ success: false, error: error.message || 'Failed to reject hospital' });
    }
  }

  /**
   * PATCH /admin/hospitals/:id/suspend
   */
  static async suspendHospital(req: AuthRequest, res: Response) {
    try {
      const hospital = await HospitalService.suspendHospital(req.params.id, req.user!.userId);
      res.json({ success: true, data: hospital, message: 'Hospital suspended successfully' });
    } catch (error: any) {
      const status = error.message === 'Hospital not found' ? 404 : 500;
      res.status(status).json({ success: false, error: error.message || 'Failed to suspend hospital' });
    }
  }

  /**
   * PATCH /admin/hospitals/:id/reactivate — Reactivate a suspended hospital
   */
  static async reactivateHospital(req: AuthRequest, res: Response) {
    try {
      const hospital = await Hospital.findById(req.params.id);
      if (!hospital) {
        return res.status(404).json({ success: false, error: 'Hospital not found' });
      }
      hospital.status = 'verified';
      await hospital.save();
      res.json({ success: true, data: hospital, message: 'Hospital reactivated successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to reactivate hospital' });
    }
  }

  /**
   * PATCH /admin/hospitals/:id — Update hospital (plan, etc.)
   */
  static async updateHospital(req: AuthRequest, res: Response) {
    try {
      const hospital = await Hospital.findById(req.params.id);
      if (!hospital) {
        return res.status(404).json({ success: false, error: 'Hospital not found' });
      }

      const allowedFields = ['plan', 'description', 'specializations'];
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          (hospital as any)[field] = req.body[field];
        }
      }

      await hospital.save();
      res.json({ success: true, data: hospital, message: 'Hospital updated successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to update hospital' });
    }
  }

  /**
   * GET /admin/doctors — All doctors across all hospitals
   */
  static async getAllDoctors(req: Request, res: Response) {
    try {
      const hospitalId = req.query.hospitalId as string | undefined;
      const isVerified = req.query.isVerified !== undefined
        ? req.query.isVerified === 'true'
        : undefined;
      const search = req.query.search as string | undefined;
      const page   = parseInt(req.query.page as string)  || 1;
      const limit  = parseInt(req.query.limit as string) || 20;

      const query: any = {};
      if (hospitalId) query.hospitalId = new mongoose.Types.ObjectId(hospitalId);
      if (isVerified !== undefined) query.isVerified = isVerified;
      if (search) {
        query.$or = [
          { name:           new RegExp(search, 'i') },
          { specialization: new RegExp(search, 'i') },
        ];
      }

      const skip = (page - 1) * limit;
      const [doctors, total] = await Promise.all([
        Doctor.find(query)
          .populate('hospitalId', 'name city')
          .populate('userId', 'name email phone')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Doctor.countDocuments(query),
      ]);

      const doctorsFlat = doctors.map((d: any) => {
        const obj = d.toObject();
        const hospital = obj.hospitalId || {};
        const user     = obj.userId     || {};
        return {
          ...obj,
          hospitalName: hospital.name || null,
          hospitalCity: hospital.city || null,
          email:        user.email    || null,
          phone:        user.phone    || null,
        };
      });

      res.json({
        success: true,
        data: {
          doctors: doctorsFlat,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error('getAllDoctors error:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch doctors' });
    }
  }

  /**
   * GET /admin/patients — All patients on the platform
   */
  static async getAllPatients(req: Request, res: Response) {
    try {
      const search = req.query.search as string | undefined;
      const page   = parseInt(req.query.page as string)  || 1;
      const limit  = parseInt(req.query.limit as string) || 20;

      const userQuery: any = { role: 'patient' };
      if (search) {
        userQuery.$or = [
          { name:  new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') },
        ];
      }

      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find(userQuery)
          .select('name email phone isActive isVerified createdAt')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        User.countDocuments(userQuery),
      ]);

      res.json({
        success: true,
        data: {
          patients: users.map((u: any) => u.toObject()),
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error('getAllPatients error:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch patients' });
    }
  }
}
