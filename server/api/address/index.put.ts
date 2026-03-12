import { readBody } from 'h3'
import { addressesRepository } from '../../repositories/json/addresses.repository'
import { requireUser } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'
import { placeOrderSchema } from '../../validators/order'

const addressSchema = placeOrderSchema.shape.address

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  const body = addressSchema.parse(await readBody(event))
  return { data: await addressesRepository.upsert(user.id, body) }
}))
