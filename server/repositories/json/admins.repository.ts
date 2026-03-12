import { randomUUID } from 'node:crypto'
import { STORAGE_FILES } from '../../../config/app'
import type { Admin } from '../../../types/entities'
import { BaseJsonRepository } from './base-json.repository'

class AdminsRepository extends BaseJsonRepository<Admin> {
  constructor() {
    super(STORAGE_FILES.admins, [])
  }

  async findByEmail(email: string) {
    const admins = await this.findAll()
    return admins.find((admin) => admin.email.toLowerCase() === email.toLowerCase()) ?? null
  }

  async exists() {
    const admins = await this.findAll()
    return admins.length > 0
  }

  async create(payload: { user_id: string; name: string; email: string; password_hash: string }) {
    const admins = await this.findAll()
    const timestamp = new Date().toISOString()
    const admin: Admin = {
      id: randomUUID(),
      user_id: payload.user_id,
      name: payload.name,
      email: payload.email,
      password_hash: payload.password_hash,
      created_at: timestamp,
      updated_at: timestamp
    }

    admins.push(admin)
    await this.saveAll(admins)
    return admin
  }
}

export const adminsRepository = new AdminsRepository()
