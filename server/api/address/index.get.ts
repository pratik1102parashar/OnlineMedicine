import { addressesRepository } from '../../repositories/json/addresses.repository'
import { requireUser } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const user = await requireUser(event)
  return { data: await addressesRepository.findByUserId(user.id) }
}))
