import { readBody } from 'h3'
import { cartService } from '../../services/cart.service'
import { requireUser } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'
import { cartItemSchema } from '../../validators/cart'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  const body = cartItemSchema.parse(await readBody(event))
  await cartService.setItem(user.id, body.medicine_id, body.quantity)
  return { data: await cartService.getPricedCart(user.id) }
}))
