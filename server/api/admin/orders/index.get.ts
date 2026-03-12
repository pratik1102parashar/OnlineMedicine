import { getQuery } from 'h3'
import { addressesRepository } from '../../../repositories/json/addresses.repository'
import { ordersRepository } from '../../../repositories/json/orders.repository'
import { usersRepository } from '../../../repositories/json/users.repository'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  const { status } = getQuery(event)
  const orders = await ordersRepository.findAll()
  const filtered = typeof status === 'string' && status ? orders.filter((order) => order.order_status === status) : orders
  const users = await usersRepository.findAll()
  const addresses = await addressesRepository.listByUserIds(filtered.map((order) => order.user_id))

  return {
    data: filtered.map((order) => {
      const user = users.find((entry) => entry.id === order.user_id)
      const address = addresses.find((entry) => entry.user_id === order.user_id)
      return {
        ...order,
        customer_name: user?.name || 'Customer',
        customer_phone: user?.phone || address?.phone || '',
        customer_email: user?.email || null,
        saved_address: address || null
      }
    })
  }
}))
