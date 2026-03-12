import { randomUUID } from 'node:crypto'
import { STORAGE_FILES } from '../../../config/app'
import type { User } from '../../../types/entities'
import { BaseJsonRepository } from './base-json.repository'

class UsersRepository extends BaseJsonRepository<User> {
  constructor() {
    super(STORAGE_FILES.users, [])
  }

  async findByPhone(phone: string) {
    const users = await this.findAll()
    return users.find((user) => user.phone === phone) ?? null
  }

  async findById(id: string) {
    const users = await this.findAll()
    return users.find((user) => user.id === id) ?? null
  }

  async createCustomer(phone: string, name?: string) {
    const users = await this.findAll()
    const timestamp = new Date().toISOString()
    const user: User = {
      id: randomUUID(),
      name: name || `Customer ${phone.slice(-4)}`,
      phone,
      role: 'customer',
      created_at: timestamp,
      updated_at: timestamp
    }

    users.push(user)
    await this.saveAll(users)
    return user
  }
}

export const usersRepository = new UsersRepository()
