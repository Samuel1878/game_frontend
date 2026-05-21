<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { useWallet } from "@/stores/wallet";
import { formatPrice } from "@/utils";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import LanguageBtn from "../languageBtn.vue";
const UserTopActions = defineAsyncComponent(()=>import("@/components/userTopActions.vue"))
import { Menu, RefreshCw } from "lucide-vue-next";
import router from "@/router";
import { useSidebar } from "../ui/sidebar";
import { defineAsyncComponent, ref } from "vue";
const route = useRoute();
const wallet = useWallet();
const uiStore = useUIStore();
const authStore = useAuthStore();
const loading = ref(false);
const { t, locale } = useI18n();
const goToLoginHandler = (v: boolean) => {
  uiStore.openAuthModal("/", v);
};
const refresh = async()=> {
  if (loading.value)return;
  loading.value = true;
  await authStore.fetchUser();
  setTimeout(()=>loading.value = false, 800)
}
const {
  isMobile,
  toggleSidebar,
  setOpenMobile,
} = useSidebar();
const openMenu = () => {
  if (isMobile.value) {
    setOpenMobile(true);
  } else {
    toggleSidebar();
  }
};
</script>
<template>
  <nav
    v-if="!route.meta.hideTopNav"
    class="sticky top-0 pt-[env(safe-area-inset-top)] right-0 left-0 z-30 w-full border-b-2 bg-gray-900/10 backdrop-blur-2xl border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between px-2 h-14">
      <div class="flex items-center gap-2 relative">
        <button
          class="md:hidden active:scale-90 transition cursor-pointer"
          @click="openMenu"
          aria-label="open menu"
        >
          <Menu class="w-6 h-6 text-white" />
        </button>
        <div @click="router.push('/')" class="cursor-pointer lg:hidden block">
          <img src="/logo.webp" alt="Logo" fetchpriority="high" class="h-8"  decoding="async"/>
        </div>
      </div>
      <div class="flex items-center gap-2 justify-end">
        <div v-if="authStore.user" class="flex items-center gap-2">
          <div
            @click="refresh"
            v-show="authStore.user"
            class="flex items-center px-2 h-8 gap-2 bg-gray-800/40 rounded-full border border-white/20 shadow-inner hover:shadow-lg transition-shadow duration-300"
          >
            <RefreshCw :class="loading ? 'animate-spin' : ''" class="w-4 h-4 text-yellow-400"/>
            <p class="font-bold text-xs text-white">
              {{ formatPrice(wallet.balance || 0) }}
             <span class="text-yellow-400 text-xs font-bold">Ks</span>
            </p>
          </div>
          <UserTopActions />
        </div>
        <div v-else class="flex gap-2">
          <button
            @click="goToLoginHandler(true)"
            class="rounded-sm h-10 flex justify-center text-xs items-center text-linear-gold font-medium bg-transparent border border-yellow-400 active-button"
            :class="locale === 'mm' ? 'px-2' : 'px-4'"
          >
            {{ t("login") }}
          </button>
          <button
            @click="goToLoginHandler(false)"
            :class="locale === 'mm' ? 'px-2' : 'px-4'"
            class="rounded-sm h-10 relative text-xs flex justify-center items-center text-glow font-medium gold-bg active-button"
          >
            {{ t("register") }}
            <div
              class="gift-scale absolute -top-2.5 -right-2 z-10 text-xl drop-shadow-2xl"
            >
              🎁
            </div>
          </button>
        </div>
        <LanguageBtn />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.gift-scale {
  animation: pulseGift 2s ease-in-out infinite;
}

@keyframes pulseGift {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.12);
  }

  50% {
    transform: scale(1.22);
  }

  75% {
    transform: scale(1.12);
  }

  100% {
    transform: scale(1);
  }
}
</style>
