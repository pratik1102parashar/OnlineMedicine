import { STORAGE_FILES } from '../../../config/app'
import type { Cart } from '../../../types/entities'
import { BaseJsonRepository } from './base-json.repository'

class CartsRepository extends BaseJsonRepository<Cart> {
  constructor() {
    super(STORAGE_FILES.carts, [])
  }

  async findByUserId(userId: string) {
    const carts = await this.findAll()
    return carts.find((cart) => cart.user_id === userId) ?? null
  }

  async saveCart(cart: Cart) {
    const carts = await this.findAll()
    const next = carts.filter((entry) => entry.user_id !== cart.user_id)
    next.push(cart)
    await this.saveAll(next)
    return cart
  }
}

export const cartsRepository = new CartsRepository()
