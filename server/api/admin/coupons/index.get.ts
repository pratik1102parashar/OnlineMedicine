import { couponsRepository } from '../../../repositories/json/coupons.repository'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  return { data: await couponsRepository.findAll() }
}))
