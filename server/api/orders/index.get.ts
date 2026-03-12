import { orderService } from '../../services/order.service'
import { requireUser } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  return { data: await orderService.listForUser(user) }
}))
