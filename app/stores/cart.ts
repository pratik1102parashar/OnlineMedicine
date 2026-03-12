import type { CartPricing } from '../../types/entities'

interface CartResponse {
  cart: { user_id: string; items: Array<{ medicine_id: string; quantity: number }>; coupon_code: string | null }
  pricing: CartPricing
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null as CartResponse['cart'] | null,
    pricing: null as CartPricing | null,
    pending: false,
    error: ''
  }),
  getters: {
    itemCount: (state) => state.pricing?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  },
  actions: {
    async fetchCart() {
      this.pending = true
      try {
        const response = await $fetch<{ data: CartResponse }>('/api/cart', {
          headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
        })
        this.cart = response.data.cart
        this.pricing = response.data.pricing
      } catch (error: unknown) {
        this.error = getApiErrorMessage(error, 'Unable to load cart')
        throw error
      } finally {
        this.pending = false
      }
    },
    async addItem(medicineId: string, quantity = 1) {
      const response = await $fetch<{ data: CartResponse }>('/api/cart/items', {
        method: 'POST',
        body: { medicine_id: medicineId, quantity }
      })
      this.cart = response.data.cart
      this.pricing = response.data.pricing
    },
    async updateItem(medicineId: string, quantity: number) {
      const response = await $fetch<{ data: CartResponse }>(`/api/cart/items/${medicineId}`, {
        method: 'PATCH',
        body: { quantity }
      })
      this.cart = response.data.cart
      this.pricing = response.data.pricing
    },
    async removeItem(medicineId: string) {
      const response = await $fetch<{ data: CartResponse }>(`/api/cart/items/${medicineId}`, {
        method: 'DELETE'
      })
      this.cart = response.data.cart
      this.pricing = response.data.pricing
    },
    async applyCoupon(code: string) {
      const response = await $fetch<{ data: CartResponse }>('/api/cart/apply-coupon', {
        method: 'POST',
        body: { code }
      })
      this.cart = response.data.cart
      this.pricing = response.data.pricing
    },
    async checkout(address: { address: string; city: string; state: string; pincode: string; phone: string }) {
      const response = await $fetch('/api/orders', {
        method: 'POST',
        body: { payment_method: 'COD', address }
      })
      await this.fetchCart()
      return response
    }
  }
})
