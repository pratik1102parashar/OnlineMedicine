<script setup lang="ts">
const auth = useAuthStore()
await auth.bootstrap()
await navigateTo(auth.isAdmin ? '/admin/dashboard' : '/admin/login')
</script>

<template>
  <div />
</template>
