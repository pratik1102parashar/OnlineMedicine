import { getRouterParam, readBody } from 'h3'
import { orderService } from '../../../services/order.service'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'
import { updateOrderStatusSchema } from '../../../validators/order'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  const body = updateOrderStatusSchema.parse(await readBody(event))
  return { data: await orderService.updateStatus(getRouterParam(event, 'id') || '', body.order_status) }
}))
