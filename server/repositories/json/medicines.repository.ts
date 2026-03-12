import { randomUUID } from 'node:crypto'
import { STORAGE_FILES } from '../../../config/app'
import type { Medicine } from '../../../types/entities'
import { computeMedicineFinalPrice } from '../../utils/pricing'
import { BaseJsonRepository } from './base-json.repository'

class MedicinesRepository extends BaseJsonRepository<Medicine> {
  constructor() {
    super(STORAGE_FILES.medicines, [])
  }

  async findById(id: string) {
    const medicines = await this.findAll()
    return medicines.find((medicine) => medicine.id === id) ?? null
  }

  async create(payload: Omit<Medicine, 'id' | 'final_price' | 'created_at' | 'updated_at'>) {
    const medicines = await this.findAll()
    const timestamp = new Date().toISOString()
    const medicine: Medicine = {
      ...payload,
      id: randomUUID(),
      final_price: computeMedicineFinalPrice(payload),
      created_at: timestamp,
      updated_at: timestamp
    }

    medicines.push(medicine)
    await this.saveAll(medicines)
    return medicine
  }

  async update(id: string, payload: Partial<Omit<Medicine, 'id' | 'created_at'>>) {
    const medicines = await this.findAll()
    const index = medicines.findIndex((medicine) => medicine.id === id)

    if (index === -1) {
      return null
    }

    const updated: Medicine = {
      ...medicines[index],
      ...payload,
      final_price: computeMedicineFinalPrice({
        price: payload.price ?? medicines[index].price,
        discount_percentage: payload.discount_percentage ?? medicines[index].discount_percentage
      }),
      updated_at: new Date().toISOString()
    }

    medicines[index] = updated
    await this.saveAll(medicines)
    return updated
  }

  async delete(id: string) {
    const medicines = await this.findAll()
    await this.saveAll(medicines.filter((medicine) => medicine.id !== id))
  }
}

export const medicinesRepository = new MedicinesRepository()
