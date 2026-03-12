import { readBody } from 'h3'
import { authService } from '../../services/auth.service'
import { setAuthSession } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'
import { verifyOtpSchema } from '../../validators/auth'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const body = verifyOtpSchema.parse(await readBody(event))
  const { user, token } = await authService.verifyOtp(body.phone, body.code)
  setAuthSession(event, token)
  return { data: { user }, message: 'Authenticated successfully' }
}))
