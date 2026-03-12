import { adminsRepository } from '../repositories/json/admins.repository'
import { usersRepository } from '../repositories/json/users.repository'
import { createToken } from '../utils/auth'
import { AppError } from '../utils/errors'
import { logEvent } from '../utils/logger'
import { hashPassword, verifyPassword } from '../utils/password'

export class AdminAuthService {
  async hasAdmin() {
    return adminsRepository.exists()
  }

  async setupAdmin(payload: { name: string; email: string; password: string }) {
    if (await adminsRepository.exists()) {
      throw new AppError('Admin account already exists', 409)
    }

    const user = await usersRepository.upsertAdminUser({ name: payload.name, email: payload.email })
    await adminsRepository.create({
      user_id: user.id,
      name: payload.name,
      email: payload.email,
      password_hash: hashPassword(payload.password)
    })
    const token = createToken(user, useRuntimeConfig().jwtSecret)
    await logEvent('auth', 'admin_setup_completed', { userId: user.id, email: payload.email })
    return { user, token }
  }

  async login(payload: { email: string; password: string }) {
    const admin = await adminsRepository.findByEmail(payload.email)

    if (!admin || !verifyPassword(payload.password, admin.password_hash)) {
      throw new AppError('Invalid admin email or password', 401)
    }

    const user = await usersRepository.findById(admin.user_id)

    if (!user || user.role !== 'admin') {
      throw new AppError('Admin account is unavailable', 401)
    }

    const token = createToken(user, useRuntimeConfig().jwtSecret)
    await logEvent('auth', 'admin_logged_in', { userId: user.id, email: payload.email })
    return { user, token }
  }
}

export const adminAuthService = new AdminAuthService()
