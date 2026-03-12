import type { H3Event } from 'h3'
import { createError } from 'h3'
import { ZodError } from 'zod'
import { AppError } from './errors'

export async function withErrorHandling<T>(event: H3Event, handler: () => Promise<T> | T) {
  try {
    return await handler()
  } catch (error) {
    if (error instanceof AppError) {
      throw createError({ statusCode: error.statusCode, statusMessage: error.message, data: error.data })
    }

    if (error instanceof ZodError) {
      throw createError({ statusCode: 400, statusMessage: error.issues.map((issue) => issue.message).join(', ') })
    }

    const message = error instanceof Error ? error.message : 'Unexpected server error'
    throw createError({ statusCode: 500, statusMessage: message })
  }
}
