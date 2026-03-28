import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', err)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message)
    res.status(400).json({ success: false, error: 'Validation failed', details: errors })
    return
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0]
    res.status(409).json({ success: false, error: `${field} already exists` })
    return
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, error: 'Invalid token' })
    return
  }

  // Default error
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  })
}
