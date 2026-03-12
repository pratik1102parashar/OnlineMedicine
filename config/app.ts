export const STORAGE_FILES = {
  users: 'users.json',
  medicines: 'medicines.json',
  carts: 'carts.json',
  orders: 'orders.json',
  coupons: 'coupons.json',
  inventory: 'inventory.json',
  otp: 'otp.json'
} as const

export const ORDER_STATUSES = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const
export const PAYMENT_METHODS = ['COD'] as const
export const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED'] as const
export const USER_ROLES = ['admin', 'customer'] as const
export const LOW_STOCK_THRESHOLD = 10
