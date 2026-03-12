export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  await auth.bootstrap()

  if (!auth.isAuthenticated) {
    return navigateTo('/admin/login')
  }

  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})
