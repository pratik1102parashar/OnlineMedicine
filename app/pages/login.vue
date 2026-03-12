<script setup lang="ts">
const auth = useAuthStore()
const phone = ref(auth.otpPhone || '')
const code = ref('')
const success = ref('')

async function requestOtp() {
  success.value = ''
  await auth.requestOtp(phone.value)
  success.value = 'OTP sent successfully. Please check your terminal for the code.'
}

async function verifyOtp() {
  await auth.verifyOtp(code.value)
  success.value = 'Logged in successfully.'
  await navigateTo(auth.needsProfileCompletion ? '/profile/complete' : '/')
}
</script>

<template>
  <div class="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
    <div class="grid gap-8 lg:grid-cols-2">
      <div class="space-y-4">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Secure sign in</p>
        <h1 class="text-4xl font-black text-slate-900">Order medicines with quick OTP login.</h1>
        <p class="text-slate-500">
          Enter your mobile number to receive a one-time password. If this is your first login, we will ask for your profile details once and reuse them on future visits.
        </p>
      </div>
      <div class="space-y-4 rounded-2xl border border-slate-200 p-6">
        <label class="block text-sm font-semibold text-slate-700">Mobile number</label>
        <input v-model="phone" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500 focus:ring" placeholder="+91 98765 43210" >
        <button :disabled="auth.pending" class="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800" @click="requestOtp">
          Send OTP
        </button>

        <label class="block text-sm font-semibold text-slate-700">Enter OTP</label>
        <input v-model="code" maxlength="6" class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500 focus:ring" placeholder="6-digit OTP" >
        <button :disabled="auth.pending || !auth.otpPhone" class="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300" @click="verifyOtp">
          Verify & login
        </button>

        <p v-if="success" class="text-sm text-emerald-700">{{ success }}</p>
        <p v-if="auth.error" class="text-sm text-rose-600">{{ auth.error }}</p>
        <NuxtLink to="/admin/login" class="block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">Admin login</NuxtLink>
      </div>
    </div>
  </div>
</template>
