<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { ChevronLeft } from "lucide-vue-next";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { hideTawk, showTawk } from "./utils";

const gameStore = useGameStore();
const authStore = useAuthStore()
const router = useRouter();

// safety: if no URL, go back
onMounted(() => {
   hideTawk();
  if (!gameStore.launchUrl) {
    router.replace("/");
  }
});
onUnmounted(() => {
  showTawk();
});
const goBack = () => {
    authStore.fetchUser();
    router.back()
}
const goHome = () => {
    authStore.fetchUser();
    router.replace('/')
}
</script>

<template>
  <div class="fixed inset-0 bg-black overflow-hidden">

    <!-- HEADER (overlay) -->
    <div
      class="absolute top-0 left-0 right-0 z-50 h-9 flex justify-between items-center px-4 bg-gray-900/50 backdrop-blur pointer-events-none"
    >
      <div class="pointer-events-auto cursor-pointer px-2" @click="goBack">
        <ChevronLeft class="text-gray-100 w-7 h-7" />
      </div>

      <div class="pointer-events-auto cursor-pointer flex justify-center items-center" @click="goHome">
        <img src="/logo.png" class="h-8" />
      </div>
    </div>

    <!-- GAME -->
    <div class="absolute inset-0 pt-9">
      <iframe
        v-if="gameStore.launchUrl"
        :src="gameStore.launchUrl"
        class="w-full h-full border-0"
        allowfullscreen
      />
    </div>

  </div>
</template>