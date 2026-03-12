<script setup lang="ts">
const auth = useAuthStore()
onMounted(() => {
  auth.bootstrap()
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#059669" />
    <NuxtPage />
  </NuxtLayout>
</template>
