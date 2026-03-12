export function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as {
      data?: { statusMessage?: string }
      message?: string
    }

    return maybeError.data?.statusMessage || maybeError.message || fallback
  }

  return fallback
}
