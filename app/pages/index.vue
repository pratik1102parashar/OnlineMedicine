<script setup lang="ts">
const { data } = await useFetch('/api/medicines', {
  query: { limit: 6 }
})

const catalog = computed(() => data.value?.data)
const featured = computed(() => catalog.value?.items || [])
const categories = computed(() => catalog.value?.categories || [])
</script>

<template>
  <div class="space-y-10">
    <section class="grid gap-6 rounded-3xl bg-slate-900 px-8 py-10 text-white lg:grid-cols-[1.4fr,1fr]">
      <div class="space-y-4">
        <p class="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200">Trusted medicine ordering platform</p>
        <h1 class="text-4xl font-black tracking-tight lg:text-5xl">Order prescription and everyday medicines with confidence.</h1>
        <p class="max-w-2xl text-lg text-slate-300">Browse verified medicines, manage your cart, save delivery details, and place secure cash-on-delivery orders from a clean pharmacy storefront.</p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/search" class="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-900 hover:bg-amber-300">Shop medicines</NuxtLink>
          <NuxtLink to="/orders" class="rounded-xl border border-white/20 px-5 py-3 font-bold hover:border-emerald-300 hover:text-emerald-300">View orders</NuxtLink>
        </div>
      </div>
      <div class="grid gap-4 rounded-3xl bg-white/5 p-6 backdrop-blur">
        <SummaryStat label="Secure login" value="OTP based" accent="text-emerald-300" />
        <SummaryStat label="Orders tracked" value="Real-time status" accent="text-amber-300" />
        <SummaryStat label="Checkout" value="Address required" accent="text-white" />
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-black text-slate-900">Featured medicines</h2>
          <p class="text-slate-500">Curated high-demand health essentials</p>
        </div>
        <NuxtLink to="/search" class="font-semibold text-emerald-700 hover:text-emerald-800">Browse all</NuxtLink>
      </div>
      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <MedicineCard v-for="medicine in featured" :key="medicine.id" :medicine="medicine" />
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-2xl font-black text-slate-900">Popular categories</h2>
          <p class="text-slate-500">Search catalog by categories and brands</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink v-for="category in categories" :key="category" :to="`/search?category=${encodeURIComponent(category)}`" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700">
            {{ category }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
