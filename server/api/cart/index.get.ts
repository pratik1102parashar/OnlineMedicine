import { cartService } from '../../services/cart.service'
import { requireUser } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  return { data: await cartService.getPricedCart(user.id) }
}))
