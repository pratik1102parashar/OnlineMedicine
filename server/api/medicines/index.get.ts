import { getQuery } from 'h3'
import { medicineService } from '../../services/medicine.service'
import { withErrorHandling } from '../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => ({ data: await medicineService.list(getQuery(event) as Record<string, string | undefined>) })))
