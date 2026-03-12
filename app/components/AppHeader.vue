<script setup lang="ts">
const auth = useAuthStore()
const cart = useCartStore()
const route = useRoute()
const search = ref((route.query.search as string) || '')

await auth.bootstrap()
if (auth.isAuthenticated) {
  await cart.fetchCart().catch(() => undefined)
}

watch(
  () => route.query.search,
  (value) => {
    search.value = (value as string) || ''
  }
)

async function logout() {
  await auth.logout()
  cart.$reset()
  await navigateTo('/')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="text-2xl font-black tracking-tight text-emerald-700">OnlineMedicine</NuxtLink>
        <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Amazon-like medicine marketplace</span>
      </div>

      <form action="/search" method="get" class="flex flex-1 gap-2 lg:max-w-2xl">
        <input
          v-model="search"
          name="search"
          type="search"
          placeholder="Search medicines, brands, or categories"
          class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500 transition focus:ring"
        />
        <button class="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700">Search</button>
      </form>

      <nav class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
        <NuxtLink class="hover:text-emerald-700" to="/orders">Orders</NuxtLink>
        <NuxtLink class="hover:text-emerald-700" to="/docs">API Docs</NuxtLink>
        <NuxtLink class="hover:text-emerald-700" to="/cart">Cart ({{ cart.itemCount }})</NuxtLink>
        <NuxtLink v-if="auth.isAdmin" class="hover:text-emerald-700" to="/admin">Admin</NuxtLink>
        <NuxtLink v-if="!auth.isAuthenticated" class="rounded-xl border border-slate-200 px-4 py-2 hover:border-emerald-600 hover:text-emerald-700" to="/auth">Login</NuxtLink>
        <button v-else class="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-700" @click="logout">
          {{ auth.user?.name }}
        </button>
      </nav>
    </div>
  </header>
</template>
