const PUBLIC_ROUTES = new Set(['/login', '/auth', '/admin/login', '/admin/setup'])

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  await auth.bootstrap()

  const isPublicRoute = PUBLIC_ROUTES.has(to.path)

  if (!auth.isAuthenticated) {
    if (!isPublicRoute) {
      return navigateTo(to.path.startsWith('/admin') ? '/admin/login' : '/login')
    }
    return
  }

  if (auth.needsProfileCompletion && to.path !== '/profile/complete') {
    return navigateTo('/profile/complete')
  }

  if (!auth.needsProfileCompletion && to.path === '/profile/complete') {
    return navigateTo(auth.isAdmin ? '/admin/dashboard' : '/')
  }

  if (to.path === '/login' || to.path === '/auth') {
    return navigateTo(auth.isAdmin ? '/admin/dashboard' : '/')
  }

  if (auth.isAdmin && (to.path === '/admin/login' || to.path === '/admin/setup')) {
    return navigateTo('/admin/dashboard')
  }
})
