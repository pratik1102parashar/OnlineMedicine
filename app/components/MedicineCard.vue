<script setup lang="ts">
import type { Medicine } from '../../types/entities'

const props = defineProps<{
  medicine: Medicine
}>()

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const { formatCurrency } = useCurrency()
const feedback = ref('')

async function addToCart() {
  if (!auth.isAuthenticated) {
    await router.push('/auth')
    return
  }

  try {
    await cart.addItem(props.medicine.id, 1)
    feedback.value = 'Added to cart'
    setTimeout(() => {
      feedback.value = ''
    }, 1800)
  } catch (error: unknown) {
    feedback.value = getApiErrorMessage(error, 'Unable to add to cart')
  }
}
</script>

<template>
  <article class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <img :src="medicine.image" :alt="medicine.name" class="h-40 w-full rounded-xl border border-slate-100 bg-slate-50 object-cover" />
    <div class="mt-4 flex flex-1 flex-col gap-2">
      <div class="flex items-center justify-between gap-2">
        <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{{ medicine.category }}</span>
        <span v-if="medicine.requires_prescription" class="rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">Prescription</span>
      </div>
      <h3 class="text-lg font-bold text-slate-900">{{ medicine.name }}</h3>
      <p class="text-sm text-slate-500">{{ medicine.brand }}</p>
      <p class="line-clamp-3 text-sm text-slate-600">{{ medicine.description }}</p>
      <div class="mt-auto space-y-2 pt-4">
        <div class="flex items-baseline gap-2">
          <span class="text-xl font-extrabold text-slate-900">{{ formatCurrency(medicine.final_price) }}</span>
          <span v-if="medicine.discount_percentage" class="text-sm text-slate-400 line-through">{{ formatCurrency(medicine.price) }}</span>
          <span v-if="medicine.discount_percentage" class="text-sm font-semibold text-emerald-700">{{ medicine.discount_percentage }}% off</span>
        </div>
        <p class="text-xs" :class="medicine.stock_quantity > 0 ? 'text-emerald-700' : 'text-rose-600'">
          {{ medicine.stock_quantity > 0 ? `${medicine.stock_quantity} in stock` : 'Out of stock' }}
        </p>
        <div class="flex gap-2">
          <NuxtLink :to="`/medicines/${medicine.id}`" class="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-center font-semibold hover:border-emerald-600 hover:text-emerald-700">View</NuxtLink>
          <button :disabled="medicine.stock_quantity < 1" class="flex-1 rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200" @click="addToCart">
            Add
          </button>
        </div>
        <p v-if="feedback" class="text-xs text-emerald-700">{{ feedback }}</p>
      </div>
    </div>
  </article>
</template>
