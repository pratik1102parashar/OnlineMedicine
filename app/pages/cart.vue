<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const cart = useCartStore()
const couponCode = ref('SAVE10')
const { formatCurrency } = useCurrency()
await cart.fetchCart()

async function applyCoupon() {
  try {
    await cart.applyCoupon(couponCode.value)
  } catch (error: unknown) {
    cart.error = getApiErrorMessage(error, 'Unable to apply coupon')
  }
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[1.4fr,0.9fr]">
    <section class="space-y-4">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-3xl font-black text-slate-900">Your cart</h1>
        <p class="mt-2 text-slate-500">Review quantities, apply coupons, and prepare for checkout.</p>
      </div>
      <div v-if="cart.pricing?.items.length" class="space-y-4">
        <article v-for="item in cart.pricing.items" :key="item.medicine_id" class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
          <img :src="item.image" :alt="item.name" class="h-24 w-24 rounded-2xl border border-slate-100 bg-slate-50 object-cover" >
          <div class="flex-1">
            <h2 class="text-lg font-bold text-slate-900">{{ item.name }}</h2>
            <p class="text-sm text-slate-500">{{ item.brand }} · {{ item.category }}</p>
            <p class="mt-2 text-sm text-slate-500">{{ formatCurrency(item.final_price) }} each</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="rounded-xl border border-slate-200 px-3 py-2" @click="cart.updateItem(item.medicine_id, Math.max(item.quantity - 1, 1))">-</button>
            <span class="w-10 text-center font-semibold">{{ item.quantity }}</span>
            <button class="rounded-xl border border-slate-200 px-3 py-2" @click="cart.updateItem(item.medicine_id, Math.min(item.quantity + 1, item.max_quantity))">+</button>
          </div>
          <button class="rounded-xl border border-rose-200 px-4 py-2 font-semibold text-rose-600 hover:bg-rose-50" @click="cart.removeItem(item.medicine_id)">Remove</button>
        </article>
      </div>
      <div v-else class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
        Your cart is empty. Start browsing the catalog.
      </div>
    </section>

    <aside class="space-y-4">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-black text-slate-900">Apply coupon</h2>
        <div class="mt-4 flex gap-2">
          <input v-model="couponCode" class="w-full rounded-xl border border-slate-200 px-4 py-3" >
          <button class="rounded-xl bg-slate-900 px-4 py-3 font-bold text-white" @click="applyCoupon">Apply</button>
        </div>
        <p class="mt-3 text-xs text-slate-500">Try SAVE10 or MED100</p>
      </div>
      <div v-if="cart.pricing" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-black text-slate-900">Order summary</h2>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between"><dt>Subtotal</dt><dd>{{ formatCurrency(cart.pricing.subtotal) }}</dd></div>
          <div class="flex justify-between"><dt>Medicine discounts</dt><dd>-{{ formatCurrency(cart.pricing.medicine_discount) }}</dd></div>
          <div class="flex justify-between"><dt>Coupon discount</dt><dd>-{{ formatCurrency(cart.pricing.coupon_discount) }}</dd></div>
          <div class="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold"><dt>Total</dt><dd>{{ formatCurrency(cart.pricing.final_amount) }}</dd></div>
        </dl>
        <NuxtLink to="/checkout" class="mt-6 block rounded-xl bg-amber-400 px-4 py-3 text-center font-bold text-slate-900 hover:bg-amber-300">Proceed to checkout</NuxtLink>
        <p v-if="cart.error" class="mt-3 text-sm text-rose-600">{{ cart.error }}</p>
      </div>
    </aside>
  </div>
</template>
