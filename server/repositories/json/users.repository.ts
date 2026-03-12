import { randomUUID } from 'node:crypto'
import { STORAGE_FILES } from '../../../config/app'
import type { User } from '../../../types/entities'
import { buildDisplayName, isProfileComplete } from '../../utils/profile'
import { BaseJsonRepository } from './base-json.repository'

class UsersRepository extends BaseJsonRepository<User> {
  constructor() {
    super(STORAGE_FILES.users, [])
  }

  async findByPhone(phone: string) {
    const users = await this.findAll()
    return users.find((user) => user.phone === phone) ?? null
  }

  async findByEmail(email: string) {
    const users = await this.findAll()
    return users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null
  }

  async findById(id: string) {
    const users = await this.findAll()
    return users.find((user) => user.id === id) ?? null
  }

  async findAll() {
    const users = await super.findAll()
    return users.map((user) => {
      const firstName = typeof user.first_name === 'string' ? user.first_name : user.name?.split(' ')[0] || ''
      const lastName = typeof user.last_name === 'string' ? user.last_name : user.name?.split(' ').slice(1).join(' ') || ''
      const normalized: User = {
        ...user,
        phone: user.phone || '',
        first_name: firstName,
        last_name: lastName,
        email: user.email ?? null,
        profile_completed: typeof user.profile_completed === 'boolean' ? user.profile_completed : isProfileComplete({
          role: user.role,
          first_name: firstName,
          last_name: lastName
        }),
        name: buildDisplayName(firstName, lastName, user.name || user.phone || 'Customer')
      }

      return normalized
    })
  }

  async createCustomer(phone: string) {
    const users = await this.findAll()
    const timestamp = new Date().toISOString()
    const user: User = {
      id: randomUUID(),
      name: `Customer ${phone.slice(-4)}`,
      phone,
      first_name: '',
      last_name: '',
      email: null,
      role: 'customer',
      profile_completed: false,
      created_at: timestamp,
      updated_at: timestamp
    }

    users.push(user)
    await this.saveAll(users)
    return user
  }

  async updateProfile(id: string, payload: { first_name: string; last_name: string; email: string | null }) {
    const users = await this.findAll()
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) {
      return null
    }

    const next: User = {
      ...users[index],
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      name: buildDisplayName(payload.first_name, payload.last_name, users[index].phone || users[index].name),
      profile_completed: true,
      updated_at: new Date().toISOString()
    }

    users[index] = next
    await this.saveAll(users)
    return next
  }

  async upsertAdminUser(payload: { name: string; email: string }) {
    const existing = await this.findByEmail(payload.email)
    const timestamp = new Date().toISOString()
    const [firstName, ...rest] = payload.name.trim().split(/\s+/)
    const nextUser: User = {
      id: existing?.id || randomUUID(),
      phone: existing?.phone || '',
      first_name: firstName || payload.name.trim(),
      last_name: rest.join(' '),
      email: payload.email,
      name: payload.name.trim(),
      role: 'admin',
      profile_completed: true,
      created_at: existing?.created_at || timestamp,
      updated_at: timestamp
    }

    const users = (await this.findAll()).filter((user) => user.id !== nextUser.id)
    users.push(nextUser)
    await this.saveAll(users)
    return nextUser
  }

  async listCustomers() {
    const users = await this.findAll()
    return users.filter((user) => user.role === 'customer').sort((a, b) => b.created_at.localeCompare(a.created_at))
  }
}

export const usersRepository = new UsersRepository()
