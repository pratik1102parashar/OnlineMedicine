import { z } from 'zod'

export const requestOtpSchema = z.object({
  phone: z.string().min(10)
})

export const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  code: z.string().length(6)
})
