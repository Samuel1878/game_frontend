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
onUnmounted(async() => {
  // await authStore.init()
  showTawk();
});
const goBack = () => {
    authStore.init()
    router.back()
}
const goHome = () => {
    authStore.init()
    router.replace('/')
}
</script>
<template>
  <div class="fixed inset-0 bg-black overflow-hidden">

    <!-- TOP BAR -->
    <div
      class="absolute top-0 left-0 right-0 z-50 h-10
             flex justify-between items-center px-4
             bg-gray-900/50 backdrop-blur
             pt-[env(safe-area-inset-top)]"
    >
      <div class="cursor-pointer px-2" @click="goBack">
        <ChevronLeft class="text-gray-100 w-7 h-7" />
      </div>

      <div class="cursor-pointer flex items-center" @click="goHome">
        <img src="/logo.png" class="h-8" />
      </div>
    </div>

    <!-- GAME -->
    <div class="absolute inset-0 pt-[calc(2.25rem+env(safe-area-inset-top))]">
      <iframe
        v-if="gameStore.launchUrl"
        :src="gameStore.launchUrl"
        class="w-full h-full border-0"
        allowfullscreen
      />
    </div>

  </div>
</template>