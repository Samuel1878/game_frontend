import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const authModalOpen = ref(false)
  const redirectAfterAuth = ref<string | null>(null)

  const openAuthModal = (redirect?: string) => {
    authModalOpen.value = true
    redirectAfterAuth.value = redirect || null
  }

  const closeAuthModal = () => {
    authModalOpen.value = false
  }

  return {
    authModalOpen,
    redirectAfterAuth,
    openAuthModal,
    closeAuthModal,
  }
})
