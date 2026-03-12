import { LOW_STOCK_THRESHOLD } from '../../../../config/app'
import { couponsRepository } from '../../../repositories/json/coupons.repository'
import { medicinesRepository } from '../../../repositories/json/medicines.repository'
import { ordersRepository } from '../../../repositories/json/orders.repository'
import { requireAdmin } from '../../../utils/auth'
import { withErrorHandling } from '../../../utils/route'

export default defineEventHandler(async (event) => withErrorHandling(event, async () => {
  await requireAdmin(event)
  const [medicines, orders, coupons] = await Promise.all([
    medicinesRepository.findAll(),
    ordersRepository.findAll(),
    couponsRepository.findAll()
  ])

  return {
    data: {
      totalMedicines: medicines.length,
      activeMedicines: medicines.filter((medicine) => medicine.is_active).length,
      totalOrders: orders.length,
      totalRevenue: Number(orders.reduce((sum, order) => sum + order.final_amount, 0).toFixed(2)),
      activeCoupons: coupons.filter((coupon) => coupon.is_active).length,
      lowStockMedicines: medicines.filter((medicine) => medicine.stock_quantity <= LOW_STOCK_THRESHOLD),
      orderStats: orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.order_status] = (acc[order.order_status] || 0) + 1
        return acc
      }, {})
    }
  }
}))
