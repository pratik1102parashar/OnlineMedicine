import { readBody } from 'h3'
import { authService } from '../../services/auth.service'
import { requireUser, setAuthSession, createToken } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'
import { completeProfileSchema } from '../../validators/auth'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const currentUser = await requireUser(event)
  const body = completeProfileSchema.parse(await readBody(event))
  const user = await authService.completeProfile(currentUser.id, {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email || null
  })
  const token = createToken(user, useRuntimeConfig(event).jwtSecret)
  setAuthSession(event, token)
  return { data: user, message: 'Profile completed successfully' }
}))
