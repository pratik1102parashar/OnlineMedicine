import { createError, defineEventHandler, getRequestIP, setHeader } from 'h3'

const requests = new Map<string, { count: number; expiresAt: number }>()

export default defineEventHandler((event) => {
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'X-Frame-Options', 'DENY')
  setHeader(event, 'Referrer-Policy', 'same-origin')
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  if (!event.path.startsWith('/api')) {
    return
  }

  const config = useRuntimeConfig(event)
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'local'
  const key = `${ip}:${event.path}`
  const now = Date.now()
  const current = requests.get(key)

  if (!current || current.expiresAt < now) {
    requests.set(key, { count: 1, expiresAt: now + config.rateLimitWindowMs })
    return
  }

  if (current.count >= config.rateLimitMaxRequests) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  current.count += 1
  requests.set(key, current)
})
