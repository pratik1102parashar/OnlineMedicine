import type { Medicine } from '../../types/entities'
import { medicinesRepository } from '../repositories/json/medicines.repository'

export class MedicineService {
  async list(query: Record<string, string | undefined>) {
    const page = Number(query.page || 1)
    const limit = Number(query.limit || 8)
    const search = query.search?.toLowerCase() || ''
    const category = query.category?.toLowerCase()
    const brand = query.brand?.toLowerCase()

    const medicines = (await medicinesRepository.findAll()).filter((medicine) => {
      if (!medicine.is_active) {
        return false
      }

      const matchesSearch = !search || [medicine.name, medicine.brand, medicine.category].some((value) => value.toLowerCase().includes(search))
      const matchesCategory = !category || medicine.category.toLowerCase() === category
      const matchesBrand = !brand || medicine.brand.toLowerCase() === brand
      return matchesSearch && matchesCategory && matchesBrand
    })

    const start = (page - 1) * limit
    return {
      items: medicines.slice(start, start + limit),
      total: medicines.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(medicines.length / limit)),
      categories: [...new Set(medicines.map((medicine) => medicine.category))],
      brands: [...new Set(medicines.map((medicine) => medicine.brand))]
    }
  }

  async getById(id: string): Promise<Medicine | null> {
    return medicinesRepository.findById(id)
  }
}

export const medicineService = new MedicineService()
