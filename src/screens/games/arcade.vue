<script setup lang="ts">
const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
import GameOptions from "@/components/layout/gameOptions.vue";
const GameViews = defineAsyncComponent(
  () => import("@/components/gameViews.vue"),
);
import { getGamesByProviderAPI } from "@/services/gameAPI";
import { chess } from "@/utils/assets";
import type { gameType } from "@/utils/types";
import { defineAsyncComponent, onMounted, ref } from "vue";

import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const loading = ref(false);
const games = ref<gameType[] | null>(null);
const limit = 18;
const offset = ref(0);
const hasMore = ref(true);
const isLoadingMore = ref(false);
const fetchGames = async (reset = false) => {
  if (reset) {
    offset.value = 0;
    hasMore.value = true;
  }

  loading.value = reset;
  isLoadingMore.value = !reset;
  let lang = locale.value === "cn" ? "zh_cn" : "en";
  try {
    const res = await getGamesByProviderAPI({
      providerId: 0,
      newGameType: 202,
      limit: limit,
      offset: offset.value,
      lang: lang,
    });

    const data = res.data;

    if (reset) {
      games.value = data;
    } else {
      games.value = [...(games.value || []), ...data];
    }

    // 🔥 detect end
    if (data.length < limit) {
      hasMore.value = false;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isLoadingMore.value = false;
  }
};
onMounted(() => fetchGames(true));
const loadMore = async () => {
  if (!hasMore.value || isLoadingMore.value) return;

  offset.value += limit;
  await fetchGames(false);
};
</script>
<template>
  <main class="bg-gray-900 max-w-6xl w-full flex justify-between flex-col ios-layer-isolate">
    <div class="p-2">
      <div
               class="w-full flex gap-2 h-28 items-center justify-between rounded-2xl bg-gray-800/20 border border-gray-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      >
        <div class="px-4">
          <img :src="chess" class="w-18 h-18" />
        </div>
        <div class="flex flex-col gap-4 justify-between flex-1">
          <h1 class="text-white font-bold text-xl">
            {{ t("game_title_arcade") }}
          </h1>
          <p class="text-gray-400 font-medium text-md">
            {{ t("game_description_arcade") }}
          </p>
        </div>
      </div>
    </div>
    <GameOptions current_page="arcade_games" />
    <div class="flex gap-1 items-center my-2">
      <img :src="chess" class="w-8 h-8" />
      <p class="text-lg text-white font-bold">{{ t("arcade_games") }}</p>
    </div>
    <div
      class="px-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2"
      v-if="!games?.length"
    >
      <div
        class="h-40 grid-1 bg-white/10 animate-pulse rounded-xl"
        v-for="n in 18"
        :key="n"
      ></div>
    </div>
    <GameViews v-else :game-data="games" />
    <div class="flex justify-center my-4">
      <button
        v-if="hasMore"
        @click="loadMore"
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
      >
        <span v-if="!isLoadingMore">{{ t("view_more") }}</span>
        <span v-else>{{ t("loading") }}...</span>
      </button>
    </div>
    <Footer />
  </main>
</template>
