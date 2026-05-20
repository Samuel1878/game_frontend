<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { ChevronLeft } from "lucide-vue-next";
import { onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { hideTawk, showTawk } from "./utils";
import { useDownloadBannerStore } from "./stores/downloadBannerStore";

const gameStore = useGameStore();
const authStore = useAuthStore();
const router = useRouter();
const ui = useDownloadBannerStore();

onMounted(() => {
  ui.hideBanner()
  hideTawk();
  if (!gameStore.launchUrl) {
    router.replace("/");
  }
});
onUnmounted(async () => {
  // await authStore.init()
  ui.showBanner()
  showTawk();
});
const goBack = () => {
  authStore.init();
  router.back();
};
const goHome = () => {
  authStore.init();
  router.replace("/");
};
onBeforeRouteLeave(() => {
  const auth = useAuthStore();
  auth.fetchUser();
});
</script>

<template>
  <div class="min-h-dvh bg-black flex flex-col w-full">

    <!-- TOP BAR -->
    <div class="bg-gray-900/50 backdrop-blur pt-[env(safe-area-inset-top)]">
      <div class="h-10 flex justify-between items-center px-4">
        <div @click="goBack">
          <ChevronLeft class="text-gray-100 w-7 h-7" />
        </div>

        <div @click="goHome">
          <img src="/logo.webp" class="h-8" />
        </div>
      </div>
    </div>

    <!-- GAME -->
    <div class="flex-1 min-h-0">
      <iframe
        v-if="gameStore.launchUrl"
        :src="gameStore.launchUrl"
        class="w-full h-full border-0"
      />
    </div>

  </div>
</template>