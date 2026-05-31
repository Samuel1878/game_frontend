
// import { hideTawk, showTawk } from '@/utils'
// import { defineStore } from 'pinia'
// import { ref } from 'vue'

// export const useUIStore = defineStore('ui', () => {
//   const authModalOpen = ref(false)
//   const redirectAfterAuth = ref<string | null>(null);
//   const isLogin = ref<boolean>(true);
//   const openAuthModal = (redirect?: string, openType:boolean = true) => {
//     isLogin.value = openType
//     authModalOpen.value = true
//     redirectAfterAuth.value = redirect || null
//     hideTawk()
//   }
//   const closeAuthModal = () => {
//     authModalOpen.value = false;
//     showTawk();
//   }
//   return {
//     isLogin,
//     authModalOpen,
//     redirectAfterAuth,
//     openAuthModal,
//     closeAuthModal,
//   }
// })
