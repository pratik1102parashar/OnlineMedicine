import { randomUUID } from 'node:crypto'
import { STORAGE_FILES } from '../../../config/app'
import type { Order, OrderStatus } from '../../../types/entities'
import { BaseJsonRepository } from './base-json.repository'

class OrdersRepository extends BaseJsonRepository<Order> {
  constructor() {
    super(STORAGE_FILES.orders, [])
  }

  async listByUser(userId: string) {
    const orders = await this.findAll()
    return orders.filter((order) => order.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at))
  }

  async create(payload: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const orders = await this.findAll()
    const timestamp = new Date().toISOString()
    const order: Order = {
      ...payload,
      id: randomUUID(),
      created_at: timestamp,
      updated_at: timestamp
    }

    orders.push(order)
    await this.saveAll(orders)
    return order
  }

  async updateStatus(id: string, orderStatus: OrderStatus) {
    const orders = await this.findAll()
    const index = orders.findIndex((order) => order.id === id)

    if (index === -1) {
      return null
    }

    const next = { ...orders[index], order_status: orderStatus, updated_at: new Date().toISOString() }
    orders[index] = next
    await this.saveAll(orders)
    return next
  }
}

export const ordersRepository = new OrdersRepository()
