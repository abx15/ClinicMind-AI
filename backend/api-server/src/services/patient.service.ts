import bcrypt from 'bcryptjs'
import { User } from '../models/User.model'
import { Patient } from '../models/Patient.model'

interface RegisterPatientData {
  name: string
  email: string
  phone: string
  password: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  bloodGroup?: string
  allergies?: string[]
  medicalHistory?: string[]
  emergencyContact?: { name: string; phone: string; relation: string }
}

interface UpdatePatientData {
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  bloodGroup?: string
  allergies?: string[]
  medicalHistory?: string[]
  emergencyContact?: { name: string; phone: string; relation: string }
}

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

export const patientService = {
  async registerPatient(userData: RegisterPatientData) {
    const { name, email, phone, password, dateOfBirth, gender, bloodGroup, allergies, medicalHistory, emergencyContact } = userData

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create User with role: 'patient', isVerified: true (patients auto-verified)
    const passwordHash = bcrypt.hashSync(password, 12)
    const user = new User({
      name,
      email,
      phone,
      passwordHash,
      role: 'patient',
      isVerified: true,
      isActive: true
    })
    await user.save()

    // Create Patient profile
    const patient = new Patient({
      userId: user._id,
      dateOfBirth,
      gender,
      bloodGroup,
      allergies: allergies || [],
      medicalHistory: medicalHistory || [],
      emergencyContact
    })
    await patient.save()

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      hospitalId: user.hospitalId?.toString() || null,
      isVerified: user.isVerified
    })

    return { user, patient, token }
  },

  async updatePatientProfile(userId: string, data: UpdatePatientData) {
    const patient = await Patient.findOne({ userId })
    if (!patient) {
      throw new Error('Patient profile not found')
    }

    // Update Patient profile
    if (data.dateOfBirth !== undefined) patient.dateOfBirth = data.dateOfBirth
    if (data.gender !== undefined) patient.gender = data.gender
    if (data.bloodGroup !== undefined) patient.bloodGroup = data.bloodGroup
    if (data.allergies !== undefined) patient.allergies = data.allergies
    if (data.medicalHistory !== undefined) patient.medicalHistory = data.medicalHistory
    if (data.emergencyContact !== undefined) patient.emergencyContact = data.emergencyContact

    await patient.save()
    return patient
  },

  async getPatientProfile(userId: string) {
    const patient = await Patient.findOne({ userId })
      .populate('userId', 'name email phone')
    
    if (!patient) {
      throw new Error('Patient profile not found')
    }

    return patient
  }
}
