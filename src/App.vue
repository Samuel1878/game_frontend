<script setup lang="ts">
import { ref, watchEffect } from "vue";
import AuthModal from "@/components/Auth.vue";
import { Toaster } from "./components/ui/sonner";
import { useUIStore } from "./stores/ui";
import { CircleUser, CoinsIcon, Gamepad2Icon, HomeIcon, Wallet, WalletIcon } from "lucide-vue-next";
import { useAuthStore } from "./stores/auth";
import { useWallet } from "./stores/wallet";

// const isLoggedIn = ref(false);
const authStore = useAuthStore();
const wallet = useWallet();
watchEffect(()=>{
wallet.setWallet(authStore.user?.name ?? null)
})

console.log("OPEN_APP")
const mobileOpen = ref(false);
const uiStore = useUIStore();
const goToLoginHandler = () => {
  uiStore.openAuthModal();
};
</script>

<template>
  <!-- APP SHELL -->
  <main class="min-h-screen w-full bg-gray-950 text-gray-100 overflow-x-hidden">
    <!-- NAVBAR (FULL WIDTH) -->
    <nav
      class="sticky top-0 right-0 left-0 z-50 w-full border-b border-gray-900 bg-gray-950 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"
      >
        <!-- LOGO -->
        <RouterLink
          to="/"
          class="text-lg flex items-center gap-2 font-extrabold tracking-wide transition hover:text-sky-300 lg:text-2xl"
        >
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
          <RouterLink to="/profile" class="py-2 px-4 bg-gray-900 rounded-sm flex items-center gap-2"  v-show="authStore.isLoggedIn">
            <Wallet class="text-sm"/>
            <p class="font-bold text-lg text-gray-50">
              {{ wallet?.balance || "0.00" }}
            </p>
          </RouterLink>
          <RouterLink to="/profile" v-if="authStore.isLoggedIn" class="rounded-full">
            <CircleUser />
          </RouterLink>
          <button
            @click="goToLoginHandler"
            v-else
            class="rounded-sm px-4 py-2 font-medium bg-sky-600 text-gray-50"
          >
            Login
          </button>
          <button
            @click="mobileOpen = !mobileOpen"
            class="rounded-lg hover:bg-gray-800 lg:hidden"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- MOBILE MENU -->
      <div
        v-show="mobileOpen"
        class="border-t border-gray-900 bg-gray-950 lg:hidden"
      >
        <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
          <RouterLink
            class="mobile-link flex gap-2 items-center hover:bg-gray-900"
            to="/"
            @click="mobileOpen = !mobileOpen"
            >
            <HomeIcon/>
            <p class="text-md font-bold">Home</p>
            
            </RouterLink
          >
          <RouterLink
            class="mobile-link flex gap-2 items-center hover:bg-gray-900"
            to="/games"
            @click="mobileOpen = !mobileOpen"
            >
               <Gamepad2Icon/>
            <p class="text-md font-bold">Slot Games</p>
            </RouterLink
          >
          <RouterLink
           class="mobile-link flex gap-2 items-center hover:bg-gray-900"
            to="/deposit"
            @click="mobileOpen = !mobileOpen"
            >   <CoinsIcon/>
            <p class="text-md font-bold">Deposit</p></RouterLink
          >
          <RouterLink
            class="mobile-link flex gap-2 items-center hover:bg-gray-900"
            to="/withdrawal"
            @click="mobileOpen = !mobileOpen"
            >   <WalletIcon/>
            <p class="text-md font-bold">Withdraw</p></RouterLink
          >
          <!-- <RouterLink
            v-if="authStore.isLoggedIn"
            class="mobile-link text-yellow-400"
            to="/profile"
          >
            Profile
          </RouterLink> -->
        </div>
      </div>
    </nav>
    <!-- PAGE CONTENT (CENTERED) -->
    <section class="w-full relative flex flex-col items-center">
      <Toaster
        
        class="w-full font-bold text-lg flex items-center justify-center gap-4 text-gray-50 bottom-0 bg-gray-500 text-center z-40 rounded-lg"
      />
      <RouterView />
      <AuthModal />
    </section>
  </main>
</template>

<style scoped>
@reference "tailwindcss";

.nav-link {
  @apply text-gray-300 font-medium transition hover:text-sky-400;
}

.router-link-active.nav-link {
  @apply text-sky-400;
}

.mobile-link {
  @apply rounded-lg px-3 py-2 text-gray-300 transition hover:bg-gray-800 hover:text-sky-400;
}
</style>
