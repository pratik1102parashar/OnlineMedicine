<script setup lang="ts">
import type { Medicine, Order } from '../../../types/entities'

definePageMeta({ middleware: 'admin' })
const { formatCurrency } = useCurrency()
const medicineForm = reactive({
  name: '',
  brand: '',
  description: '',
  price: 0,
  discount_percentage: 0,
  category: '',
  image: '/images/paracetamol.svg',
  stock_quantity: 0,
  requires_prescription: false,
  is_active: true
})
const couponForm = reactive({
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 10,
  min_cart_value: 0,
  expires_at: '2027-01-01T00:00:00.000Z',
  is_active: true
})
const orderStatus = ref('CONFIRMED')
const feedback = ref('')

const [{ data: analyticsData, refresh: refreshAnalytics }, { data: medicinesData, refresh: refreshMedicines }, { data: couponsData, refresh: refreshCoupons }, { data: ordersData, refresh: refreshOrders }] = await Promise.all([
  useFetch('/api/admin/analytics'),
  useFetch('/api/admin/medicines'),
  useFetch('/api/admin/coupons'),
  useFetch('/api/orders')
])

const analytics = computed(() => analyticsData.value?.data)
const medicines = computed(() => medicinesData.value?.data || [])
const coupons = computed(() => couponsData.value?.data || [])
const orders = computed(() => ordersData.value?.data || [])

async function refreshAll() {
  await Promise.all([refreshAnalytics(), refreshMedicines(), refreshCoupons(), refreshOrders()])
}

async function createMedicine() {
  await $fetch('/api/admin/medicines', { method: 'POST', body: medicineForm })
  feedback.value = 'Medicine created'
  Object.assign(medicineForm, { name: '', brand: '', description: '', price: 0, discount_percentage: 0, category: '', image: '/images/paracetamol.svg', stock_quantity: 0, requires_prescription: false, is_active: true })
  await refreshAll()
}

async function toggleMedicine(medicine: Medicine) {
  await $fetch(`/api/admin/medicines/${medicine.id}`, {
    method: 'PUT',
    body: { is_active: !medicine.is_active }
  })
  await refreshAll()
}

async function saveStock(medicine: Medicine) {
  await $fetch(`/api/admin/medicines/${medicine.id}`, {
    method: 'PUT',
    body: {
      stock_quantity: medicine.stock_quantity,
      discount_percentage: medicine.discount_percentage,
      is_active: medicine.stock_quantity > 0 ? medicine.is_active : false
    }
  })
  await refreshAll()
}

async function removeMedicine(medicineId: string) {
  await $fetch(`/api/admin/medicines/${medicineId}`, { method: 'DELETE' })
  await refreshAll()
}

async function createCoupon() {
  await $fetch('/api/admin/coupons', { method: 'POST', body: couponForm })
  feedback.value = 'Coupon created'
  Object.assign(couponForm, { code: '', description: '', discount_type: 'percentage', discount_value: 10, min_cart_value: 0, expires_at: '2027-01-01T00:00:00.000Z', is_active: true })
  await refreshCoupons()
  await refreshAnalytics()
}

async function updateOrder(orderId: Order['id']) {
  await $fetch(`/api/admin/orders/${orderId}`, {
    method: 'PATCH',
    body: { order_status: orderStatus.value }
  })
  feedback.value = 'Order status updated'
  await refreshOrders()
  await refreshAnalytics()
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  medicineForm.image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}
</script>

