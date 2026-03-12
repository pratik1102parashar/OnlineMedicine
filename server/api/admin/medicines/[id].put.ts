import { getRouterParam, readBody } from 'h3'
import { inventoryService } from '../../../services/inventory.service'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'
import { medicineSchema } from '../../../validators/medicine'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  const body = medicineSchema.partial().parse(await readBody(event))
  return { data: await inventoryService.updateMedicine(getRouterParam(event, 'id') || '', body) }
}))
