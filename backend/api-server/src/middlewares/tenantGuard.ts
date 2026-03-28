import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth'

export const tenantGuard = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized' })
    return
  }

  // Superadmin bypasses tenant check
  if (req.user.role === 'superadmin') {
    next()
    return
  }

  const requestedHospitalId =
    req.params.hospitalId ||
    req.body?.hospitalId ||
    req.query?.hospitalId as string

  if (requestedHospitalId && req.user.hospitalId !== requestedHospitalId) {
    res.status(403).json({
      success: false,
      error: 'Access denied — you do not belong to this hospital'
    })
    return
  }

  next()
}
