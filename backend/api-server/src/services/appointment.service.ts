import { Appointment, IAppointment, AppointmentStatus } from '../models/Appointment.model'
import { Doctor } from '../models/Doctor.model'
import { Hospital } from '../models/Hospital.model'

export interface BookAppointmentData {
  doctorId: string
  hospitalId: string
  date: Date
  timeSlot: string
  notes?: string
}

export interface AppointmentFilters {
  doctorId?: string
  hospitalId?: string
  date?: Date
  status?: AppointmentStatus
  startDate?: Date
  endDate?: Date
}

export const appointmentService = {
  async bookAppointment(data: BookAppointmentData, patientId: string): Promise<IAppointment> {
    const doctor = await Doctor.findById(data.doctorId)
    if (!doctor) {
      throw new Error('Doctor not found')
    }

    if (!doctor.isVerified) {
      throw new Error('Doctor is not verified')
    }

    const hospital = await Hospital.findById(data.hospitalId)
    if (!hospital) {
      throw new Error('Hospital not found')
    }

    const existingAppointment = await Appointment.findOne({
      doctorId: data.doctorId,
      date: data.date,
      timeSlot: data.timeSlot,
      status: { $nin: ['cancelled'] }
    })

    if (existingAppointment) {
      throw new Error('This time slot is already booked')
    }

    const appointment = new Appointment({
      patientId,
      doctorId: data.doctorId,
      hospitalId: data.hospitalId,
      date: data.date,
      timeSlot: data.timeSlot,
      notes: data.notes,
      status: 'booked'
    })

    await appointment.save()
    await appointment.populate('doctorId', 'name specialization')
    await appointment.populate('hospitalId', 'name')

    return appointment
  },

  async getAppointments(
    filters: AppointmentFilters = {},
    userId: string,
    role: string
  ): Promise<IAppointment[]> {
    let query: any = {}

    if (role === 'patient') {
      query.patientId = userId
    } else if (role === 'doctor') {
      query.doctorId = userId
    } else if (role === 'hospital' || role === 'staff') {
      const user = await Doctor.findById(userId) || await Hospital.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }
      query.hospitalId = user.hospitalId || user._id
    }

    if (filters.doctorId) query.doctorId = filters.doctorId
    if (filters.hospitalId) query.hospitalId = filters.hospitalId
    if (filters.status) query.status = filters.status
    
    if (filters.date) {
      const startOfDay = new Date(filters.date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(filters.date)
      endOfDay.setHours(23, 59, 59, 999)
      query.date = { $gte: startOfDay, $lte: endOfDay }
    }

    if (filters.startDate && filters.endDate) {
      query.date = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      }
    }

    const appointments = await Appointment.find(query)
      .sort({ date: 1, timeSlot: 1 })
      .populate('doctorId', 'name specialization')
      .populate('hospitalId', 'name')
      .populate('patientId', 'name phone')

    return appointments
  },

  async getAppointmentById(id: string, userId: string, role: string): Promise<IAppointment | null> {
    const appointment = await Appointment.findById(id)
      .populate('doctorId', 'name specialization')
      .populate('hospitalId', 'name')
      .populate('patientId', 'name phone')

    if (!appointment) return null

    if (role === 'patient' && appointment.patientId.toString() !== userId) {
      throw new Error('Access denied')
    }

    if (role === 'doctor' && appointment.doctorId.toString() !== userId) {
      throw new Error('Access denied')
    }

    if (role === 'hospital' || role === 'staff') {
      const user = await Doctor.findById(userId) || await Hospital.findById(userId)
      if (!user || (appointment.hospitalId.toString() !== (user.hospitalId || user._id).toString())) {
        throw new Error('Access denied')
      }
    }

    return appointment
  },

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
    userId: string,
    role: string,
    cancelReason?: string
  ): Promise<IAppointment | null> {
    const appointment = await Appointment.findById(id)
    if (!appointment) {
      throw new Error('Appointment not found')
    }

    if (role === 'patient') {
      if (appointment.patientId.toString() !== userId) {
        throw new Error('Access denied')
      }
      if (status !== 'cancelled') {
        throw new Error('Patients can only cancel appointments')
      }
      if (appointment.status !== 'booked') {
        throw new Error('Can only cancel booked appointments')
      }
    }

    if (role === 'doctor') {
      if (appointment.doctorId.toString() !== userId) {
        throw new Error('Access denied')
      }
      if (!['confirmed', 'ongoing', 'completed'].includes(status)) {
        throw new Error('Doctors can only set confirmed, ongoing, or completed status')
      }
    }

    if (role === 'staff' || role === 'hospital') {
      const user = await Doctor.findById(userId) || await Hospital.findById(userId)
      if (!user || (appointment.hospitalId.toString() !== (user.hospitalId || user._id).toString())) {
        throw new Error('Access denied')
      }
      if (!['confirmed', 'cancelled'].includes(status)) {
        throw new Error('Staff can only set confirmed or cancelled status')
      }
    }

    appointment.status = status
    if (status === 'cancelled' && cancelReason) {
      appointment.cancelReason = cancelReason
    }

    await appointment.save()
    await appointment.populate('doctorId', 'name specialization')
    await appointment.populate('hospitalId', 'name')
    await appointment.populate('patientId', 'name phone')

    return appointment
  }
}
