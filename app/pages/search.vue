<script setup lang="ts">
const route = useRoute()
const page = computed(() => Number(route.query.page || 1))
const query = computed(() => ({
  search: (route.query.search as string) || undefined,
  category: (route.query.category as string) || undefined,
  brand: (route.query.brand as string) || undefined,
  page: page.value,
  limit: 9
}))

const { data, refresh, pending } = await useFetch('/api/medicines', { query })
watch(() => route.fullPath, () => refresh())
const catalog = computed(() => data.value?.data)
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-3xl font-black text-slate-900">Medicine catalog</h1>
      <p class="mt-2 text-slate-500">Search results with server-side filtering and pagination.</p>
      <div class="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
        <span v-if="query.search">Search: <strong>{{ query.search }}</strong></span>
        <span v-if="query.category">Category: <strong>{{ query.category }}</strong></span>
        <span v-if="query.brand">Brand: <strong>{{ query.brand }}</strong></span>
      </div>
    </div>

    <div v-if="pending" class="rounded-2xl bg-white p-6 shadow-sm">Loading catalog…</div>
    <div v-else-if="catalog?.items?.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <MedicineCard v-for="medicine in catalog.items" :key="medicine.id" :medicine="medicine" />
    </div>
    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      No medicines matched your filters.
    </div>

    <div v-if="catalog" class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm">
      <span>Page {{ catalog.page }} of {{ catalog.totalPages }} · {{ catalog.total }} results</span>
      <div class="flex gap-2">
        <NuxtLink
          :to="{ query: { ...route.query, page: Math.max(catalog.page - 1, 1) } }"
          class="rounded-xl border border-slate-200 px-4 py-2 font-semibold hover:border-emerald-600 hover:text-emerald-700"
        >
          Previous
        </NuxtLink>
        <NuxtLink
          :to="{ query: { ...route.query, page: Math.min(catalog.page + 1, catalog.totalPages) } }"
          class="rounded-xl border border-slate-200 px-4 py-2 font-semibold hover:border-emerald-600 hover:text-emerald-700"
        >
          Next
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
