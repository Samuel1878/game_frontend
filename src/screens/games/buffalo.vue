<script setup lang="ts">
const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
import GameOptions from "@/components/layout/gameOptions.vue";
import GameViews from "@/components/gameViews.vue";
import { topBuffaloGames } from "@/consts/games";
import { buffalo } from "@/utils/assets";
import { defineAsyncComponent } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<template>
  <main class="bg-gray-900 max-w-6xl w-full flex justify-between flex-col">
    <div class="p-2">
      <div
        class="w-full flex gap-2 h-28 items-center justify-between rounded-2xl bg-gray-800/10 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      >
        <div class="px-4">
          <img :src="buffalo" class="w-18 h-18" />
        </div>
        <div class="flex flex-col gap-4 justify-between flex-1">
          <h1 class="text-white font-bold text-xl">
            {{ t("game_title_buffalo") }}
          </h1>
          <p class="text-gray-400 font-medium text-md">
            {{ t("game_description_buffalo") }}
          </p>
        </div>
      </div>
    </div>
    <GameOptions current_page="buffalo" />
    <div class="flex gap-1 items-center my-2">
      <img :src="buffalo" class="w-8 h-8" />
      <p class="text-white text-lg font-bold">{{ t("buffalo") }}</p>
    </div>
    <div class="px-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2" v-if="!topBuffaloGames?.length">
      <div class="h-40 grid-1 bg-white/10 animate-pulse rounded-xl" v-for="n in 18" :key="n"></div>
    </div>
    <GameViews v-else :game-data="topBuffaloGames" />
    <Footer />
  </main>
</template>
