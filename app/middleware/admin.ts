export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  await auth.bootstrap()

  if (!auth.isAuthenticated) {
    return navigateTo('/auth')
  }

  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})
