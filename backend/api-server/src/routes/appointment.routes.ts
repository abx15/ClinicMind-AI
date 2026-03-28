import { Router } from 'express'
import { authenticate, AuthRequest, requireRole } from '../middlewares/auth'
import { appointmentService, AppointmentFilters } from '../services/appointment.service'
import { AppointmentStatus } from '../models/Appointment.model'

const router = Router()

router.post('/', authenticate, requireRole('patient'), async (req: AuthRequest, res, next) => {
  try {
    const { doctorId, hospitalId, date, timeSlot, notes } = req.body
    const patientId = req.user!.userId

    const appointment = await appointmentService.bookAppointment({
      doctorId,
      hospitalId,
      date: new Date(date),
      timeSlot,
      notes
    }, patientId)

    res.status(201).json({
      message: 'Appointment booked successfully',
      data: appointment
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const {
      doctorId,
      hospitalId,
      date,
      status,
      startDate,
      endDate
    } = req.query

    const filters: AppointmentFilters = {}
    if (doctorId) filters.doctorId = doctorId as string
    if (hospitalId) filters.hospitalId = hospitalId as string
    if (date) filters.date = new Date(date as string)
    if (status) filters.status = status as AppointmentStatus
    if (startDate) filters.startDate = new Date(startDate as string)
    if (endDate) filters.endDate = new Date(endDate as string)

    const appointments = await appointmentService.getAppointments(
      filters,
      req.user!.userId,
      req.user!.role
    )

    res.json({
      message: 'Appointments retrieved successfully',
      data: appointments
    })
  } catch (error: any) {
    next(error)
  }
})

router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params

    const appointment = await appointmentService.getAppointmentById(
      id,
      req.user!.userId,
      req.user!.role
    )

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    res.json({
      message: 'Appointment retrieved successfully',
      data: appointment
    })
  } catch (error: any) {
    next(error)
  }
})

router.patch('/:id/status', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const { status, cancelReason } = req.body

    if (!Object.values(['booked', 'confirmed', 'ongoing', 'completed', 'cancelled']).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const appointment = await appointmentService.updateAppointmentStatus(
      id,
      status as AppointmentStatus,
      req.user!.userId,
      req.user!.role,
      cancelReason
    )

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    res.json({
      message: 'Appointment status updated successfully',
      data: appointment
    })
  } catch (error: any) {
    next(error)
  }
})

export default router
