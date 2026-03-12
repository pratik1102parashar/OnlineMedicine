import type { AddressInput, OrderStatus, PaymentMethod, User } from '../../types/entities'
import { LOW_STOCK_THRESHOLD, ORDER_STATUSES } from '../../config/app'
import { addressesRepository } from '../repositories/json/addresses.repository'
import { cartsRepository } from '../repositories/json/carts.repository'
import { couponsRepository } from '../repositories/json/coupons.repository'
import { inventoryRepository } from '../repositories/json/inventory.repository'
import { medicinesRepository } from '../repositories/json/medicines.repository'
import { ordersRepository } from '../repositories/json/orders.repository'
import { AppError } from '../utils/errors'
import { logEvent } from '../utils/logger'
import { buildOrderItems, buildCartPricing } from '../utils/pricing'
import { paymentService } from './payment.service'

export class OrderService {
  async placeOrder(user: User, paymentMethod: PaymentMethod, addressInput: AddressInput) {
    if (paymentMethod !== 'COD') {
      throw new AppError('Unsupported payment method', 400)
    }

    if (!user.profile_completed) {
      throw new AppError('Complete your profile before placing an order', 400)
    }

    const cart = await cartsRepository.findByUserId(user.id)

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400)
    }

    const medicines = await medicinesRepository.findAll()
    const coupon = cart.coupon_code ? await couponsRepository.findByCode(cart.coupon_code) : null
    const pricing = buildCartPricing(medicines, cart.items, coupon)

    const updatedMedicines = medicines.map((medicine) => {
      const item = cart.items.find((entry) => entry.medicine_id === medicine.id)

      if (!item) {
        return medicine
      }

      if (medicine.stock_quantity < item.quantity) {
        throw new AppError(`Insufficient stock for ${medicine.name}`, 400)
      }

      return {
        ...medicine,
        stock_quantity: medicine.stock_quantity - item.quantity,
        is_active: medicine.stock_quantity - item.quantity > 0 ? medicine.is_active : false,
        updated_at: new Date().toISOString()
      }
    })

    await medicinesRepository.saveAll(updatedMedicines)
    await Promise.all(updatedMedicines.map((medicine) => inventoryRepository.upsertFromMedicine(medicine)))

    const previewOrder = {
      id: 'preview',
      final_amount: pricing.final_amount
    }
    const payment = await paymentService.process(paymentMethod, previewOrder)

    const address = await addressesRepository.upsert(user.id, addressInput)
    const order = await ordersRepository.create({
      user_id: user.id,
      items: buildOrderItems(pricing),
      shipping_address: {
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        phone: address.phone
      },
      subtotal: pricing.subtotal,
      medicine_discount: pricing.medicine_discount,
      coupon_discount: pricing.coupon_discount,
      final_amount: pricing.final_amount,
      coupon_code: cart.coupon_code,
      payment_method: paymentMethod,
      payment_status: payment.payment_status,
      order_status: 'Pending'
    })

    await cartsRepository.saveCart({ ...cart, items: [], coupon_code: null, updated_at: new Date().toISOString() })
    await logEvent('orders', 'order_placed', { orderId: order.id, userId: user.id, finalAmount: order.final_amount })
    await logEvent('payments', 'payment_initialized', { orderId: order.id, method: paymentMethod, status: payment.payment_status })
    const lowStockCount = updatedMedicines.filter((medicine) => medicine.stock_quantity <= LOW_STOCK_THRESHOLD).length
    if (lowStockCount > 0) {
      await logEvent('inventory', 'low_stock_alert', { count: lowStockCount })
    }
    return order
  }

  async listForUser(user: User) {
    if (user.role === 'admin') {
      return ordersRepository.findAll()
    }

    return ordersRepository.listByUser(user.id)
  }

  async updateStatus(orderId: string, orderStatus: OrderStatus) {
    if (!ORDER_STATUSES.includes(orderStatus)) {
      throw new AppError('Invalid order status', 400)
    }

    const order = await ordersRepository.updateStatus(orderId, orderStatus)

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    await logEvent('orders', 'order_status_updated', { orderId, orderStatus })
    return order
  }

  async cancelOrder(orderId: string, user: User) {
    const order = await ordersRepository.findById(orderId)

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    if (order.user_id !== user.id) {
      throw new AppError('You cannot cancel this order', 403)
    }

    if (order.order_status === 'Delivered') {
      throw new AppError('No return or replacement policy.', 400)
    }

    if (order.order_status === 'Cancelled') {
      return order
    }

    return this.updateStatus(orderId, 'Cancelled')
  }
}

export const orderService = new OrderService()
