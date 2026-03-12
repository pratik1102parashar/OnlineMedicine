import { clearAuthSession } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  clearAuthSession(event)
  return { ok: true }
}))
