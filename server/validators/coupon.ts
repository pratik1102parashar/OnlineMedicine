import { z } from 'zod'

export const couponAdminSchema = z.object({
  code: z.string().min(3),
  description: z.string().min(3),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.coerce.number().positive(),
  min_cart_value: z.coerce.number().min(0),
  expires_at: z.string().min(10),
  is_active: z.boolean().default(true)
})
