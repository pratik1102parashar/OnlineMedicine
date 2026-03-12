<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { data } = await useFetch('/api/orders')
const orders = computed(() => data.value?.data || [])
const { formatCurrency } = useCurrency()
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
      <div class="mt-4 text-right text-lg font-black text-slate-900">Total: {{ formatCurrency(order.final_amount) }}</div>
    </article>
    <div v-if="!orders.length" class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">No orders placed yet.</div>
  </div>
</template>
