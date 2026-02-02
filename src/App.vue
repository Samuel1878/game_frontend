
<script setup lang="ts">
import { ref } from 'vue'
import AuthModal from '@/components/Auth.vue'
const isLoggedIn = ref(false)
const mobileOpen = ref(false)
</script>

<template>
  <!-- APP SHELL -->
  <main class="min-h-screen w-full bg-gray-950 text-gray-100 overflow-x-hidden">
    
    <!-- NAVBAR (FULL WIDTH) -->
    <nav class="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        
        <!-- LOGO -->
        <RouterLink
          to="/"
          class="text-sm font-extrabold tracking-wide text-yellow-400 transition hover:text-yellow-300 lg:text-2xl"
        >
          🎰 96 Online Casino
        </RouterLink>

        <!-- DESKTOP MENU -->
        <div class="hidden items-center gap-6 lg:flex">
          <RouterLink class="nav-link" to="/">Home</RouterLink>
          <RouterLink class="nav-link" to="/games">Games</RouterLink>
          <RouterLink class="nav-link" to="/deposit">Deposit</RouterLink>
          <RouterLink class="nav-link" to="/withdrawal">Withdraw</RouterLink>

          <RouterLink
            v-if="isLoggedIn"
            to="/profile"
            class="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-gray-900 transition hover:bg-yellow-400"
          >
            Profile
          </RouterLink>

          <RouterLink
            v-else
            to="/auth"
            class="rounded-lg border border-yellow-500 px-4 py-2 font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-gray-900"
          >
            Login
          </RouterLink>
        </div>

        <!-- MOBILE BUTTON -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="rounded-lg p-2 hover:bg-gray-800 lg:hidden"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- MOBILE MENU -->
      <div v-show="mobileOpen" class="border-t border-gray-800 bg-gray-900 lg:hidden">
        <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
          <RouterLink class="mobile-link" to="/">Home</RouterLink>
          <RouterLink class="mobile-link" to="/games">Games</RouterLink>
          <RouterLink class="mobile-link" to="/deposit">Deposit</RouterLink>
          <RouterLink class="mobile-link" to="/withdrawal">Withdraw</RouterLink>
          <RouterLink v-if="isLoggedIn" class="mobile-link text-yellow-400" to="/profile">
            Profile
          </RouterLink>
          <RouterLink v-else class="mobile-link text-yellow-400" to="/auth">
            Login
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- PAGE CONTENT (CENTERED) -->
    <section class="mx-auto max-w-7xl px-4 py-6">
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
