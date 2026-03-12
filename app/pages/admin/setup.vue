<script setup lang="ts">
const auth = useAuthStore()
const form = reactive({
  name: '',
  email: '',
  password: ''
})
const { data } = await useFetch('/api/admin/auth/status')

if (data.value?.data?.has_admin) {
  await navigateTo('/admin/login')
}

async function setupAdmin() {
  await auth.setupAdmin(form)
  await navigateTo('/admin/dashboard')
}
</script>

<template>
  <div class="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">First admin setup</p>
    <h1 class="mt-3 text-3xl font-black text-slate-900">Create the administrator account</h1>
    <p class="mt-2 text-slate-500">This setup page is only available until the first admin account is created.</p>
    <div class="mt-8 space-y-4">
      <input v-model="form.name" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Admin name" >
      <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Admin email" >
      <input v-model="form.password" type="password" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Password" >
      <button :disabled="auth.pending" class="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300" @click="setupAdmin">
        Create admin account
      </button>
      <p v-if="auth.error" class="text-sm text-rose-600">{{ auth.error }}</p>
    </div>
  </div>
</template>
