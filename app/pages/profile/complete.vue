<script setup lang="ts">
const auth = useAuthStore()
const form = reactive({
  first_name: auth.user?.first_name || '',
  last_name: auth.user?.last_name || '',
  email: auth.user?.email || ''
})

async function submitProfile() {
  await auth.completeProfile(form)
  await navigateTo('/')
}
</script>

<template>
  <div class="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Complete profile</p>
    <h1 class="mt-3 text-3xl font-black text-slate-900">Finish setting up your account</h1>
    <p class="mt-2 text-slate-500">We only need these details once before you can browse and order medicines.</p>

    <div class="mt-8 grid gap-4 md:grid-cols-2">
      <input v-model="form.first_name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="First name" >
      <input v-model="form.last_name" class="rounded-xl border border-slate-200 px-4 py-3" placeholder="Last name" >
      <input v-model="form.email" class="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Email (optional)" >
    </div>

    <button :disabled="auth.pending" class="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300" @click="submitProfile">
      Save profile
    </button>
    <p v-if="auth.error" class="mt-4 text-sm text-rose-600">{{ auth.error }}</p>
  </div>
</template>
