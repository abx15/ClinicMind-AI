import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { User } from '../models/User.model'
import { Staff } from '../models/Staff.model'

interface AddStaffData {
  name: string
  email: string
  phone: string
  role: 'receptionist' | 'nurse' | 'pharmacist'
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

export const staffService = {
  async addStaff(data: AddStaffData, hospitalAdminId: string) {
    const { name, email, phone, role } = data

    // Get hospital admin to get hospital ID
    const admin = await User.findById(hospitalAdminId)
    if (!admin || admin.role !== 'hospital_admin' || !admin.hospitalId) {
      throw new Error('Invalid hospital admin')
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Generate temp password
    const tempPassword = crypto.randomBytes(8).toString('hex')
    const passwordHash = bcrypt.hashSync(tempPassword, 12)

    // Create User with role: 'staff', hospitalId
    const user = new User({
      name,
      email,
      phone,
      passwordHash,
      role: 'staff',
      hospitalId: admin.hospitalId,
      isVerified: true,
      isActive: true
    })
    await user.save()

    // Create Staff record
    const staff = new Staff({
      userId: user._id,
      hospitalId: admin.hospitalId,
      role,
      isActive: true
    })
    await staff.save()

    // Log temp password
    console.log(`STAFF CREATED - Email: ${email}, Temp Password: ${tempPassword}`)
    console.log(`Please share this password securely with ${name}`)

    return staff
  },

  async removeStaff(staffId: string, hospitalAdminId: string) {
    const staff = await Staff.findById(staffId)
    if (!staff) {
      throw new Error('Staff not found')
    }

    // tenantGuard check
    await checkTenantAccess(hospitalAdminId, staff.hospitalId.toString())

    // Set User.isActive = false
    await User.findByIdAndUpdate(staff.userId, { isActive: false })

    return { success: true }
  },

  async getStaffByHospital(hospitalId: string) {
    const staff = await Staff.find({ hospitalId, isActive: true })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })

    return staff
  }
}
