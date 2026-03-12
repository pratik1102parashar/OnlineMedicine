import { adminAuthService } from '../../../services/admin-auth.service'
import { withErrorHandling } from '../../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => ({
  data: { has_admin: await adminAuthService.hasAdmin() }
})))
