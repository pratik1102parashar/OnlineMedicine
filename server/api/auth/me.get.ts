import { requireUser } from '../../utils/auth'
import { withErrorHandling } from '../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => ({ data: await requireUser(event) })))
