import { medicinesRepository } from '../../../repositories/json/medicines.repository'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  return { data: await medicinesRepository.findAll() }
}))
