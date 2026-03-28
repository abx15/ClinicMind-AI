import { Request, Response } from 'express';
import { HospitalService, RegisterHospitalData, HospitalFilters } from '../services/hospital.service';
import { UserRole } from '../models/User.model';
import { AuthRequest } from '../middlewares/auth';

export class HospitalController {
  /**
   * Register a new hospital (hospital_admin only)
   */
  static async registerHospital(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      const hospitalData: RegisterHospitalData = req.body;

      // Validate required fields
      const requiredFields = ['name', 'address', 'city', 'pincode', 'licenseNumber', 'phone', 'email'];
      for (const field of requiredFields) {
        if (!hospitalData[field as keyof RegisterHospitalData]) {
          return res.status(400).json({
            success: false,
            error: `${field} is required`,
          });
        }
      }

      // Validate pincode (6 digits)
      if (!/^\d{6}$/.test(hospitalData.pincode)) {
        return res.status(400).json({
          success: false,
          error: 'Pincode must be exactly 6 digits',
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(hospitalData.email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
        });
      }

      const hospital = await HospitalService.registerHospital(hospitalData, user.userId);

      res.status(201).json({
        success: true,
        data: hospital,
        message: 'Hospital registered successfully. Pending approval.',
      });
    } catch (error: any) {
      console.error('Register hospital error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to register hospital',
      });
    }
  }

  /**
   * Get public hospitals (no auth required)
   */
  static async getPublicHospitals(req: Request, res: Response) {
    try {
      const filters: HospitalFilters = {
        city: req.query.city as string,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      // Handle specializations array
      if (req.query.specializations) {
        filters.specializations = (req.query.specializations as string).split(',');
      }

      const result = await HospitalService.getPublicHospitals(filters);

      res.json({
        success: true,
        data: result.hospitals,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Get public hospitals error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch hospitals',
      });
    }
  }

  /**
   * Get hospital by slug (public view)
   */
  static async getHospitalBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const hospital = await HospitalService.getHospitalBySlug(slug);

      res.json({
        success: true,
        data: hospital,
      });
    } catch (error: any) {
      console.error('Get hospital by slug error:', error);
      if (error.message === 'Hospital not found') {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found',
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch hospital',
      });
    }
  }

  /**
   * Update hospital (hospital_admin or superadmin)
   */
  static async updateHospital(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      const { id } = req.params;
      const updateData: Partial<RegisterHospitalData> = req.body;

      // Validate pincode if provided
      if (updateData.pincode && !/^\d{6}$/.test(updateData.pincode)) {
        return res.status(400).json({
          success: false,
          error: 'Pincode must be exactly 6 digits',
        });
      }

      // Validate email if provided
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid email format',
          });
        }
      }

      const hospital = await HospitalService.updateHospital(id, updateData, user);

      res.json({
        success: true,
        data: hospital,
        message: 'Hospital updated successfully',
      });
    } catch (error: any) {
      console.error('Update hospital error:', error);
      if (error.message === 'Hospital not found') {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found',
        });
      }
      if (error.message === 'Access denied') {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update hospital',
      });
    }
  }

  /**
   * Get hospital dashboard (hospital_admin only)
   */
  static async getHospitalDashboard(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      const { id } = req.params;

      const result = await HospitalService.getHospitalDashboard(id, user.userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Get hospital dashboard error:', error);
      if (error.message === 'Hospital not found or access denied') {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found or access denied',
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch dashboard data',
      });
    }
  }

  /**
   * Get all hospitals (superadmin only)
   */
  static async getAllHospitalsAdmin(req: Request, res: Response) {
    try {
      const filters: HospitalFilters = {
        status: req.query.status as string,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const result = await HospitalService.getAllHospitalsAdmin(filters);

      res.json({
        success: true,
        data: result.hospitals,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Get all hospitals admin error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch hospitals',
      });
    }
  }

  /**
   * Get hospital by ID (superadmin only)
   */
  static async getHospitalById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const hospital = await HospitalService.getHospitalById(id);

      res.json({
        success: true,
        data: hospital,
      });
    } catch (error: any) {
      console.error('Get hospital by ID error:', error);
      if (error.message === 'Hospital not found') {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found',
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch hospital',
      });
    }
  }

  /**
   * Approve hospital (superadmin only)
   */
  static async approveHospital(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      const { id } = req.params;

      const hospital = await HospitalService.approveHospital(id, user.userId);

      res.json({
        success: true,
        data: hospital,
        message: 'Hospital approved successfully',
      });
    } catch (error: any) {
      console.error('Approve hospital error:', error);
      if (error.message === 'Hospital not found') {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found',
        });
      }
      if (error.message === 'Hospital is not in pending status') {
        return res.status(400).json({
          success: false,
          error: 'Hospital is not in pending status',
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to approve hospital',
      });
    }
  }

  /**
   * Reject hospital (superadmin only)
   */
  static async rejectHospital(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Rejection reason is required',
        });
      }

      const hospital = await HospitalService.rejectHospital(id, user.userId, reason);

      res.json({
        success: true,
        data: hospital,
        message: 'Hospital rejected successfully',
      });
    } catch (error: any) {
      console.error('Reject hospital error:', error);
      if (error.message === 'Hospital not found') {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found',
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to reject hospital',
      });
    }
  }

  /**
   * Suspend hospital (superadmin only)
   */
  static async suspendHospital(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      const { id } = req.params;

      const hospital = await HospitalService.suspendHospital(id, user.userId);

      res.json({
        success: true,
        data: hospital,
        message: 'Hospital suspended successfully',
      });
    } catch (error: any) {
      console.error('Suspend hospital error:', error);
      if (error.message === 'Hospital not found') {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found',
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to suspend hospital',
      });
    }
  }
}
