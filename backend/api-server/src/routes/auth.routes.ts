import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth'

export const authRoutes = Router()

authRoutes.post('/register',         authController.register)
authRoutes.post('/login',             authController.login)
authRoutes.get('/me',                 authenticate, authController.getMe)
authRoutes.post('/logout',            authenticate, authController.logout)
authRoutes.post('/change-password',   authenticate, authController.changePassword)
