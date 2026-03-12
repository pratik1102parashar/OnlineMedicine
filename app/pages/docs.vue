<script setup lang="ts">
const { data } = await useFetch('/api/docs/openapi')
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-3xl font-black text-slate-900">OpenAPI / Swagger reference</h1>
      <p class="mt-2 text-slate-500">The JSON below documents the primary authentication, catalog, cart, order, and admin endpoints.</p>
    </div>
    <pre class="overflow-x-auto rounded-3xl bg-slate-950 p-6 text-sm text-emerald-200 shadow-sm">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
