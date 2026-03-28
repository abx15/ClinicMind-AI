import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.model'
import { Doctor } from '../models/Doctor.model'
import { Hospital } from '../models/Hospital.model'
import { inviteService } from './invite.service'
import { tenantGuard } from '../middlewares/tenantGuard'

function generateToken(payload: {
  userId: string
  role: string
  hospitalId: string | null
  isVerified: boolean
}): string {
  // This should be moved to a shared utils file
  // For now, using a simple implementation
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

async function checkTenantAccess(adminId: string, hospitalId: string): Promise<void> {
  const admin = await User.findById(adminId)
  if (!admin || admin.role !== 'hospital_admin') {
    throw new Error('Unauthorized')
  }
  
  if (admin.hospitalId?.toString() !== hospitalId) {
    throw new Error('Access denied — you do not belong to this hospital')
  }
}

interface InviteDoctorData {
  name: string
  email: string
  phone: string
  specialization: string
  qualifications: string[]
  experience?: number
}

interface SetupDoctorData {
  password: string
  bio?: string
  consultationFee?: number
  experience?: number
  photo?: string
  availableSlots?: Array<{ day: string; startTime: string; endTime: string }>
}

export const doctorService = {
  async inviteDoctor(data: InviteDoctorData, hospitalAdminId: string) {
    const { name, email, phone, specialization, qualifications, experience = 0 } = data

    // Check hospital exists and is verified
    const admin = await User.findById(hospitalAdminId).populate('hospitalId')
    if (!admin || admin.role !== 'hospital_admin' || !admin.hospitalId) {
      throw new Error('Invalid hospital admin')
    }

    const hospital = await Hospital.findById((admin.hospitalId as any)._id)
    if (!hospital || hospital.status !== 'verified') {
      throw new Error('Hospital must be verified to invite doctors')
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create User with role: 'doctor', hospitalId, isVerified: false
    const user = new User({
      name,
      email,
      phone,
      role: 'doctor',
      hospitalId: hospital._id,
      isVerified: false,
      isActive: true
    })
    await user.save()

    // Create Doctor profile linked to user
    const doctor = new Doctor({
      userId: user._id,
      hospitalId: hospital._id,
      name,
      specialization,
      qualifications,
      experience
    })
    await doctor.save()

    // Generate invite token
    const { rawToken, hashedToken, expiry } = inviteService.generateInviteToken()
    doctor.inviteToken = hashedToken
    doctor.inviteExpiry = expiry
    await doctor.save()

    // Log invite link: /doctor/setup?token=<rawToken>
    const inviteLink = `/doctor/setup?token=${rawToken}`
    inviteService.sendInviteEmail(email, name, inviteLink)

    return doctor
  },

  async setupDoctorProfile(rawToken: string, profileData: SetupDoctorData) {
    // Verify token
    const doctor = await inviteService.verifyInviteToken(rawToken)
    if (!doctor) {
      throw new Error('Invalid or expired invite token')
    }

    const { password, bio, consultationFee, experience, photo, availableSlots } = profileData

    // Update Doctor profile
    if (bio) doctor.bio = bio
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee
    if (experience !== undefined) doctor.experience = experience
    if (photo) doctor.photo = photo
    if (availableSlots) doctor.availableSlots = availableSlots

    // Set password on User (hash it)
    const user = await User.findById(doctor.userId)
    if (!user) {
      throw new Error('User not found')
    }
    user.passwordHash = bcrypt.hashSync(password, 10)
    await user.save()

    // Clear inviteToken + inviteExpiry
    doctor.inviteToken = undefined
    doctor.inviteExpiry = undefined
    await doctor.save()

    // Generate login token
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      hospitalId: user.hospitalId?.toString() || null,
      isVerified: user.isVerified
    })

    return { doctor, token }
  },

  async verifyDoctor(doctorId: string, hospitalAdminId: string) {
    // Check hospitalAdmin owns this hospital
    const admin = await User.findById(hospitalAdminId)
    if (!admin || admin.role !== 'hospital_admin') {
      throw new Error('Unauthorized')
    }

    const doctor = await Doctor.findById(doctorId).populate('userId')
    if (!doctor) {
      throw new Error('Doctor not found')
    }

    await checkTenantAccess(hospitalAdminId, doctor.hospitalId.toString())

    // Set Doctor.isVerified = true, isPublic = true
    doctor.isVerified = true
    doctor.isPublic = true
    doctor.verifiedBy = new mongoose.Types.ObjectId(hospitalAdminId)
    doctor.verifiedAt = new Date()
    await doctor.save()

    // Set User.isVerified = true
    if (doctor.userId) {
      await User.findByIdAndUpdate(doctor.userId, { isVerified: true })
    }

    return doctor
  },

  async unverifyDoctor(doctorId: string, hospitalAdminId: string) {
    const admin = await User.findById(hospitalAdminId)
    if (!admin || admin.role !== 'hospital_admin') {
      throw new Error('Unauthorized')
    }

    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      throw new Error('Doctor not found')
    }

    await checkTenantAccess(hospitalAdminId, doctor.hospitalId.toString())

    // Set isVerified = false, isPublic = false
    doctor.isVerified = false
    doctor.isPublic = false
    await doctor.save()

    // Set User.isVerified = false
    await User.findByIdAndUpdate(doctor.userId, { isVerified: false })

    return doctor
  },

  async removeDoctor(doctorId: string, hospitalAdminId: string) {
    const admin = await User.findById(hospitalAdminId)
    if (!admin || admin.role !== 'hospital_admin') {
      throw new Error('Unauthorized')
    }

    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      throw new Error('Doctor not found')
    }

    await checkTenantAccess(hospitalAdminId, doctor.hospitalId.toString())

    // Set User.isActive = false (soft delete)
    await User.findByIdAndUpdate(doctor.userId, { isActive: false })

    // Set Doctor.isPublic = false
    doctor.isPublic = false
    await doctor.save()

    return { success: true }
  },

  async getDoctorsByHospital(hospitalId: string, filters: any = {}, forAdmin = false) {
    const query: any = { hospitalId }
    
    if (!forAdmin) {
      // For public: only isVerified + isPublic = true
      query.isVerified = true
      query.isPublic = true
    }

    if (filters.specialization) {
      query.specialization = filters.specialization
    }

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })

    return doctors
  },

  async getDoctorProfile(doctorId: string) {
    const doctor = await Doctor.findById(doctorId)
      .populate('userId', 'name email phone')
    
    if (!doctor) {
      throw new Error('Doctor not found')
    }

    // Only return if public or if verified
    if (!doctor.isPublic && !doctor.isVerified) {
      throw new Error('Doctor profile not available')
    }

    return doctor
  },

  async getMyDoctorProfile(userId: string) {
    const doctor = await Doctor.findOne({ userId })
      .populate('userId', 'name email phone')
    
    if (!doctor) {
      throw new Error('Doctor profile not found')
    }

    return doctor
  },

  async updateMyDoctorProfile(userId: string, data: Partial<SetupDoctorData>) {
    const doctor = await Doctor.findOne({ userId })
    if (!doctor) {
      throw new Error('Doctor profile not found')
    }

    // Update allowed fields
    if (data.bio !== undefined) doctor.bio = data.bio
    if (data.consultationFee !== undefined) doctor.consultationFee = data.consultationFee
    if (data.experience !== undefined) doctor.experience = data.experience
    if (data.photo !== undefined) doctor.photo = data.photo
    if (data.availableSlots !== undefined) doctor.availableSlots = data.availableSlots

    await doctor.save()
    return doctor
  }
}
