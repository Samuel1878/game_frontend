<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { ChevronLeft, HomeIcon } from "lucide-vue-next";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";

const gameStore = useGameStore();
const authStore = useAuthStore()
const router = useRouter();

// safety: if no URL, go back
onMounted(() => {
  if (!gameStore.launchUrl) {
    router.replace("/");
  }
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
  <div class="w-full h-fit bg-black">
    <div class="w-full h-12 flex justify-between glass-bg items-center px-6">
        <div class="px-4 " v-on:click="goBack">
            <ChevronLeft class="text-gray-100 w-8 h-8"/>
        </div>
        <p class="text-sky-400 font-extrabold text-2xl font-sans">T9BET</p>
        <div v-on:click="goHome" class="flex h-8 px-4 justify-center items-center rounded-lg bg-sky-400">
            <HomeIcon class="text-white font-bold"/>
        </div>
    </div>
    <iframe
      v-if="gameStore.launchUrl"
      :src="gameStore.launchUrl"
      class="w-full h-full border-0"
      allowfullscreen
    />
  </div>
</template>