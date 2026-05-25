<script setup lang="ts">
import Footer from "@/components/footer.vue";
import GameOptions from "@/components/layout/gameOptions.vue";
const GameViews = defineAsyncComponent(()=>import('@/components/gameViews.vue'))
import {InputGroup,InputGroupAddon,InputGroupInput} from "@/components/ui/input-group";
import { getGamesByProviderAPI } from "@/services/gameAPI";
import { casino} from "@/utils/assets";
import type { gameType } from "@/utils/types";
import { refDebounced } from "@vueuse/core";
import { Flame, Percent, SearchIcon, Trophy } from "lucide-vue-next";
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const sortBy = ref("rank");
const topOnly = ref(false);
const { t, locale } = useI18n();
const loading = ref(false);
const games = ref<gameType[] | null>(null);
const limit = 18;
const offset = ref(0);
const hasMore = ref(true);
const isLoadingMore = ref(false);
const searchQuery = ref("");
const debouncedSearch = refDebounced(searchQuery, 300);
const fetchGames = async (reset = false) => {

  if (reset) {
    offset.value = 0;
    hasMore.value = true;
  }
  let lang = locale.value === "cn" ? "zh_cn" : "en";
  loading.value = reset;
  isLoadingMore.value = !reset;

  try {
    const res = await getGamesByProviderAPI({
      providerId: 0,
      newGameType: "204,101,102,103,104,107,108,105",
      limit: limit,
      offset: offset.value,
      lang: lang,
      search: debouncedSearch.value,
      sortBy: sortBy.value,
      top: topOnly.value,
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
const loadMore = async () => {
  if (!hasMore.value || isLoadingMore.value) return;

  offset.value += limit;
  await fetchGames(false);
};
watch(debouncedSearch, () => {
  fetchGames(true); // reset on search
});
onMounted(() => fetchGames(true));

</script>
<template>
  <main class="bg-gray-900 max-w-6xl w-full flex justify-between flex-col">
    <div class="p-2">
      <div
        class="w-full flex gap-2 h-28 items-center justify-between rounded-2xl bg-gray-800/10 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      >
        <div class="px-4">
          <img :src="casino" class="w-18 h-18" />
        </div>
        <div class="flex flex-col gap-4 justify-between flex-1">
          <h1 class="text-white font-bold text-xl">
            {{ t("game_title_casino") }}
          </h1>
          <p class="text-gray-400 font-medium text-md">
            {{ t("game_description_casino") }}
          </p>
        </div>
      </div>
    </div>
    <GameOptions current_page="casino" />
    <div class="p-2">
      <InputGroup
        class="border-gray-500/70 bg-gray-800/80 text-white ring-gray-400/70 ring-0 rounded-full h-12"
      >
        <InputGroupInput
          v-model="searchQuery"
          :placeholder="t('search_game')"
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
    <div class="flex justify-between items-center pt-2 px-3">
      <div class="flex gap-1 items-center my-2">
        <img :src="casino" class="w-8 h-8" />
        <p class="text-lg text-white font-bold">{{ t("casino") }}</p>
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
          @click="
            topOnly = !topOnly;
          "
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
    <div class="px-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2" v-if="!games?.length">
      <div class="h-40 grid-1 bg-white/10 animate-pulse rounded-xl" v-for="n in 18" :key="n"></div>
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
