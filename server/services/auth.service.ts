import { otpRepository } from '../repositories/json/otp.repository'
import { usersRepository } from '../repositories/json/users.repository'
import { createToken, normalizePhone } from '../utils/auth'
import { AppError } from '../utils/errors'
import { logEvent } from '../utils/logger'

export class AuthService {
  async requestOtp(phoneInput: string) {
    const phone = normalizePhone(phoneInput)

    if (phone.length < 10) {
      throw new AppError('Please enter a valid mobile number', 400)
    }

    const config = useRuntimeConfig()
    const code = `${Math.floor(100000 + Math.random() * 900000)}`
    const record = {
      phone,
      code,
      attempts: 0,
      requested_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + config.otpExpiryMinutes * 60_000).toISOString()
    }

    await otpRepository.upsert(record)
    console.log(`[OTP] ${phone}: ${code}`)
    await logEvent('auth', 'otp_requested', { phone })

    return { phone, expires_at: record.expires_at }
  }

  async verifyOtp(phoneInput: string, code: string) {
    const phone = normalizePhone(phoneInput)
    const record = await otpRepository.findByPhone(phone)

    if (!record) {
      throw new AppError('OTP not requested for this number', 400)
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      await otpRepository.remove(phone)
      throw new AppError('OTP has expired. Please request a new one.', 400)
    }

    if (record.code !== code) {
      throw new AppError('Invalid OTP', 400)
    }

    let user = await usersRepository.findByPhone(phone)
    if (!user) {
      user = await usersRepository.createCustomer(phone)
    }

    await otpRepository.remove(phone)
    const token = createToken(user, useRuntimeConfig().jwtSecret)
    await logEvent('auth', 'otp_verified', { phone, userId: user.id, role: user.role })

    return { user, token }
  }
}

export const authService = new AuthService()
