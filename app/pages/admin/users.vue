<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
const { data } = await useFetch('/api/admin/users')
const users = computed(() => data.value?.data || [])
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-3xl font-black text-slate-900">Customer directory</h1>
      <p class="mt-2 text-slate-500">View customer profiles, contact details, and saved delivery addresses.</p>
    </div>

    <article v-for="user in users" :key="user.id" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">{{ user.name }}</h2>
          <p class="text-sm text-slate-500">{{ user.phone || 'No mobile on file' }}<span v-if="user.email"> · {{ user.email }}</span></p>
        </div>
        <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          {{ user.profile_completed ? 'Profile complete' : 'Profile pending' }}
        </span>
      </div>
      <div class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <template v-if="user.address">
          {{ user.address.address }}, {{ user.address.city }}, {{ user.address.state }} - {{ user.address.pincode }}
        </template>
        <template v-else>
          No saved address yet.
        </template>
      </div>
    </article>

    <div v-if="!users.length" class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
      No customers have signed in yet.
    </div>
  </div>
</template>
