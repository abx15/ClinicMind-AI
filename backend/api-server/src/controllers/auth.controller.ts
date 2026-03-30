import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { sendSuccess, sendError } from '../utils/response'
import { AuthRequest } from '../middlewares/auth'

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body)
      sendSuccess(res, result, 201, 'Registration successful')
    } catch (err: any) {
      sendError(res, err.message || 'Registration failed', err.status || 400)
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return sendError(res, 'Email and password are required')
      }
      const result = await authService.login(email, password)
      sendSuccess(res, result, 200, 'Login successful')
    } catch (err: any) {
      sendError(res, err.message || 'Login failed', err.status || 400)
    }
  },

  async getMe(req: AuthRequest, res: Response) {
    try {
      const user = await authService.getMe(req.user!.userId)
      sendSuccess(res, { user })
    } catch (err: any) {
      sendError(res, err.message || 'Failed to get user', err.status || 400)
    }
  },

  async logout(req: AuthRequest, res: Response) {
    // JWT is stateless — client deletes the token
    sendSuccess(res, null, 200, 'Logged out successfully')
  },

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body
      if (!currentPassword || !newPassword) {
        return sendError(res, 'Current password and new password are required')
      }
      const result = await authService.changePassword(req.user!.userId, currentPassword, newPassword)
      sendSuccess(res, result, 200, 'Password changed successfully')
    } catch (err: any) {
      sendError(res, err.message || 'Failed to change password', err.status || 400)
    }
  },
}