<template>
  <div class="space-y-8">
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryStat label="Medicines" :value="analytics?.totalMedicines || 0" accent="text-slate-900" />
      <SummaryStat label="Revenue" :value="formatCurrency(analytics?.totalRevenue || 0)" accent="text-emerald-700" />
      <SummaryStat label="Orders" :value="analytics?.totalOrders || 0" accent="text-amber-600" />
      <SummaryStat label="Active coupons" :value="analytics?.activeCoupons || 0" accent="text-rose-600" />
    </section>

    <section class="grid gap-8 xl:grid-cols-[1fr,1fr]">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-black text-slate-900">Add medicine</h1>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <input v-model="medicineForm.name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Medicine name" />
          <input v-model="medicineForm.brand" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Brand" />
          <input v-model="medicineForm.category" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Category" />
          <input v-model.number="medicineForm.price" type="number" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Price" />
          <input v-model.number="medicineForm.discount_percentage" type="number" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Discount %" />
          <input v-model.number="medicineForm.stock_quantity" type="number" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Stock quantity" />
          <input v-model="medicineForm.image" class="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Image URL or upload below" />
          <input type="file" accept="image/*" class="rounded-xl border border-dashed border-slate-300 px-4 py-3 md:col-span-2" @change="onFileChange" />
          <textarea v-model="medicineForm.description" class="min-h-28 rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Description" />
          <label class="flex items-center gap-2 text-sm text-slate-600"><input v-model="medicineForm.requires_prescription" type="checkbox" /> Requires prescription</label>
          <label class="flex items-center gap-2 text-sm text-slate-600"><input v-model="medicineForm.is_active" type="checkbox" /> Active listing</label>
        </div>
        <button class="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white" @click="createMedicine">Create medicine</button>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-2xl font-black text-slate-900">Create coupon</h2>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <input v-model="couponForm.code" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Coupon code" />
          <input v-model="couponForm.description" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Description" />
          <select v-model="couponForm.discount_type" class="rounded-xl border border-slate-200 px-4 py-3">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          <input v-model.number="couponForm.discount_value" type="number" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Discount value" />
          <input v-model.number="couponForm.min_cart_value" type="number" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Minimum cart value" />
          <input v-model="couponForm.expires_at" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="ISO expiry" />
        </div>
        <button class="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white" @click="createCoupon">Create coupon</button>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-slate-900">Inventory management</h2>
        <p class="text-sm text-slate-500">Low stock threshold: {{ analytics?.lowStockMedicines?.length || 0 }} flagged items</p>
      </div>
      <div class="mt-4 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-left text-slate-500">
              <th class="pb-3">Medicine</th>
              <th class="pb-3">Price</th>
              <th class="pb-3">Discount</th>
              <th class="pb-3">Stock</th>
              <th class="pb-3">State</th>
              <th class="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medicine in medicines" :key="medicine.id" class="border-b border-slate-100 align-top">
              <td class="py-4">
                <p class="font-semibold text-slate-900">{{ medicine.name }}</p>
                <p class="text-slate-500">{{ medicine.brand }} · {{ medicine.category }}</p>
              </td>
              <td class="py-4">{{ formatCurrency(medicine.final_price) }}</td>
              <td class="py-4"><input v-model.number="medicine.discount_percentage" type="number" class="w-24 rounded-lg border border-slate-200 px-2 py-1" /></td>
              <td class="py-4"><input v-model.number="medicine.stock_quantity" type="number" class="w-24 rounded-lg border border-slate-200 px-2 py-1" /></td>
              <td class="py-4">
                <span :class="medicine.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'" class="rounded-full px-3 py-1 text-xs font-bold">
                  {{ medicine.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-4">
                <div class="flex flex-wrap gap-2">
                  <button class="rounded-lg border border-slate-200 px-3 py-1 font-semibold" @click="saveStock(medicine)">Save</button>
                  <button class="rounded-lg border border-amber-200 px-3 py-1 font-semibold text-amber-700" @click="toggleMedicine(medicine)">Toggle</button>
                  <button class="rounded-lg border border-rose-200 px-3 py-1 font-semibold text-rose-600" @click="removeMedicine(medicine.id)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="grid gap-8 xl:grid-cols-[0.95fr,1.05fr]">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-2xl font-black text-slate-900">Coupons</h2>
        <div class="mt-4 space-y-3">
          <div v-for="coupon in coupons" :key="coupon.id" class="rounded-2xl bg-slate-50 p-4 text-sm">
            <p class="font-bold text-slate-900">{{ coupon.code }}</p>
            <p class="text-slate-500">{{ coupon.description }}</p>
            <p class="mt-1 text-slate-600">{{ coupon.discount_type }} · {{ coupon.discount_value }} · Min {{ formatCurrency(coupon.min_cart_value) }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-black text-slate-900">Orders</h2>
          <select v-model="orderStatus" class="rounded-xl border border-slate-200 px-4 py-2 text-sm">
            <option>CONFIRMED</option>
            <option>SHIPPED</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>
        </div>
        <div class="mt-4 space-y-3">
          <div v-for="order in orders" :key="order.id" class="rounded-2xl border border-slate-200 p-4">
            <div class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p class="font-bold text-slate-900">#{{ order.id.slice(0, 8) }}</p>
                <p class="text-sm text-slate-500">{{ order.order_status }} · {{ formatCurrency(order.final_amount) }}</p>
              </div>
              <button class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white" @click="updateOrder(order.id)">Update status</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <p v-if="feedback" class="text-sm text-emerald-700">{{ feedback }}</p>
  </div>
</template>
