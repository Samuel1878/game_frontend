<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { ChevronLeft } from "lucide-vue-next";
import { onActivated } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { hideTawk, showTawk } from "./utils";
import { useDownloadBannerStore } from "./stores/downloadBannerStore";

const gameStore = useGameStore();
const authStore = useAuthStore();
const router = useRouter();
const ui = useDownloadBannerStore();
onActivated(() => {
  ui.hideBanner();
  hideTawk();

  if (!gameStore.launchUrl) {
    router.replace("/");
  }
});
// onMounted(() => {
//   ui.hideBanner()
//   hideTawk();
//   if (!gameStore.launchUrl) {
//     router.replace("/");
//   }
// });
const goBack = () => {
  router.back();
};
const goHome = () => {
  router.replace("/");
};
onBeforeRouteLeave(() => {
   ui.showBanner()
  showTawk();
  authStore.fetchUser();
});
</script>
<template>
  <!-- Full Screen Immersive Wrapper with Hardware Acceleration Locking -->
  <div class="fixed inset-0 bg-gray-900 flex flex-col w-full h-full overflow-hidden select-none overscroll-none touch-none">

    <!-- CASINO PREMIUM TOP CONTROL BAR -->
    <div class="w-full bg-gray-900/50 backdrop-blur-md border-b border-white/5 pt-[env(safe-area-inset-top)] z-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div class="h-10 flex justify-between items-center px-4 max-w-lg mx-auto w-full">
        
        <!-- Native-feeling Tactile Back Target -->
        <button 
          @click="goBack"
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 active:scale-95 transition-transform duration-200 cursor-pointer text-zinc-300 hover:text-white"
          aria-label="Back to Lobby"
        >
          <ChevronLeft class="w-6 h-6 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        </button>

        <!-- Brand/Home Portal Navigation Core -->
        <div 
          @click="goHome"
          class="h-8 flex items-center justify-center active:opacity-80 transition-opacity cursor-pointer px-2"
        >
          <img 
            src="/logo.webp" 
            class="h-7 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
            alt="Logo"
          />
        </div>

        <!-- Balanced spacer to maintain symmetrical centering of brand element -->
        <div class="w-9 h-9 pointer-events-none opacity-0" aria-hidden="true" />
      </div>
    </div>

    <!-- IMMERSIVE GAME RUNNER VIEWPORT -->
    <div class="flex-1 w-full h-full min-h-0 bg-gray-900 relative">
      <!-- Premium Dark Slate Loading Base Underneath Iframe to handle network loading transitions smoothly -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-gray-900 to-black z-0 flex items-center justify-center">
        <!-- Minimal subtle pulsate ring animating while background engine completes iframe handshake -->
        <div class="w-8 h-8 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 animate-spin" />
      </div>

      <!-- Main Slot Canvas Engine Window Layer -->
      <iframe
        v-if="gameStore.launchUrl"
        :src="gameStore.launchUrl"
        class="relative w-full h-full border-0 z-10 block"
        title="Game Play"
        allow="autoplay; fullscreen; gamepad"
      />
    </div>

  </div>
</template>