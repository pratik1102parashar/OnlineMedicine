import type { AddressInput, OrderStatus, User } from '../../types/entities'

export function buildDisplayName(firstName: string, lastName: string, fallback = 'Customer') {
  const value = `${firstName} ${lastName}`.trim()
  return value || fallback
}

export function isProfileComplete(user: Pick<User, 'role' | 'first_name' | 'last_name'>) {
  return user.role === 'admin' || Boolean(user.first_name.trim() && user.last_name.trim())
}

export function normalizeOrderStatus(status: string): OrderStatus {
  switch (status) {
    case 'PLACED':
      return 'Pending'
    case 'CONFIRMED':
      return 'Processing'
    case 'SHIPPED':
      return 'In Transition'
    case 'DELIVERED':
      return 'Delivered'
    case 'CANCELLED':
      return 'Cancelled'
    case 'Pending':
    case 'Processing':
    case 'In Transition':
    case 'Delivered':
    case 'Cancelled':
      return status
    default:
      return 'Pending'
  }
}

export function sanitizeAddressInput(address: AddressInput): AddressInput {
  return {
    address: address.address.trim(),
    city: address.city.trim(),
    state: address.state.trim(),
    pincode: address.pincode.trim(),
    phone: address.phone.trim()
  }
}
