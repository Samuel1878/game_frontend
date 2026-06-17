<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { ChevronLeft, Home, RefreshCw } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { hideTawk, showTawk } from "./utils";
import { useDownloadBannerStore } from "./stores/downloadBannerStore";

const gameStore = useGameStore();
const router = useRouter();
const ui = useDownloadBannerStore();
const frameKey = ref(0);
const frameLoading = ref(true);
const hasLaunchPayload = computed(() => Boolean(gameStore.launchUrl || gameStore.launchHtml));

onMounted(() => {
  ui.hideBanner();
  hideTawk();
  if (!hasLaunchPayload.value) {
    void router.replace("/");
  }
});

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.replace("/");
};

const refreshFrame = () => {
  frameLoading.value = true;
  frameKey.value += 1;
};

onBeforeRouteLeave(async () => {
  ui.showBanner();
  showTawk();
  await gameStore.refreshAfterGameExit();
});
</script>

<template>
  <div class="fixed inset-0 z-50 bg-gray-950 flex flex-col w-full h-[100dvh] min-h-[100dvh] overflow-hidden select-none overscroll-none">
    <div class="w-full bg-gray-900/95 backdrop-blur-md border-b border-white/5 pt-[env(safe-area-inset-top)] shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div class="h-11 flex justify-between items-center px-3 max-w-lg mx-auto w-full">
        <button
          @click="goBack"
          class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 active:scale-95 transition-transform duration-200 cursor-pointer text-zinc-300 hover:text-white"
          aria-label="Back to lobby"
        >
          <ChevronLeft class="w-6 h-6 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        </button>

        <button
          @click="goHome"
          class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 active:scale-95 transition-transform duration-200 cursor-pointer text-zinc-300 hover:text-white"
          aria-label="Home"
        >
          <Home class="w-5 h-5" />
        </button>

        <button
          @click="refreshFrame"
          class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 active:scale-95 transition-transform duration-200 cursor-pointer text-zinc-300 hover:text-white"
          aria-label="Refresh game"
        >
          <RefreshCw class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="flex-1 w-full min-h-0 bg-black relative pb-[env(safe-area-inset-bottom)]">
      <div
        v-if="frameLoading"
        class="absolute inset-0 z-20 bg-gray-950 flex items-center justify-center"
      >
        <div class="w-8 h-8 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 animate-spin" />
      </div>

      <iframe
        v-if="gameStore.launchUrl"
        :key="`url-${frameKey}`"
        :src="gameStore.launchUrl"
        class="relative w-full h-full border-0 z-10 block bg-black"
        title="Game Play"
        allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-pointer-lock allow-downloads"
        @load="frameLoading = false"
      />

      <iframe
        v-else-if="gameStore.launchHtml"
        :key="`html-${frameKey}`"
        :srcdoc="gameStore.launchHtml"
        class="relative w-full h-full border-0 z-10 block bg-black"
        title="Game Play"
        allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-pointer-lock allow-downloads"
        @load="frameLoading = false"
      />
    </div>
  </div>
</template>
