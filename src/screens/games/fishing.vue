<script setup lang="ts">
const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
import { getGamesByProviderAPI } from "@/services/gameAPI";
import { fish } from "@/utils/assets";
import type { gameType } from "@/utils/types";
import { Flame, Percent, Trophy } from "lucide-vue-next";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import GameOptions from "@/components/layout/gameOptions.vue";
const GameViews = defineAsyncComponent(
  () => import("@/components/gameViews.vue"),
);
const { t, locale } = useI18n();
const loading = ref(false);
const games = ref<gameType[] | null>(null);
const limit = 18;
const offset = ref(0);
const hasMore = ref(true);
const isLoadingMore = ref(false);
const sortBy = ref("rank");
const topOnly = ref(false);
// const authStore = useAuthStore()
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
      newGameType: 203,
      limit: limit,
      offset: offset.value,
      lang: lang,
      sortBy: sortBy.value,
      top: topOnly.value,
    });
    const data = res.data;
    if (reset) {
      games.value = data;
    } else {
      games.value = [...(games.value || []), ...data];
    }
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
          <img :src="fish" class="w-18 h-18" />
        </div>
        <div class="flex flex-col gap-4 justify-between flex-1">
          <h1 class="text-white font-bold text-xl">
            {{ t("game_title_fish") }}
          </h1>
          <p class="text-gray-400 font-medium text-md">
            {{ t("game_description_fish") }}
          </p>
        </div>
      </div>
    </div>
    <GameOptions current_page="fishing" />
    <div class="flex justify-between items-center pt-2 px-3">
      <div class="flex gap-1 items-center my-2">
        <img :src="fish" class="w-8 h-8" />
        <p class="text-lg text-white font-bold">{{ t("fishing") }}</p>
      </div>
      <div class="flex gap-4 items-center">
        <button
          @click="
            sortBy = 'rank';
            fetchGames(true);
          "
          :class="sortBy === 'rank' ? 'gold-bg animate-pulse' : 'bg-none'"
          class="p-1 rounded-full border border-white/70"
        >
          <Flame
            class="w-4 h-4"
            :class="sortBy === 'rank' ? 'text-black' : 'text-white'"
          />
        </button>

        <button
          @click="
            sortBy = 'rtp';
            fetchGames(true);
          "
          :class="sortBy === 'rtp' ? 'gold-bg animate-pulse' : 'bg-none'"
          class="p-1 rounded-full border border-white/70"
        >
          <Percent
            class="w-4 h-4"
            :class="sortBy === 'rtp' ? 'text-black' : 'text-white'"
          />
        </button>
        <button
          @click="topOnly = !topOnly"
          :class="topOnly ? 'gold-bg animate-pulse' : 'bg-none'"
          class="p-1 rounded-full border border-white/70"
        >
          <Trophy
            class="w-4 h-4"
            :class="topOnly ? 'text-black' : 'text-white'"
          />
        </button>
      </div>
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
