import type { Medicine } from '../../types/entities'
import { inventoryRepository } from '../repositories/json/inventory.repository'
import { medicinesRepository } from '../repositories/json/medicines.repository'
import { AppError } from '../utils/errors'
import { logEvent } from '../utils/logger'

export class InventoryService {
  async createMedicine(payload: Omit<Medicine, 'id' | 'final_price' | 'created_at' | 'updated_at'>) {
    const medicine = await medicinesRepository.create(payload)
    await inventoryRepository.upsertFromMedicine(medicine)
    await logEvent('inventory', 'medicine_created', { medicineId: medicine.id, name: medicine.name })
    return medicine
  }

  async updateMedicine(id: string, payload: Partial<Omit<Medicine, 'id' | 'created_at'>>) {
    const updated = await medicinesRepository.update(id, payload)

    if (!updated) {
      throw new AppError('Medicine not found', 404)
    }

    await inventoryRepository.upsertFromMedicine(updated)
    await logEvent('inventory', 'medicine_updated', { medicineId: updated.id })
    return updated
  }

  async deleteMedicine(id: string) {
    await medicinesRepository.delete(id)
    await inventoryRepository.remove(id)
    await logEvent('inventory', 'medicine_deleted', { medicineId: id })
  }
}

export const inventoryService = new InventoryService()
