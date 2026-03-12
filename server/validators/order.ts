import { z } from 'zod'
import { ORDER_STATUSES } from '../../config/app'

export const placeOrderSchema = z.object({
  payment_method: z.literal('COD'),
  address: z.object({
    address: z.string().trim().min(5, 'Full address is required'),
    city: z.string().trim().min(2, 'City is required'),
    state: z.string().trim().min(2, 'State is required'),
    pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    phone: z.string().trim().min(10, 'Phone number is required')
  })
})

export const updateOrderStatusSchema = z.object({
  order_status: z.enum(ORDER_STATUSES)
})
