<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const cart = useCartStore()
const { formatCurrency } = useCurrency()
const placing = ref(false)
const success = ref('')
const addressSaved = ref('')
const address = reactive({
  address: '',
  city: '',
  state: '',
  pincode: '',
  phone: ''
})
await cart.fetchCart()

const { data: addressData, refresh: refreshAddress } = await useFetch('/api/address')

watchEffect(() => {
  if (addressData.value?.data) {
    Object.assign(address, {
      address: addressData.value.data.address,
      city: addressData.value.data.city,
      state: addressData.value.data.state,
      pincode: addressData.value.data.pincode,
      phone: addressData.value.data.phone
    })
  }
})

async function saveAddress() {
  await $fetch('/api/address', {
    method: 'PUT',
    body: address
  })
  addressSaved.value = 'Address saved successfully.'
  await refreshAddress()
}

async function placeOrder() {
  placing.value = true
  try {
    await cart.checkout(address)
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
      <p class="mt-2 text-slate-500">Add a delivery address before placing your cash-on-delivery order.</p>
      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <textarea v-model="address.address" class="min-h-28 rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Full address" />
        <input v-model="address.city" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="City" >
        <input v-model="address.state" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="State" >
        <input v-model="address.pincode" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Pincode" >
        <input v-model="address.phone" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Phone number" >
      </div>
      <button class="mt-4 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700" @click="saveAddress">
        Save address
      </button>
      <p v-if="addressSaved" class="mt-3 text-sm text-emerald-700">{{ addressSaved }}</p>
      <div class="mt-8 rounded-2xl bg-slate-50 p-5">
        <h2 class="text-lg font-bold text-slate-900">Payment method</h2>
        <p class="mt-2 text-sm text-slate-600">Cash on Delivery is active now. Complete your address details to confirm the order.</p>
      </div>
      <button :disabled="placing || !cart.pricing?.items.length" class="mt-8 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300" @click="placeOrder">
        Place COD order
      </button>
      <p v-if="success" class="mt-4 text-sm text-emerald-700">{{ success }}</p>
      <p v-if="cart.error" class="mt-4 text-sm text-rose-600">{{ cart.error }}</p>
    </section>

    <aside v-if="cart.pricing" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
