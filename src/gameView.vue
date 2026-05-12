<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { ChevronLeft } from "lucide-vue-next";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { hideTawk, showTawk } from "./utils";

const gameStore = useGameStore();
const authStore = useAuthStore();
const router = useRouter();

// safety: if no URL, go back
onMounted(() => {
  hideTawk();
  if (!gameStore.launchUrl) {
    router.replace("/");
  }
});
onUnmounted(async () => {
  // await authStore.init()
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
</script>
<!-- <template>
  <div class="fixed inset-0 bg-black overflow-hidden flex flex-col">
    <div
      class="bg-gray-900/50 backdrop-blur pt-[env(safe-area-inset-top)]"
    >
      <div class="h-10 flex justify-between items-center px-4">
        <div class="cursor-pointer px-2" @click="goBack">
          <ChevronLeft class="text-gray-100 w-7 h-7" />
        </div>

        <div class="cursor-pointer flex items-center" @click="goHome">
          <img src="/logo.png" class="h-8" />
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0">
      <iframe
        v-if="gameStore.launchUrl"
        :src="gameStore.launchUrl"
        class="w-full h-full border-0"
        allowfullscreen
      />
    </div>

  </div>
</template> -->
<template>
  <div class="min-h-dvh bg-black flex flex-col w-full">

    <!-- TOP BAR -->
    <div class="bg-gray-900/50 backdrop-blur pt-[env(safe-area-inset-top)]">
      <div class="h-10 flex justify-between items-center px-4">
        <div @click="goBack">
          <ChevronLeft class="text-gray-100 w-7 h-7" />
        </div>

        <div @click="goHome">
          <img src="/logo.png" class="h-8" />
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