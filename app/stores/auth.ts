import type { User } from '../../types/entities'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    pending: false,
    initialized: false,
    otpPhone: '',
    error: ''
  }),
  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isAuthenticated: (state) => Boolean(state.user),
    needsProfileCompletion: (state) => Boolean(state.user && state.user.role === 'customer' && !state.user.profile_completed),
    displayName: (state) => state.user?.first_name || state.user?.name || 'Customer'
  },
  actions: {
    async bootstrap() {
      if (this.initialized) {
        return
      }

      try {
        const response = await $fetch<{ data: User }>('/api/auth/me', {
          headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
        })
        this.user = response.data
      } catch {
        this.user = null
      } finally {
        this.initialized = true
      }
    },
    async requestOtp(phone: string) {
      this.pending = true
      this.error = ''
      try {
        await $fetch('/api/auth/request-otp', { method: 'POST', body: { phone } })
        this.otpPhone = phone
      } catch (error: unknown) {
        this.error = getApiErrorMessage(error, 'Failed to request OTP')
        throw error
      } finally {
        this.pending = false
      }
    },
    async verifyOtp(code: string) {
      this.pending = true
      this.error = ''
      try {
        const response = await $fetch<{ data: { user: User } }>('/api/auth/verify-otp', {
          method: 'POST',
          body: { phone: this.otpPhone, code }
        })
        this.user = response.data.user
        this.initialized = true
      } catch (error: unknown) {
        this.error = getApiErrorMessage(error, 'Failed to verify OTP')
        throw error
      } finally {
        this.pending = false
      }
    },
    async completeProfile(payload: { first_name: string; last_name: string; email?: string }) {
      this.pending = true
      this.error = ''
      try {
        const response = await $fetch<{ data: User }>('/api/profile', {
          method: 'PUT',
          body: payload
        })
        this.user = response.data
        this.initialized = true
      } catch (error: unknown) {
        this.error = getApiErrorMessage(error, 'Failed to save profile')
        throw error
      } finally {
        this.pending = false
      }
    },
    async adminLogin(payload: { email: string; password: string }) {
      this.pending = true
      this.error = ''
      try {
        const response = await $fetch<{ data: { user: User } }>('/api/admin/auth/login', {
          method: 'POST',
          body: payload
        })
        this.user = response.data.user
        this.initialized = true
      } catch (error: unknown) {
        this.error = getApiErrorMessage(error, 'Admin login failed')
        throw error
      } finally {
        this.pending = false
      }
    },
    async setupAdmin(payload: { name: string; email: string; password: string }) {
      this.pending = true
      this.error = ''
      try {
        const response = await $fetch<{ data: { user: User } }>('/api/admin/auth/setup', {
          method: 'POST',
          body: payload
        })
        this.user = response.data.user
        this.initialized = true
      } catch (error: unknown) {
        this.error = getApiErrorMessage(error, 'Admin setup failed')
        throw error
      } finally {
        this.pending = false
      }
    },
    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' })
      this.user = null
      this.otpPhone = ''
      this.initialized = true
    }
  }
})
