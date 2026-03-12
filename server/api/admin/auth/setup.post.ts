import { readBody } from 'h3'
import { adminAuthService } from '../../../services/admin-auth.service'
import { setAuthSession } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'
import { adminSetupSchema } from '../../../validators/auth'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  const body = adminSetupSchema.parse(await readBody(event))
  const { user, token } = await adminAuthService.setupAdmin(body)
  setAuthSession(event, token)
  return { data: { user }, message: 'Admin account created successfully' }
}))
