import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { UserRole } from '../models/User.model'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    role: UserRole
    hospitalId: string | null
    isVerified: boolean
  }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any
    req.user = {
      userId:     decoded.userId,
      role:       decoded.role,
      hospitalId: decoded.hospitalId || null,
      isVerified: decoded.isVerified,
    }
    next()
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Required: ${roles.join('/')}. Your role: ${req.user.role}` 
      })
      return
    }
    next()
  }
}

export const requireVerified = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized' })
    return
  }
  if (!req.user.isVerified) {
    res.status(403).json({ success: false, error: 'Account not verified yet. Please wait for verification.' })
    return
  }
  next()
}
