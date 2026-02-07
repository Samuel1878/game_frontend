<script setup lang="ts">
import { ref } from "vue";
import AuthModal from "@/components/Auth.vue";
import { Toaster } from "./components/ui/sonner";
import { useUIStore } from "./stores/ui";
import { CircleUser } from "lucide-vue-next";
import { useAuthStore } from "./stores/auth";
// const isLoggedIn = ref(false);
const authStore = useAuthStore()
const mobileOpen = ref(false);
const uiStore = useUIStore();
const goToLoginHandler = () => {
  uiStore.openAuthModal();
};
</script>

<template>
  <!-- APP SHELL -->
  <main class="min-h-screen w-full bg-gray-900 text-gray-100 overflow-x-hidden">
    <!-- NAVBAR (FULL WIDTH) -->
    <nav
      class="sticky top-0 right-0 left-0 z-50 w-full border-b border-gray-800 bg-gray-900/90 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"
      >
        <!-- LOGO -->
        <RouterLink
          to="/"
          class="text-lg font-extrabold tracking-wide text-amber-300 transition hover:text-amber-300 lg:text-2xl"
        >
          <p class="text-amber-300 font-extrabold">9.9.9 CASINO</p>
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
          <div class="py-2 px-4">
            <p class="font-bold text-2xl text-gray-50" v-show="authStore.isLoggedIn">
              {{ authStore.user?.balance || "0.00" }}
            </p>
          </div>
          <RouterLink to="/profile" v-if="authStore.isLoggedIn" class="rounded-full">
            <CircleUser />
          </RouterLink>
          <button
            @click="goToLoginHandler"
            v-else
            class="rounded-2xl px-4 py-2 font-semibold bg-amber-300 text-gray-950"
          >
            Login
          </button>
          <button
            @click="mobileOpen = !mobileOpen"
            class="rounded-lg p-2 hover:bg-gray-800 lg:hidden"
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
        class="border-t border-gray-800 bg-gray-900 lg:hidden"
      >
        <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
          <RouterLink
            class="mobile-link"
            to="/"
            @click="mobileOpen = !mobileOpen"
            >Home</RouterLink
          >
          <RouterLink
            class="mobile-link"
            to="/games"
            @click="mobileOpen = !mobileOpen"
            >Games</RouterLink
          >
          <RouterLink
            class="mobile-link"
            to="/deposit"
            @click="mobileOpen = !mobileOpen"
            >Deposit</RouterLink
          >
          <RouterLink
            class="mobile-link"
            to="/withdrawal"
            @click="mobileOpen = !mobileOpen"
            >Withdraw</RouterLink
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
    <section class="w-full relative">
      <Toaster
        class="w-full bg-green-400 opacity-50 text-gray-900 text-center"
      />
      <RouterView />
      <AuthModal />
    </section>
  </main>
</template>

<style scoped>
@reference "tailwindcss";

.nav-link {
  @apply text-gray-300 font-medium transition hover:text-yellow-400;
}

.router-link-active.nav-link {
  @apply text-yellow-400;
}

.mobile-link {
  @apply rounded-lg px-3 py-2 text-gray-300 transition hover:bg-gray-800 hover:text-yellow-400;
}
</style>
