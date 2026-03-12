import { randomUUID } from 'node:crypto'
import { STORAGE_FILES } from '../../../config/app'
import type { Coupon } from '../../../types/entities'
import { BaseJsonRepository } from './base-json.repository'

class CouponsRepository extends BaseJsonRepository<Coupon> {
  constructor() {
    super(STORAGE_FILES.coupons, [])
  }

  async findByCode(code: string) {
    const coupons = await this.findAll()
    return coupons.find((coupon) => coupon.code.toLowerCase() === code.toLowerCase()) ?? null
  }

  async create(payload: Omit<Coupon, 'id' | 'created_at' | 'updated_at'>) {
    const coupons = await this.findAll()
    const timestamp = new Date().toISOString()
    const coupon: Coupon = {
      ...payload,
      id: randomUUID(),
      created_at: timestamp,
      updated_at: timestamp
    }

    coupons.push(coupon)
    await this.saveAll(coupons)
    return coupon
  }

  async update(id: string, payload: Partial<Omit<Coupon, 'id' | 'created_at'>>) {
    const coupons = await this.findAll()
    const index = coupons.findIndex((coupon) => coupon.id === id)

    if (index === -1) {
      return null
    }

    const next: Coupon = {
      ...coupons[index],
      ...payload,
      updated_at: new Date().toISOString()
    }

    coupons[index] = next
    await this.saveAll(coupons)
    return next
  }
}

export const couponsRepository = new CouponsRepository()
