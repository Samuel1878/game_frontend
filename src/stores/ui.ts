import router from '@/router'
import { hideTawk, showTawk } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const authModalOpen = ref(false)
  const redirectAfterAuth = ref<string | null>(null);

  const openAuthModal = (redirect?: string) => {
    authModalOpen.value = true
    redirectAfterAuth.value = redirect || null
    hideTawk()
  }

  const closeAuthModal = () => {
    authModalOpen.value = false;
    router.replace("/")
    showTawk();
  }

  return {
    authModalOpen,
    redirectAfterAuth,
    openAuthModal,
    closeAuthModal,
  }
})
