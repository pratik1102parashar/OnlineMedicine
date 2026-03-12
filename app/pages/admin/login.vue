<script setup lang="ts">
const auth = useAuthStore()
const form = reactive({
  email: '',
  password: ''
})
const { data } = await useFetch('/api/admin/auth/status')

watch(
  () => data.value?.data?.has_admin,
  (hasAdmin) => {
    if (hasAdmin === false) {
      return navigateTo('/admin/setup')
    }
  },
  { immediate: true }
)

async function login() {
  await auth.adminLogin(form)
  await navigateTo('/admin/dashboard')
}
</script>

<template>
  <div class="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Admin access</p>
    <h1 class="mt-3 text-3xl font-black text-slate-900">Sign in to the admin dashboard</h1>
    <p class="mt-2 text-slate-500">Use the administrator email and password configured during the initial setup.</p>
    <div class="mt-8 space-y-4">
      <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Admin email" >
      <input v-model="form.password" type="password" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Password" >
      <button :disabled="auth.pending" class="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 disabled:bg-slate-300" @click="login">
        Login
      </button>
      <p v-if="auth.error" class="text-sm text-rose-600">{{ auth.error }}</p>
      <NuxtLink to="/login" class="block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">Customer login</NuxtLink>
    </div>
  </div>
</template>
