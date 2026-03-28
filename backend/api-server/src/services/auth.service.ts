import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, UserRole } from '../models/User.model'
import { Patient } from '../models/Patient.model'
import { env } from '../config/env'

function generateToken(payload: {
  userId: string
  role: UserRole
  hospitalId: string | null
  isVerified: boolean
}): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  })
}

export const authService = {
  async register(data: {
    name: string
    email: string
    phone: string
    password: string
    role: UserRole
  }) {
    // Only allow patient + hospital_admin via public register
    if (!['patient', 'hospital_admin'].includes(data.role)) {
      throw { status: 400, message: 'Invalid role for registration' }
    }

    const existing = await User.findOne({ email: data.email })
    if (existing) {
      throw { status: 409, message: 'Email already registered' }
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await User.create({
      name:         data.name,
      email:        data.email,
      phone:        data.phone,
      passwordHash,
      role:         data.role,
      isVerified:   data.role === 'patient', // patients auto-verified
      isActive:     true,
    })

    // Create patient profile automatically
    if (data.role === 'patient') {
      await Patient.create({ userId: user._id })
    }

    const token = generateToken({
      userId:     user._id.toString(),
      role:       user.role,
      hospitalId: null,
      isVerified: user.isVerified,
    })

    return { user: user.toSafeObject(), token }
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ email })
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' }
    }

    if (!user.isActive) {
      throw { status: 403, message: 'Account has been deactivated. Contact support.' }
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      throw { status: 401, message: 'Invalid email or password' }
    }

    const token = generateToken({
      userId:     user._id.toString(),
      role:       user.role,
      hospitalId: user.hospitalId?.toString() || null,
      isVerified: user.isVerified,
    })

    return { user: user.toSafeObject(), token }
  },

  async getMe(userId: string) {
    const user = await User.findById(userId)
    if (!user) {
      throw { status: 404, message: 'User not found' }
    }
    return user.toSafeObject()
  },
}
