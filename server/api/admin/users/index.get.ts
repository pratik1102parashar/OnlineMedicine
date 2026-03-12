import { addressesRepository } from '../../../repositories/json/addresses.repository'
import { usersRepository } from '../../../repositories/json/users.repository'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  const users = await usersRepository.listCustomers()
  const addresses = await addressesRepository.listByUserIds(users.map((user) => user.id))

  return {
    data: users.map((user) => ({
      ...user,
      address: addresses.find((address) => address.user_id === user.id) || null
    }))
  }
}))
