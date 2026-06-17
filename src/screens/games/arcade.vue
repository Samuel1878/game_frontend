<script setup lang="ts">
import GameOptions from "@/components/layout/gameOptions.vue";
import { useGameStore } from "@/stores/game";
import { chess } from "@/utils/assets";
import type { gameType } from "@/utils/types";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
const GameViews = defineAsyncComponent(() => import("@/components/gameViews.vue"));
const { t } = useI18n();
const gameStore = useGameStore();
const loading = ref(false);
const error = ref<string | null>(null);
const games = ref<gameType[]>([]);
const limit = 18;
const page = ref(1);
const hasMore = ref(true);
const isLoadingMore = ref(false);

const fetchGames = async (reset = false) => {
  if (reset) {
    page.value = 1;
    hasMore.value = true;
  }

  loading.value = reset;
  isLoadingMore.value = !reset;
  error.value = null;
  try {
    const entry = await gameStore.fetchGames({
      gameType: "ARCADE",
      page: page.value,
      limit,
    });

    games.value = reset ? entry.items : [...games.value, ...entry.items];
    hasMore.value = Boolean(entry.pagination && page.value < entry.pagination.totalPages);
  } catch (err: any) {
    error.value = err?.response?.data?.message || "game_unavailable";
    if (reset) games.value = [];
  } finally {
    loading.value = false;
    isLoadingMore.value = false;
  }
};

onMounted(() => fetchGames(true));

const loadMore = async () => {
  if (!hasMore.value || isLoadingMore.value) return;
  page.value += 1;
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
          <img :src="chess" class="w-18 h-18" alt="arcade" />
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
    <div class="flex gap-1 items-center my-2 px-3">
      <img :src="chess" class="w-8 h-8" alt="arcade" />
      <p class="text-lg text-white font-bold">{{ t("arcade_games") }}</p>
    </div>

    <div
      v-if="loading && !games.length"
      class="px-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2"
    >
      <div class="h-40 bg-white/10 animate-pulse rounded-xl" v-for="n in 18" :key="n" />
    </div>

    <div v-else-if="error && !games.length" class="px-4 py-10 text-center">
      <p class="text-gray-300 text-sm">{{ t(error) }}</p>
      <button class="mt-3 px-4 py-2 gold-bg text-black font-bold rounded-lg" @click="fetchGames(true)">
        {{ t("retry") }}
      </button>
    </div>

    <div v-else-if="!games.length" class="px-4 py-10 text-center text-gray-400 text-sm">
      {{ t("no_games_found") }}
    </div>

    <GameViews v-else :game-data="games" />

    <div class="flex justify-center my-4">
      <button
        v-if="hasMore"
        @click="loadMore"
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-70"
        :disabled="isLoadingMore"
      >
        <span v-if="!isLoadingMore">{{ t("view_more") }}</span>
        <span v-else>{{ t("loading") }}...</span>
      </button>
    </div>
    <Footer />
  </main>
</template>
