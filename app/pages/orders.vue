<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const feedback = ref('')
const { data, refresh } = await useFetch('/api/orders')
const orders = computed(() => data.value?.data || [])
const { formatCurrency } = useCurrency()

async function cancelOrder(orderId: string) {
  try {
    await $fetch(`/api/orders/${orderId}/cancel`, { method: 'PATCH' })
    feedback.value = 'Order cancelled successfully.'
    await refresh()
  } catch (error: unknown) {
    feedback.value = getApiErrorMessage(error, 'Unable to cancel order')
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-3xl font-black text-slate-900">Order history</h1>
      <p class="mt-2 text-slate-500">Track your order lifecycle from placement to delivery.</p>
    </div>
    <article v-for="order in orders" :key="order.id" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Order #{{ order.id.slice(0, 8) }}</h2>
          <p class="text-sm text-slate-500">{{ new Date(order.created_at).toLocaleString() }}</p>
          <p class="mt-2 text-sm text-slate-500">
            {{ order.shipping_address.address }}, {{ order.shipping_address.city }}, {{ order.shipping_address.state }} - {{ order.shipping_address.pincode }}
          </p>
        </div>
        <div class="flex flex-wrap gap-2 text-sm font-semibold">
          <span class="rounded-full bg-amber-100 px-3 py-1 text-amber-700">{{ order.payment_method }}</span>
          <span class="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{{ order.payment_status }}</span>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{{ order.order_status }}</span>
        </div>
      </div>
      <div class="mt-5 space-y-3">
        <div v-for="item in order.items" :key="item.medicine_id" class="flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
          <div>
            <p class="font-semibold text-slate-900">{{ item.name }}</p>
            <p class="text-slate-500">Qty {{ item.quantity }} · {{ item.discount_percentage }}% discount</p>
          </div>
          <span>{{ formatCurrency(item.final_price * item.quantity) }}</span>
        </div>
      </div>
      <div class="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div v-if="order.order_status === 'Delivered'" class="text-sm font-semibold text-slate-500">No return or replacement policy.</div>
        <button
          v-else-if="order.order_status !== 'Cancelled'"
          class="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
          @click="cancelOrder(order.id)"
        >
          Cancel order
        </button>
        <span v-else class="text-sm font-semibold text-slate-500">Order cancelled.</span>
        <div class="text-right text-lg font-black text-slate-900">Total: {{ formatCurrency(order.final_amount) }}</div>
      </div>
    </article>
    <div v-if="!orders.length" class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">No orders placed yet.</div>
    <p v-if="feedback" class="text-sm text-emerald-700">{{ feedback }}</p>
  </div>
</template>
