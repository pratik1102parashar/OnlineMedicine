import { STORAGE_FILES } from '../../../config/app'
import type { InventoryRecord, Medicine } from '../../../types/entities'
import { BaseJsonRepository } from './base-json.repository'

class InventoryRepository extends BaseJsonRepository<InventoryRecord> {
  constructor() {
    super(STORAGE_FILES.inventory, [])
  }

  async findByMedicineId(medicineId: string) {
    const inventory = await this.findAll()
    return inventory.find((entry) => entry.medicine_id === medicineId) ?? null
  }

  async upsertFromMedicine(medicine: Medicine) {
    const inventory = await this.findAll()
    const next = inventory.filter((entry) => entry.medicine_id !== medicine.id)
    next.push({
      medicine_id: medicine.id,
      stock_quantity: medicine.stock_quantity,
      is_active: medicine.is_active,
      updated_at: medicine.updated_at
    })
    await this.saveAll(next)
  }

  async remove(medicineId: string) {
    const inventory = await this.findAll()
    await this.saveAll(inventory.filter((entry) => entry.medicine_id !== medicineId))
  }
}

export const inventoryRepository = new InventoryRepository()
