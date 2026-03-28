import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { Doctor } from '../models/Doctor.model'

interface InviteTokenResult {
  rawToken: string
  hashedToken: string
  expiry: Date
}

export const inviteService = {
  generateInviteToken(): InviteTokenResult {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = bcrypt.hashSync(rawToken, 10)
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 48) // 48 hours from now

    return { rawToken, hashedToken, expiry }
  },

  sendInviteEmail(email: string, name: string, inviteLink: string): void {
    // Console.log for now (implement email later)
    console.log(`INVITE SENT to ${email}: ${inviteLink}`)
    console.log(`Dear ${name}, you have been invited to join ClinicMind AI as a doctor.`)
  },

  async verifyInviteToken(rawToken: string) {
    // Find all doctors with invite tokens and check manually
    const doctors = await Doctor.find({ 
      inviteToken: { $exists: true },
      inviteExpiry: { $gt: new Date() }
    })

    for (const doctor of doctors) {
      if (doctor.inviteToken && bcrypt.compareSync(rawToken, doctor.inviteToken)) {
        return doctor
      }
    }

    return null
  }
}
