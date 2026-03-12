import { getRouterParam } from 'h3'
import { cartService } from '../../../services/cart.service'
import { requireUser } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  await cartService.removeItem(user.id, getRouterParam(event, 'id') || '')
  return { data: await cartService.getPricedCart(user.id) }
}))
