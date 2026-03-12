import { describe, expect, it } from 'vitest'
import { AppError } from '../server/utils/errors'
import { buildCartPricing, computeMedicineFinalPrice } from '../server/utils/pricing'

const medicines = [
  {
    id: 'med-1',
    name: 'Paracetamol',
    brand: 'Brand A',
    description: 'Pain relief',
    price: 100,
    discount_percentage: 10,
    final_price: 90,
    category: 'Pain Relief',
    image: '/one.svg',
    stock_quantity: 5,
    requires_prescription: false,
    is_active: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'med-2',
    name: 'Vitamin C',
    brand: 'Brand B',
    description: 'Immunity',
    price: 200,
    discount_percentage: 0,
    final_price: 200,
    category: 'Supplements',
    image: '/two.svg',
    stock_quantity: 2,
    requires_prescription: false,
    is_active: true,
    created_at: '',
    updated_at: ''
  }
]

describe('pricing utilities', () => {
  it('computes medicine final price using percentage discount', () => {
    expect(computeMedicineFinalPrice({ price: 250, discount_percentage: 12 })).toBe(220)
  })

  it('builds cart totals with medicine and coupon discounts', () => {
    const pricing = buildCartPricing(
      medicines,
      [
        { medicine_id: 'med-1', quantity: 2 },
        { medicine_id: 'med-2', quantity: 1 }
      ],
      {
        id: 'coupon-1',
        code: 'SAVE10',
        description: 'Save 10%',
        discount_type: 'percentage',
        discount_value: 10,
        min_cart_value: 100,
        expires_at: '2027-01-01T00:00:00.000Z',
        is_active: true,
        created_at: '',
        updated_at: ''
      }
    )

    expect(pricing.subtotal).toBe(400)
    expect(pricing.medicine_discount).toBe(20)
    expect(pricing.coupon_discount).toBe(38)
    expect(pricing.final_amount).toBe(342)
  })

  it('rejects carts when stock is insufficient', () => {
    expect(() => buildCartPricing(medicines, [{ medicine_id: 'med-2', quantity: 3 }], null)).toThrow(AppError)
  })
})
