<script setup lang="ts">
import AuthModal from "@/components/Auth.vue";
import { Toaster } from "./components/ui/sonner";
import "vue-sonner/style.css";
import { useUIStore } from "./stores/ui";
import { useAuthStore } from "./stores/auth";
import { useWallet } from "./stores/wallet";
import { formatPrice, logo, wallet_icon } from "./utils";
import LanguageBtn from "./components/languageBtn.vue";
import { useI18n } from "vue-i18n";
import BottomNav from "./components/layout/bottomNav.vue";
import { onMounted, onUnmounted } from "vue";
const authStore = useAuthStore();
const uiStore = useUIStore();
const wallet = useWallet();

const { t } = useI18n();
const goToLoginHandler = () => {
  uiStore.openAuthModal();
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const referral = urlParams.get("rid");

  if (referral) {
    localStorage.setItem("referral_code", referral);
  }
  window.addEventListener("pageshow", handlePageShow);
});

onUnmounted(() => {
  window.removeEventListener("pageshow", handlePageShow);
});

const handlePageShow = (event: PageTransitionEvent) => {
  if (event.persisted) {
    console.log("reload")
    window.location.reload();
  }
};

</script>

<template>
  <main
    class="min-h-screen w-full overflow-y-auto relative bg-gray-950 text-gray-100 overflow-x-hidden"
  >
    <nav
      class="sticky top-0 right-0 left-0 z-30 w-full border-b-2 bg-gray-900 
        bg-linear-to-br from-white/5 via-white/10 to-white/5
        backdrop-blur-2xl border-white/5
        shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between p-4 h-14">
        <RouterLink
          to="/"
          class="flex items-center"
        >
          <!-- <p class=" text-sky-500 font-extrabold text-4xl">999</p> -->
          <img :src="logo" class="h-35"/>
          <!-- <di> -->
          <!-- <p class="text-gray-400 font-mono text-sm">ONLINE</p> -->
          <!-- <p class="text-gray-100 font-extrabold text-lg font-sans">BETX</p> -->
          <!-- </di> -->
        </RouterLink>
        <div class="hidden items-center gap-6 lg:flex">
          <RouterLink class="nav-link" to="/">Home</RouterLink>
          <RouterLink class="nav-link" to="/games">Games</RouterLink>
          <RouterLink class="nav-link" to="/deposit">Deposit</RouterLink>
          <RouterLink class="nav-link" to="/withdraw">Withdraw</RouterLink>
        </div>
        <div class="flex items-center gap-2 justify-end">
          <div
            @click="authStore.fetchUser"
            v-show="authStore.user"
            class="flex items-center gap-2 px-2 h-10 bg-gray-800/40 rounded-md border border-white/20 shadow-inner hover:shadow-lg transition-shadow duration-300"
          >
            <img :src="wallet_icon" class="w-8 h-8"/>
            <p class="font-bold text-md text-yellow-500">
              {{ formatPrice(wallet.balance || 0) || "0.00" }}
            </p>
          </div>

          <button
            @click="goToLoginHandler"
            v-if="!authStore.user"
            class="rounded-sm px-4 py-2 font-medium bg-sky-600 text-gray-50"
          >
            {{ t("login") }}
          </button>
          <LanguageBtn />
        </div>
      </div>
    </nav>

    <section
      class="w-full relative flex flex-col items-center pb-15 bg-gray-900"
    >
    
      <RouterView />
      <AuthModal />
      <BottomNav />
    </section>
    <Toaster position="top-left" richColors />
  </main>
</template>

<style scoped>
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0.5;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slideDown 1s ease-out;
}
</style>

