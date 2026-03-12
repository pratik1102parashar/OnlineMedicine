import { z } from 'zod'

export const medicineSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  discount_percentage: z.coerce.number().min(0).max(90),
  category: z.string().min(2),
  image: z.string().min(2),
  stock_quantity: z.coerce.number().int().min(0),
  requires_prescription: z.boolean(),
  is_active: z.boolean().default(true)
})
