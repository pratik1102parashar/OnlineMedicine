<script setup lang="ts">
import { ORDER_STATUSES } from '../../../config/app'

definePageMeta({ middleware: 'admin' })
const selectedStatus = ref('')
const feedback = ref('')
const statusQuery = computed(() => (selectedStatus.value ? { status: selectedStatus.value } : undefined))
const { data, refresh } = await useFetch('/api/admin/orders', { query: statusQuery })

const orders = computed(() => data.value?.data || [])

function handleStatusChange(orderId: string, event: Event) {
  const target = event.target as HTMLSelectElement
  return updateOrder(orderId, target.value)
}

async function updateOrder(orderId: string, orderStatus: string) {
  await $fetch(`/api/admin/orders/${orderId}`, {
    method: 'PATCH',
    body: { order_status: orderStatus }
  })
  feedback.value = 'Order status updated'
  await refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-3xl font-black text-slate-900">Admin orders dashboard</h1>
          <p class="mt-2 text-slate-500">Review customer names, addresses, ordered items, and update status.</p>
        </div>
        <select v-model="selectedStatus" class="rounded-xl border border-slate-200 px-4 py-3">
          <option value="">All statuses</option>
          <option v-for="status in ORDER_STATUSES" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>
    </div>

    <article v-for="order in orders" :key="order.id" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-2">
          <h2 class="text-lg font-bold text-slate-900">Order #{{ order.id.slice(0, 8) }}</h2>
          <p class="text-sm text-slate-500">{{ order.customer_name }} · {{ order.customer_phone }}</p>
          <p class="text-sm text-slate-500">
            {{ order.shipping_address.address }}, {{ order.shipping_address.city }}, {{ order.shipping_address.state }} - {{ order.shipping_address.pincode }}
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <select :value="order.order_status" class="rounded-xl border border-slate-200 px-4 py-2" @change="handleStatusChange(order.id, $event)">
            <option v-for="status in ORDER_STATUSES" :key="status" :value="status">{{ status }}</option>
          </select>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-center text-xs font-bold text-slate-700">{{ order.order_status }}</span>
        </div>
      </div>
      <div class="mt-5 grid gap-3">
        <div v-for="item in order.items" :key="item.medicine_id" class="rounded-2xl bg-slate-50 p-4 text-sm">
          <p class="font-semibold text-slate-900">{{ item.name }}</p>
          <p class="text-slate-500">Qty {{ item.quantity }} · ₹{{ item.final_price }} each</p>
        </div>
      </div>
    </article>

    <div v-if="!orders.length" class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
      No orders found for the selected filter.
    </div>

    <p v-if="feedback" class="text-sm text-emerald-700">{{ feedback }}</p>
  </div>
</template>
