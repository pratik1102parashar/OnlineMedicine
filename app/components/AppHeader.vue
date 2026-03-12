<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const hideNavigation = computed(() => ['/login', '/auth', '/admin/login', '/admin/setup'].includes(route.path))
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

await auth.bootstrap()

async function logout() {
  await auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="text-2xl font-black tracking-tight text-emerald-700">OnlineMedicine</NuxtLink>
      </div>

      <nav v-if="!hideNavigation && auth.isAuthenticated" class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
        <span class="text-slate-900">Hi {{ auth.displayName }}</span>
        <NuxtLink v-if="isAdminRoute" class="rounded-xl border border-slate-200 px-4 py-2 hover:border-emerald-600 hover:text-emerald-700" to="/admin/dashboard">Dashboard</NuxtLink>
        <NuxtLink v-if="isAdminRoute" class="rounded-xl border border-slate-200 px-4 py-2 hover:border-emerald-600 hover:text-emerald-700" to="/admin/orders">Orders</NuxtLink>
        <NuxtLink v-if="isAdminRoute" class="rounded-xl border border-slate-200 px-4 py-2 hover:border-emerald-600 hover:text-emerald-700" to="/admin/users">Users</NuxtLink>
        <NuxtLink
          v-else
          class="rounded-xl border border-slate-200 px-4 py-2 hover:border-emerald-600 hover:text-emerald-700"
          to="/orders"
        >
          Orders
        </NuxtLink>
        <button class="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-700" @click="logout">
          Logout
        </button>
      </nav>
    </div>
  </header>
</template>
