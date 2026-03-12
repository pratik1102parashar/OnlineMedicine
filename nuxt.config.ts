// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    jwtSecret: process.env.NUXT_JWT_SECRET || 'dev-secret-change-me',
    otpExpiryMinutes: Number(process.env.NUXT_OTP_EXPIRY_MINUTES || 5),
    rateLimitWindowMs: Number(process.env.NUXT_RATE_LIMIT_WINDOW_MS || 60_000),
    rateLimitMaxRequests: Number(process.env.NUXT_RATE_LIMIT_MAX_REQUESTS || 120),
    public: {
      appName: 'OnlineMedicine',
      supportPhone: process.env.NUXT_PUBLIC_SUPPORT_PHONE || '+91 99999 99999'
    }
  },
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true
      }
    }
  }
})
