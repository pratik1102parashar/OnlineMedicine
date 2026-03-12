import { describe, expect, it } from 'vitest'
import { placeOrderSchema } from '../server/validators/order'
import { isProfileComplete, normalizeOrderStatus } from '../server/utils/profile'

describe('profile completion rules', () => {
  it('requires first and last name for customers', () => {
    expect(isProfileComplete({ role: 'customer', first_name: '', last_name: 'User' })).toBe(false)
    expect(isProfileComplete({ role: 'customer', first_name: 'Test', last_name: 'User' })).toBe(true)
  })

  it('always treats admins as complete', () => {
    expect(isProfileComplete({ role: 'admin', first_name: '', last_name: '' })).toBe(true)
  })
})

describe('order status normalization', () => {
  it('maps legacy order statuses to the new customer-facing statuses', () => {
    expect(normalizeOrderStatus('PLACED')).toBe('Pending')
    expect(normalizeOrderStatus('CONFIRMED')).toBe('Processing')
    expect(normalizeOrderStatus('SHIPPED')).toBe('In Transition')
    expect(normalizeOrderStatus('DELIVERED')).toBe('Delivered')
    expect(normalizeOrderStatus('CANCELLED')).toBe('Cancelled')
  })
})

describe('checkout validation', () => {
  it('requires a complete address before checkout', () => {
    expect(() => placeOrderSchema.parse({ payment_method: 'COD' })).toThrow()

    expect(() => placeOrderSchema.parse({
      payment_method: 'COD',
      address: {
        address: '221B Baker Street',
        city: 'London',
        state: 'Greater London',
        pincode: '560001',
        phone: '9876543210'
      }
    })).not.toThrow()
  })
})
