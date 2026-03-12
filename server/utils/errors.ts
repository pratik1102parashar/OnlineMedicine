export class AppError extends Error {
  statusCode: number
  data?: unknown

  constructor(message: string, statusCode = 400, data?: unknown) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.data = data
  }
}

export function invariant(condition: unknown, message: string, statusCode = 400): asserts condition {
  if (!condition) {
    throw new AppError(message, statusCode)
  }
}
