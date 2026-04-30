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
  <div class="w-full">
    <div class="w-full h-10 flex justify-between z-50 bg-gray-900/20 items-center px-6 fixed top-0 right-0 left-0">
        <div class="px-4 " v-on:click="goBack">
            <ChevronLeft class="text-gray-100 w-8 h-8"/>
        </div>
        <div v-on:click="goHome" class="flex justify-center items-center">
            <img src="/logo.png" class="h-10"/>
        </div>
    </div>
    <!-- <iframe
      v-if="gameStore.launchUrl"
      :src="gameStore.launchUrl"
      class="w-full h-full border-0"
      allowfullscreen
    /> -->
  <div class="fixed inset-0 w-screen h-screen bg-black">
  <iframe
   v-if="gameStore.launchUrl"
      :src="gameStore.launchUrl"
    class="w-full h-full border-0"
    allowfullscreen
  >
</iframe>
</div>
  </div>
</template>