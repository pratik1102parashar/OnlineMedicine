import { readBody } from 'h3'
import { orderService } from '../../services/order.service'
import { requireUser } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'
import { placeOrderSchema } from '../../validators/order'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  const body = placeOrderSchema.parse(await readBody(event))
  return { data: await orderService.placeOrder(user, body.payment_method) }
}))
