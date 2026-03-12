import { getRouterParam } from 'h3'
import { medicineService } from '../../services/medicine.service'
import { AppError } from '../../utils/errors'
import { withErrorHandling } from '../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const medicine = await medicineService.getById(getRouterParam(event, 'id') || '')
  if (!medicine) {
    throw new AppError('Medicine not found', 404)
  }
  return { data: medicine }
}))
