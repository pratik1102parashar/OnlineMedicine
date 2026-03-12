import type { Cart } from '../../types/entities'
import { cartsRepository } from '../repositories/json/carts.repository'
import { couponsRepository } from '../repositories/json/coupons.repository'
import { medicinesRepository } from '../repositories/json/medicines.repository'
import { AppError } from '../utils/errors'
import { buildCartPricing } from '../utils/pricing'

export class CartService {
  async getOrCreateCart(userId: string): Promise<Cart> {
    const existing = await cartsRepository.findByUserId(userId)

    if (existing) {
      return existing
    }

    const next: Cart = {
      user_id: userId,
      items: [],
      coupon_code: null,
      updated_at: new Date().toISOString()
    }

    await cartsRepository.saveCart(next)
    return next
  }

  async getPricedCart(userId: string) {
    const cart = await this.getOrCreateCart(userId)
    const medicines = await medicinesRepository.findAll()
    const coupon = cart.coupon_code ? await couponsRepository.findByCode(cart.coupon_code) : null
    const pricing = buildCartPricing(medicines, cart.items, coupon)
    return { cart, pricing }
  }

  async setItem(userId: string, medicineId: string, quantity: number) {
    if (quantity < 1) {
      throw new AppError('Quantity should be at least 1', 400)
    }

    const medicine = await medicinesRepository.findById(medicineId)

    if (!medicine || !medicine.is_active) {
      throw new AppError('Medicine is not available', 404)
    }

    if (medicine.stock_quantity < quantity) {
      throw new AppError('Requested quantity is not available in stock', 400)
    }

    const cart = await this.getOrCreateCart(userId)
    const nextItems = cart.items.filter((item) => item.medicine_id !== medicineId)
    nextItems.push({ medicine_id: medicineId, quantity })
    return cartsRepository.saveCart({ ...cart, items: nextItems, updated_at: new Date().toISOString() })
  }

  async removeItem(userId: string, medicineId: string) {
    const cart = await this.getOrCreateCart(userId)
    return cartsRepository.saveCart({
      ...cart,
      items: cart.items.filter((item) => item.medicine_id !== medicineId),
      updated_at: new Date().toISOString()
    })
  }

  async applyCoupon(userId: string, code: string) {
    const cart = await this.getOrCreateCart(userId)
    const coupon = await couponsRepository.findByCode(code)

    if (!coupon) {
      throw new AppError('Coupon not found', 404)
    }

    const next = { ...cart, coupon_code: coupon.code, updated_at: new Date().toISOString() }
    await cartsRepository.saveCart(next)
    await this.getPricedCart(userId)
    return next
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId)
    await cartsRepository.saveCart({ ...cart, items: [], coupon_code: null, updated_at: new Date().toISOString() })
  }
}

export const cartService = new CartService()
