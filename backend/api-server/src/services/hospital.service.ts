import { Hospital } from '../models/Hospital.model';
import { User, UserRole } from '../models/User.model';
import { Doctor } from '../models/Doctor.model';
import { generateUniqueSlug } from '../utils/slug';
import mongoose from 'mongoose';

export interface RegisterHospitalData {
  name: string;
  address: string;
  city: string;
  pincode: string;
  licenseNumber: string;
  phone: string;
  email: string;
  description?: string;
  specializations?: string[];
}

export interface HospitalFilters {
  city?: string;
  specializations?: string[];
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class HospitalService {
  /**
   * Register a new hospital
   */
  static async registerHospital(data: RegisterHospitalData, adminUserId: string) {
    try {
      // Generate unique slug
      const slug = await generateUniqueSlug(data.name, data.city, Hospital);

      // Create hospital with pending status
      const hospital = new Hospital({
        ...data,
        slug,
        adminUserId,
        status: 'pending',
        plan: 'free',
      });

      await hospital.save();
      return hospital;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approve a hospital
   */
  static async approveHospital(hospitalId: string, superadminId: string) {
    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        throw new Error('Hospital not found');
      }

      if (hospital.status !== 'pending') {
        throw new Error('Hospital is not in pending status');
      }

      // Update hospital status
      hospital.status = 'verified';
      hospital.verifiedAt = new Date();
      hospital.verifiedBy = new mongoose.Types.ObjectId(superadminId);

      await hospital.save();

      // Also verify the admin user
      await User.findByIdAndUpdate(hospital.adminUserId, {
        isVerified: true,
      });

      return hospital;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reject a hospital
   */
  static async rejectHospital(hospitalId: string, superadminId: string, reason: string) {
    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        throw new Error('Hospital not found');
      }

      hospital.status = 'rejected';
      hospital.rejectedReason = reason;

      await hospital.save();
      return hospital;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Suspend a hospital
   */
  static async suspendHospital(hospitalId: string, superadminId: string) {
    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        throw new Error('Hospital not found');
      }

      hospital.status = 'suspended';
      await hospital.save();
      return hospital;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get public hospitals (verified only)
   */
  static async getPublicHospitals(filters: HospitalFilters) {
    try {
      const {
        city,
        specializations,
        search,
        page = 1,
        limit = 10,
      } = filters;

      // Build query
      const query: any = { status: 'verified' };

      if (city) {
        query.city = new RegExp(city, 'i');
      }

      if (specializations && specializations.length > 0) {
        query.specializations = { $in: specializations };
      }

      if (search) {
        query.name = new RegExp(search, 'i');
      }

      // Pagination
      const skip = (page - 1) * limit;

      const hospitals = await Hospital.find(query)
        .populate('adminUserId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Hospital.countDocuments(query);

      return {
        hospitals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get hospital by slug (public view)
   */
  static async getHospitalBySlug(slug: string) {
    try {
      const hospital = await Hospital.findOne({ 
        slug, 
        status: 'verified' 
      })
        .populate('adminUserId', 'name email phone')
        .populate({
          path: 'doctors',
          match: { isVerified: true, isPublic: true },
          select: 'name specialization qualifications experience photo bio',
        });

      if (!hospital) {
        throw new Error('Hospital not found');
      }

      return hospital;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get hospital by ID (no status filter - for admin use)
   */
  static async getHospitalById(id: string) {
    try {
      const hospital = await Hospital.findById(id)
        .populate('adminUserId', 'name email phone role isVerified');

      if (!hospital) {
        throw new Error('Hospital not found');
      }

      return hospital;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update hospital
   */
  static async updateHospital(id: string, data: Partial<RegisterHospitalData>, requestingUser: any) {
    try {
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        throw new Error('Hospital not found');
      }

      // Check permissions
      if (requestingUser.role === 'hospital_admin') {
        // Hospital admin can only update their own hospital
        if (hospital.adminUserId.toString() !== requestingUser._id.toString()) {
          throw new Error('Access denied');
        }
      } else if (requestingUser.role !== 'superadmin') {
        throw new Error('Access denied');
      }

      // Prevent status changes through this method
      const { status, ...updateData } = data as any;

      // If name or city is changed, regenerate slug
      if (data.name || data.city) {
        const newName = data.name || hospital.name;
        const newCity = data.city || hospital.city;
        updateData.slug = await generateUniqueSlug(newName, newCity, Hospital);
      }

      Object.assign(hospital, updateData);
      await hospital.save();

      return hospital;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all hospitals (superadmin only)
   */
  static async getAllHospitalsAdmin(filters: HospitalFilters) {
    try {
      const {
        status,
        search,
        page = 1,
        limit = 10,
      } = filters;

      // Build query
      const query: any = {};

      if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { city: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
        ];
      }

      // Pagination
      const skip = (page - 1) * limit;

      const hospitals = await Hospital.find(query)
        .populate('adminUserId', 'name email phone isVerified')
        .populate('verifiedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Hospital.countDocuments(query);

      return {
        hospitals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get hospital dashboard data for hospital admin
   */
  static async getHospitalDashboard(hospitalId: string, adminUserId: string) {
    try {
      const hospital = await Hospital.findOne({
        _id: hospitalId,
        adminUserId,
      });

      if (!hospital) {
        throw new Error('Hospital not found or access denied');
      }

      // Get doctors count
      const doctorsCount = await Doctor.countDocuments({
        hospitalId,
        isVerified: true,
      });

      return {
        hospital,
        stats: {
          doctorsCount,
          status: hospital.status,
          isVerified: hospital.status === 'verified',
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
