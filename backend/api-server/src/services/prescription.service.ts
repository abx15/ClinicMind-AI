import { Prescription, IPrescription } from '../models/Prescription.model'
import { Appointment } from '../models/Appointment.model'
import { Doctor } from '../models/Doctor.model'

export interface CreatePrescriptionData {
  patientId: string
  appointmentId?: string
  diagnosis: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }[]
  notes?: string
  voiceTranscript?: string
  aiGenerated?: boolean
}

export const prescriptionService = {
  async createPrescription(data: CreatePrescriptionData, doctorId: string): Promise<IPrescription> {
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      throw new Error('Doctor not found')
    }

    if (!doctor.isVerified) {
      throw new Error('Doctor is not verified')
    }

    if (data.appointmentId) {
      const appointment = await Appointment.findById(data.appointmentId)
      if (!appointment) {
        throw new Error('Appointment not found')
      }

      if (appointment.doctorId.toString() !== doctorId) {
        throw new Error('Appointment does not belong to this doctor')
      }

      if (appointment.patientId.toString() !== data.patientId) {
        throw new Error('Patient mismatch in appointment')
      }
    } else {
      const hasActiveAppointment = await Appointment.findOne({
        doctorId,
        patientId: data.patientId,
        status: { $in: ['confirmed', 'ongoing', 'completed'] }
      })

      if (!hasActiveAppointment) {
        throw new Error('No active appointment found for this patient and doctor')
      }
    }

    const prescription = new Prescription({
      patientId: data.patientId,
      doctorId,
      hospitalId: doctor.hospitalId,
      appointmentId: data.appointmentId,
      diagnosis: data.diagnosis,
      medications: data.medications,
      notes: data.notes,
      voiceTranscript: data.voiceTranscript,
      aiGenerated: data.aiGenerated || false
    })

    await prescription.save()
    await prescription.populate('doctorId', 'name specialization')
    await prescription.populate('patientId', 'name phone')

    return prescription
  },

  async getPrescriptionsByPatient(patientId: string, requestingUserId: string, role: string): Promise<IPrescription[]> {
    if (role === 'patient' && patientId !== requestingUserId) {
      throw new Error('Access denied')
    }

    if (role === 'doctor') {
      const doctor = await Doctor.findById(requestingUserId)
      if (!doctor) {
        throw new Error('Doctor not found')
      }

      const hasAppointment = await Appointment.findOne({
        doctorId: requestingUserId,
        patientId,
        status: { $in: ['confirmed', 'ongoing', 'completed'] }
      })

      if (!hasAppointment) {
        throw new Error('Access denied - no appointment history with this patient')
      }
    }

    const prescriptions = await Prescription.find({ patientId })
      .sort({ createdAt: -1 })
      .populate('doctorId', 'name specialization')
      .populate('appointmentId', 'date timeSlot status')

    return prescriptions
  },

  async getPrescriptionById(id: string, requestingUserId: string, role: string): Promise<IPrescription | null> {
    const prescription = await Prescription.findById(id)
      .populate('doctorId', 'name specialization')
      .populate('patientId', 'name phone')
      .populate('appointmentId', 'date timeSlot status')

    if (!prescription) return null

    if (role === 'patient' && prescription.patientId.toString() !== requestingUserId) {
      throw new Error('Access denied')
    }

    if (role === 'doctor') {
      if (prescription.doctorId.toString() !== requestingUserId) {
        throw new Error('Access denied')
      }
    }

    if (role === 'hospital' || role === 'staff') {
      const doctor = await Doctor.findById(prescription.doctorId)
      if (!doctor || doctor.hospitalId?.toString() !== requestingUserId) {
        throw new Error('Access denied')
      }
    }

    return prescription
  },

  async getDoctorPrescriptions(doctorId: string, filters: {
    patientId?: string
    startDate?: Date
    endDate?: Date
  } = {}): Promise<IPrescription[]> {
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      throw new Error('Doctor not found')
    }

    let query: any = { doctorId }

    if (filters.patientId) {
      query.patientId = filters.patientId
    }

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      }
    }

    const prescriptions = await Prescription.find(query)
      .sort({ createdAt: -1 })
      .populate('patientId', 'name phone')
      .populate('appointmentId', 'date timeSlot status')

    return prescriptions
  },

  async updatePrescription(
    id: string,
    updates: Partial<CreatePrescriptionData>,
    doctorId: string
  ): Promise<IPrescription | null> {
    const prescription = await Prescription.findById(id)
    if (!prescription) {
      throw new Error('Prescription not found')
    }

    if (prescription.doctorId.toString() !== doctorId) {
      throw new Error('Access denied')
    }

    const allowedUpdates = ['diagnosis', 'medications', 'notes', 'voiceTranscript']
    const actualUpdates: any = {}

    for (const key of allowedUpdates) {
      if (updates[key as keyof CreatePrescriptionData] !== undefined) {
        actualUpdates[key] = updates[key as keyof CreatePrescriptionData]
      }
    }

    Object.assign(prescription, actualUpdates)
    await prescription.save()
    await prescription.populate('doctorId', 'name specialization')
    await prescription.populate('patientId', 'name phone')
    await prescription.populate('appointmentId', 'date timeSlot status')

    return prescription
  }
}
