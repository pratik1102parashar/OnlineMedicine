import { randomUUID } from 'node:crypto'
import { STORAGE_FILES } from '../../../config/app'
import type { Address, AddressInput } from '../../../types/entities'
import { sanitizeAddressInput } from '../../utils/profile'
import { BaseJsonRepository } from './base-json.repository'

class AddressesRepository extends BaseJsonRepository<Address> {
  constructor() {
    super(STORAGE_FILES.addresses, [])
  }

  async findByUserId(userId: string) {
    const addresses = await this.findAll()
    return addresses.find((address) => address.user_id === userId) ?? null
  }

  async upsert(userId: string, payload: AddressInput) {
    const addresses = await this.findAll()
    const existing = addresses.find((address) => address.user_id === userId)
    const sanitized = sanitizeAddressInput(payload)
    const timestamp = new Date().toISOString()
    const next: Address = {
      id: existing?.id || randomUUID(),
      user_id: userId,
      created_at: existing?.created_at || timestamp,
      updated_at: timestamp,
      ...sanitized
    }

    const others = addresses.filter((address) => address.user_id !== userId)
    others.push(next)
    await this.saveAll(others)
    return next
  }

  async listByUserIds(userIds: string[]) {
    const addresses = await this.findAll()
    const index = new Set(userIds)
    return addresses.filter((address) => index.has(address.user_id))
  }
}

export const addressesRepository = new AddressesRepository()
