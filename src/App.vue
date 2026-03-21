<script setup lang="ts">
import { ref } from "vue";
import AuthModal from "@/components/Auth.vue";
import { Toaster } from "./components/ui/sonner";
import 'vue-sonner/style.css'
import { useUIStore } from "./stores/ui";
import { CircleUser, CoinsIcon, Gamepad2Icon, HomeIcon, Wallet, WalletIcon, XIcon } from "lucide-vue-next";
import { useAuthStore } from "./stores/auth";
import { useWallet } from "./stores/wallet";
import { formatPrice } from "./utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import Button from "./components/ui/button/Button.vue";
import LanguageBtn from "./components/languageBtn.vue";
import { useI18n } from "vue-i18n";
const authStore = useAuthStore();
const mobileOpen = ref(false);
const uiStore = useUIStore();
const wallet = useWallet();
const {t} = useI18n()
const goToLoginHandler = () => {
  uiStore.openAuthModal();
};
</script>

<template>
  <!-- APP SHELL -->
  <main class="min-h-screen w-full overflow-y-auto relative bg-gray-950 text-gray-100 overflow-x-hidden">
    <!-- NAVBAR (FULL WIDTH) -->
    <nav class="sticky top-0 right-0 left-0 z-50 w-full border-b border-gray-900 bg-gray-900">
      <div class="mx-auto flex max-w-7xl items-center justify-between p-4 h-15">
        <!-- LOGO -->
        <RouterLink to="/"
          class="text-lg flex items-center gap-1 font-extrabold tracking-wide transition hover:text-sky-300 lg:text-2xl">
          <p class=" text-sky-500 font-extrabold text-4xl">999</p>
          <di>
            <p class="text-gray-400 font-mono text-sm">ONLINE</p>
            <p class="text-gray-100 font-bold text-sm">CASINO</p>
          </di>

        </RouterLink>

        <!-- DESKTOP MENU -->
        <div class="hidden items-center gap-6 lg:flex">
          <RouterLink class="nav-link" to="/">Home</RouterLink>
          <RouterLink class="nav-link" to="/games">Games</RouterLink>
          <RouterLink class="nav-link" to="/deposit">Deposit</RouterLink>
          <RouterLink class="nav-link" to="/withdrawal">Withdraw</RouterLink>
        </div>

        <!-- MOBILE BUTTON -->
        <div class="flex items-center gap-2 justify-end">
          <RouterLink to="/deposit" class="h-10 px-2 bg-gray-800 rounded-sm flex items-center gap-2"
            v-show="authStore.isLoggedIn">
            <Wallet class="text-sm" />
            <p class="font-bold text-md text-gray-50">
              {{ formatPrice(wallet.balance || 0) || "0.00" }}
            </p>
          </RouterLink>
          <RouterLink to="/profile" v-if="authStore.isLoggedIn" class="rounded-full" @click="mobileOpen = false">
            <CircleUser />
          </RouterLink>
          <button @click="goToLoginHandler" v-else class="rounded-sm px-4 py-2 font-medium bg-sky-600 text-gray-50">
            {{t('login')}}
          </button>
          <button @click="mobileOpen = !mobileOpen" class="rounded-lg hover:bg-gray-800 lg:hidden">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <!--MOBILE MENU -->
      <Drawer v-model:open="mobileOpen" direction="top" class="lg:hidden">
        <DrawerContent class="fixed inset-0 top-0 h-screen bg-gray-900 border-none p-0 animate-slide-down">
          <!-- HEADER -->
          <DrawerHeader class="flex flex-row items-center justify-between p-4 border-b border-gray-800">
            <DrawerTitle class="text-lg font-bold text-white">
              <RouterLink to="/"
                @click="mobileOpen=false"
                class="text-lg flex items-center gap-1 font-extrabold tracking-wide transition hover:text-sky-300 lg:text-2xl">
                <p class=" text-sky-500 font-extrabold text-4xl">999</p>
                <di>
                  <p class="text-gray-400 font-mono text-sm">ONLINE</p>
                  <p class="text-gray-100 font-bold text-sm">CASINO</p>
                </di>
              </RouterLink>
            </DrawerTitle>
            <DrawerClose>
              <button class="text-gray-400 hover:text-white text-xl">
                <XIcon />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div class="flex flex-col gap-2 p-4 text-lg">
            <div class="py-2">
              <RouterLink v-if="authStore.isLoggedIn" to="/profile" class="mobile-link flex items-center gap-3"
                @click="mobileOpen = false">
                <CircleUser />
                Profile
              </RouterLink>
              <div v-else class=" flex flex-col items-center w-full gap-2">
                <Button @click="goToLoginHandler(); mobileOpen = false"
                  class="text-center flex items-center justify-center px-8 text-md py-2 bg-sky-400 text-gray-950">
                  {{ t('login') }}
                </Button>
                <p class="text-sm text-gray-400">Login or register to get 100% bonus</p>

              </div>
            </div>
            <div class="border-t border-gray-800 my-2"></div>
            <RouterLink to="/" class=" flex items-center gap-3 text-gray-100 py-2 hover:bg-gray-800"
              @click="mobileOpen = false">
              <HomeIcon />
              {{ t('home') }}
            </RouterLink>

            <RouterLink to="/games" class="mobile-link flex items-center gap-3 py-2" @click="mobileOpen = false">
              <Gamepad2Icon />
              {{ t('games') }}
            </RouterLink>

            <RouterLink to="/deposit" class="mobile-link flex items-center gap-3 py-2" @click="mobileOpen = false">
              <CoinsIcon />
              {{ t('deposit') }}
            </RouterLink>

            <RouterLink to="/withdrawal" class="mobile-link flex items-center gap-3 py-2" @click="mobileOpen = false">
              <WalletIcon />
              {{t('withdraw')}}
            </RouterLink>
          </div>
          <DrawerFooter>
            <LanguageBtn/>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </nav>
    <!-- PAGE CONTENT (CENTERED) -->
    <section class="w-full relative flex flex-col items-center">
      <Toaster />
      <RouterView />
      <AuthModal />
    </section>
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
