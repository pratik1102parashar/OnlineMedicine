import { getRouterParam } from 'h3'
import { inventoryService } from '../../../services/inventory.service'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  await inventoryService.deleteMedicine(getRouterParam(event, 'id') || '')
  return { ok: true }
}))
