import { readBody } from 'h3'
import { couponsRepository } from '../../../repositories/json/coupons.repository'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'
import { couponAdminSchema } from '../../../validators/coupon'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  const body = couponAdminSchema.parse(await readBody(event))
  return { data: await couponsRepository.create(body) }
}))
