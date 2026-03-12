import { readBody } from 'h3'
import { authService } from '../../services/auth.service'
import { withErrorHandling } from '../../utils/route'
import { requestOtpSchema } from '../../validators/auth'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const body = requestOtpSchema.parse(await readBody(event))
  const data = await authService.requestOtp(body.phone)
  return { data, message: 'OTP generated and logged locally.' }
}))
