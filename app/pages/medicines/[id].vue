<script setup lang="ts">
const route = useRoute()
const { data, error } = await useFetch(`/api/medicines/${route.params.id}`)
const medicine = computed(() => data.value?.data)
const cart = useCartStore()
const auth = useAuthStore()
const { formatCurrency } = useCurrency()
const notice = ref('')

async function addToCart() {
  if (!auth.isAuthenticated) {
    await navigateTo('/auth')
    return
  }

  try {
    await cart.addItem(String(route.params.id), 1)
    notice.value = 'Medicine added to cart.'
  } catch (fetchError: unknown) {
    notice.value = getApiErrorMessage(fetchError, 'Unable to add item.')
  }
}
</script>

<template>
  <div v-if="error" class="rounded-2xl bg-white p-8 shadow-sm">Medicine not found.</div>
  <div v-else-if="medicine" class="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
    <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <img :src="medicine.image" :alt="medicine.name" class="h-full max-h-[420px] w-full rounded-2xl border border-slate-100 bg-slate-50 object-cover" />
    </div>
    <div class="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="space-y-2">
        <div class="flex flex-wrap gap-2">
          <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{{ medicine.category }}</span>
          <span v-if="medicine.requires_prescription" class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Prescription required</span>
        </div>
        <h1 class="text-4xl font-black text-slate-900">{{ medicine.name }}</h1>
        <p class="text-lg text-slate-500">by {{ medicine.brand }}</p>
      </div>
      <p class="text-slate-600">{{ medicine.description }}</p>
      <div class="rounded-2xl bg-slate-50 p-6">
        <div class="flex items-baseline gap-3">
          <span class="text-4xl font-black text-slate-900">{{ formatCurrency(medicine.final_price) }}</span>
          <span class="text-lg text-slate-400 line-through">{{ formatCurrency(medicine.price) }}</span>
          <span class="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">{{ medicine.discount_percentage }}% off</span>
        </div>
        <p class="mt-3 text-sm" :class="medicine.stock_quantity > 0 ? 'text-emerald-700' : 'text-rose-600'">
          {{ medicine.stock_quantity > 0 ? `${medicine.stock_quantity} units available` : 'Out of stock' }}
        </p>
      </div>
      <div class="flex gap-3">
        <button :disabled="medicine.stock_quantity < 1" class="rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-900 hover:bg-amber-300 disabled:bg-slate-200" @click="addToCart">
          Add to cart
        </button>
        <NuxtLink to="/cart" class="rounded-xl border border-slate-200 px-6 py-3 font-bold hover:border-emerald-600 hover:text-emerald-700">Go to cart</NuxtLink>
      </div>
      <p v-if="notice" class="text-sm text-emerald-700">{{ notice }}</p>
    </div>
  </div>
</template>
