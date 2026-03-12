import { readBody } from 'h3'
import { cartService } from '../../services/cart.service'
import { requireUser } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'
import { couponSchema } from '../../validators/cart'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  const body = couponSchema.parse(await readBody(event))
  await cartService.applyCoupon(user.id, body.code)
  return { data: await cartService.getPricedCart(user.id) }
}))
