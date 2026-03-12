import { z } from 'zod'
import { ORDER_STATUSES } from '../../config/app'

export const placeOrderSchema = z.object({
  payment_method: z.literal('COD')
})

export const updateOrderStatusSchema = z.object({
  order_status: z.enum(ORDER_STATUSES)
})
