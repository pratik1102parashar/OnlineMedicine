import type { CartItem, CartPricing, Coupon, Medicine, OrderItem } from '../../types/entities'
import { AppError } from './errors'

export function roundCurrency(value: number) {
  return Number(value.toFixed(2))
}

export function computeMedicineFinalPrice(medicine: Pick<Medicine, 'price' | 'discount_percentage'>) {
  const discount = medicine.price * (medicine.discount_percentage / 100)
  return roundCurrency(medicine.price - discount)
}

export function computeCouponDiscount(subtotal: number, coupon: Coupon | null) {
  if (!coupon) {
    return 0
  }

  if (!coupon.is_active || new Date(coupon.expires_at).getTime() < Date.now()) {
    throw new AppError('Coupon is expired or inactive', 400)
  }

  if (subtotal < coupon.min_cart_value) {
    throw new AppError(`Coupon requires a minimum cart value of ₹${coupon.min_cart_value}`, 400)
  }

  if (coupon.discount_type === 'percentage') {
    return roundCurrency(subtotal * (coupon.discount_value / 100))
  }

  return roundCurrency(Math.min(subtotal, coupon.discount_value))
}

export function buildCartPricing(medicines: Medicine[], cartItems: CartItem[], coupon: Coupon | null): CartPricing {
  const items = cartItems.map((item) => {
    const medicine = medicines.find((candidate) => candidate.id === item.medicine_id)

    if (!medicine || !medicine.is_active) {
      throw new AppError('Cart contains an unavailable medicine', 400)
    }

    if (medicine.stock_quantity < item.quantity) {
      throw new AppError(`Insufficient stock for ${medicine.name}`, 400)
    }

    return {
      medicine_id: medicine.id,
      name: medicine.name,
      brand: medicine.brand,
      category: medicine.category,
      image: medicine.image,
      quantity: item.quantity,
      unit_price: medicine.price,
      discount_percentage: medicine.discount_percentage,
      final_price: medicine.final_price,
      requires_prescription: medicine.requires_prescription,
      max_quantity: medicine.stock_quantity
    }
  })

  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0))
  const discountedSubtotal = roundCurrency(items.reduce((sum, item) => sum + item.final_price * item.quantity, 0))
  const medicineDiscount = roundCurrency(subtotal - discountedSubtotal)
  const couponDiscount = computeCouponDiscount(discountedSubtotal, coupon)

  return {
    items,
    subtotal,
    medicine_discount: medicineDiscount,
    coupon_discount: couponDiscount,
    final_amount: roundCurrency(discountedSubtotal - couponDiscount),
    coupon
  }
}

export function buildOrderItems(pricing: CartPricing): OrderItem[] {
  return pricing.items.map(({ medicine_id, name, quantity, unit_price, discount_percentage, final_price, requires_prescription }) => ({
    medicine_id,
    name,
    quantity,
    unit_price,
    discount_percentage,
    final_price,
    requires_prescription
  }))
}
