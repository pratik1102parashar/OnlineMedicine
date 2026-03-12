import { getRouterParam, readBody } from 'h3'
import { cartService } from '../../../services/cart.service'
import { requireUser } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'
import { cartItemSchema } from '../../../validators/cart'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  const medicineId = getRouterParam(event, 'id') || ''
  const body = cartItemSchema.pick({ quantity: true }).parse(await readBody(event))
  await cartService.setItem(user.id, medicineId, body.quantity)
  return { data: await cartService.getPricedCart(user.id) }
}))
