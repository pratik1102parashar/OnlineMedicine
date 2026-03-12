import { z } from 'zod'

export const requestOtpSchema = z.object({
  phone: z.string().min(10)
})

export const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  code: z.string().length(6)
})

export const completeProfileSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: z.union([z.literal(''), z.string().trim().email()]).optional().transform((value) => value || '')
})

export const adminSetupSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
})
