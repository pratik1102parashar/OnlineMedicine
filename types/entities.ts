export type UserRole = 'admin' | 'customer'
export type DiscountType = 'percentage' | 'fixed'
export type PaymentMethod = 'COD'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED'
export type OrderStatus = 'Pending' | 'Processing' | 'In Transition' | 'Delivered' | 'Cancelled'

export interface AddressInput {
  address: string
  city: string
  state: string
  pincode: string
  phone: string
}

export interface Address extends AddressInput {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

export type OrderAddress = AddressInput

export interface User {
  id: string
  name: string
  phone: string
  first_name: string
  last_name: string
  email: string | null
  role: UserRole
  profile_completed: boolean
  created_at: string
  updated_at: string
}

export interface Medicine {
  id: string
  name: string
  brand: string
  description: string
  price: number
  discount_percentage: number
  final_price: number
  category: string
  image: string
  stock_quantity: number
  requires_prescription: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InventoryRecord {
  medicine_id: string
  stock_quantity: number
  is_active: boolean
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  description: string
  discount_type: DiscountType
  discount_value: number
  min_cart_value: number
  expires_at: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OTPRecord {
  phone: string
  code: string
  expires_at: string
  attempts: number
  requested_at: string
}

export interface CartItem {
  medicine_id: string
  quantity: number
}

export interface Cart {
  user_id: string
  items: CartItem[]
  coupon_code: string | null
  updated_at: string
}

export interface OrderItem {
  medicine_id: string
  name: string
  quantity: number
  unit_price: number
  discount_percentage: number
  final_price: number
  requires_prescription: boolean
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  shipping_address: OrderAddress
  subtotal: number
  medicine_discount: number
  coupon_discount: number
  final_amount: number
  coupon_code: string | null
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  order_status: OrderStatus
  created_at: string
  updated_at: string
}

export interface CartLineItem extends OrderItem {
  max_quantity: number
  image: string
  brand: string
  category: string
}

export interface CartPricing {
  items: CartLineItem[]
  subtotal: number
  medicine_discount: number
  coupon_discount: number
  final_amount: number
  coupon: Coupon | null
}

export interface AuthTokenPayload {
  sub: string
  phone: string
  role: UserRole
  name: string
}

export interface Admin {
  id: string
  user_id: string
  name: string
  email: string
  password_hash: string
  created_at: string
  updated_at: string
}
