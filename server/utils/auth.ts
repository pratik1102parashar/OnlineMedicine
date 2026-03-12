import pkg from 'jsonwebtoken'
import type { H3Event } from 'h3'
import { deleteCookie, getCookie, setCookie } from 'h3'
import type { AuthTokenPayload, User } from '../../types/entities'
import { AppError } from './errors'
import { usersRepository } from '../repositories/json/users.repository'

const { sign, verify } = pkg
const COOKIE_NAME = 'om_auth_token'

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export function createToken(user: User, secret: string) {
  return sign({ sub: user.id, phone: user.phone, role: user.role, name: user.name } satisfies AuthTokenPayload, secret, {
    expiresIn: '7d'
  })
}

export function setAuthSession(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearAuthSession(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export function getTokenFromEvent(event: H3Event) {
  return getCookie(event, COOKIE_NAME)
}

export function decodeToken(token: string, secret: string) {
  try {
    return verify(token, secret) as AuthTokenPayload
  } catch {
    throw new AppError('Invalid or expired session', 401)
  }
}

export async function requireUser(event: H3Event) {
  const token = getTokenFromEvent(event)
  const config = useRuntimeConfig(event)

  if (!token) {
    throw new AppError('Authentication required', 401)
  }

  const payload = decodeToken(token, config.jwtSecret)
  const user = await usersRepository.findById(payload.sub)

  if (!user) {
    throw new AppError('User not found', 401)
  }

  return user
}

export async function requireAdmin(event: H3Event) {
  const user = await requireUser(event)

  if (user.role !== 'admin') {
    throw new AppError('Admin access required', 403)
  }

  return user
}
