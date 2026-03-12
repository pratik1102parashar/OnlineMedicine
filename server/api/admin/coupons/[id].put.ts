import { getRouterParam, readBody } from 'h3'
import { couponsRepository } from '../../../repositories/json/coupons.repository'
import { AppError } from '../../../utils/errors'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'
import { couponAdminSchema } from '../../../validators/coupon'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  const body = couponAdminSchema.partial().parse(await readBody(event))
  const coupon = await couponsRepository.update(getRouterParam(event, 'id') || '', body)
  if (!coupon) {
    throw new AppError('Coupon not found', 404)
  }
  return { data: coupon }
}))
