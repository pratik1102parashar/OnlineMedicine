import { z } from 'zod'

export const cartItemSchema = z.object({
  medicine_id: z.string().min(1),
  quantity: z.number().int().min(1).max(20)
})

export const couponSchema = z.object({
  code: z.string().min(2)
})
