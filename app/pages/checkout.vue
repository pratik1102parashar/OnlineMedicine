<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const cart = useCartStore()
const { formatCurrency } = useCurrency()
const placing = ref(false)
const success = ref('')
await cart.fetchCart()

async function placeOrder() {
  placing.value = true
  try {
    await cart.checkout()
    success.value = 'Order placed successfully with Cash on Delivery.'
    await navigateTo('/orders')
  } catch (error: unknown) {
    cart.error = getApiErrorMessage(error, 'Unable to place order')
  } finally {
    placing.value = false
  }
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[1.2fr,0.9fr]">
    <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 class="text-3xl font-black text-slate-900">Checkout</h1>
      <p class="mt-2 text-slate-500">Local COD checkout with stock validation and inventory locking on order placement.</p>
      <div class="mt-8 rounded-2xl bg-slate-50 p-5">
        <h2 class="text-lg font-bold text-slate-900">Payment method</h2>
        <p class="mt-2 text-sm text-slate-600">Cash on Delivery is active now. The payment layer is abstracted so UPI, cards, wallets, Razorpay, and Stripe can be added later without changing core order logic.</p>
      </div>
      <button :disabled="placing || !cart.pricing?.items.length" class="mt-8 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300" @click="placeOrder">
        Place COD order
      </button>
      <p v-if="success" class="mt-4 text-sm text-emerald-700">{{ success }}</p>
      <p v-if="cart.error" class="mt-4 text-sm text-rose-600">{{ cart.error }}</p>
    </section>

    <aside class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" v-if="cart.pricing">
      <h2 class="text-xl font-black text-slate-900">Payable summary</h2>
      <div class="mt-4 space-y-3 text-sm">
        <div class="flex justify-between"><span>Items</span><span>{{ cart.pricing.items.length }}</span></div>
        <div class="flex justify-between"><span>Subtotal</span><span>{{ formatCurrency(cart.pricing.subtotal) }}</span></div>
        <div class="flex justify-between"><span>Discounts</span><span>-{{ formatCurrency(cart.pricing.medicine_discount + cart.pricing.coupon_discount) }}</span></div>
        <div class="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold"><span>Total</span><span>{{ formatCurrency(cart.pricing.final_amount) }}</span></div>
      </div>
    </aside>
  </div>
</template>
