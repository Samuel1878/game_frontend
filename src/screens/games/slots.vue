<script setup lang="ts">
const Footer = defineAsyncComponent(()=>import("@/components/footer.vue"))
import GameOptions from "@/components/layout/gameOptions.vue";
const GameViews = defineAsyncComponent(()=>import('@/components/gameViews.vue'))
import {Card,CardContent } from "@/components/ui/card";
import {InputGroup,InputGroupAddon,InputGroupInput} from "@/components/ui/input-group";
import { slotGameProviders } from "@/consts";
import { getGamesByProviderAPI } from "@/services/gameAPI";
import { slot } from "@/utils/assets";
import type { gameType } from "@/utils/types";
import { refDebounced } from "@vueuse/core";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Percent,
  SearchIcon,
  Trophy,
} from "lucide-vue-next";
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const searchQuery = ref("");
const selectedProvider = ref<{ name: string; GpId: number }>({
  name: "",
  GpId: 0,
});
const loading = ref(false);
const games = ref<gameType[] | null>(null);
const providerId = ref<number>(0);
const limit = 18;
const offset = ref(0);
const hasMore = ref(true);
const isLoadingMore = ref(false);
const sortBy = ref("rank");
const topOnly = ref(false);
const debouncedSearch = refDebounced(searchQuery, 300);
// const authStore = useAuthStore();
const setProvider = (name: string | any, GpId: number | any) => {
  selectedProvider.value.name = name;
  selectedProvider.value.GpId = GpId;
};
const scrollEl = ref<HTMLElement | null>(null);
const scroll = (direction: "left" | "right") => {
  if (!scrollEl.value) return;
  const scrollAmount = 200;
  scrollEl.value.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};
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
      providerId: providerId.value,
      newGameType: 201,
      limit: limit,
      offset: offset.value,
      lang: lang,
      search: debouncedSearch.value,
      sortBy: sortBy.value,
      top: topOnly.value,
    });
    const data = res.data;
    // console.log(data);
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
watch(
  () => selectedProvider.value.GpId,
  (newVal) => {
    providerId.value = newVal;
    fetchGames(true); // reset
  },
);

</script>
<template>
  <main class="bg-gray-900 max-w-6xl w-full flex justify-between flex-col">
    <div class="p-2">
      <div
        class="w-full flex gap-2 h-28 items-center justify-between rounded-2xl bg-gray-800/10 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      >
        <div class="px-4">
          <img :src="slot" class="w-18 h-18" />
        </div>
        <div class="flex flex-col gap-4 justify-between flex-1">
          <h1 class="text-white font-bold text-xl">
            {{ t("game_title_slot") }}
          </h1>
          <p class="text-gray-400 font-medium text-md">
            {{ t("game_description_slot") }}
          </p>
        </div>
      </div>
    </div>
    
    <GameOptions current_page="slots"/>
    <aside class="space-y-2">
      <div class="relative w-full my-4 pl-2 pr-2 md:pl-10 flex">
        <!-- Left Arrow -->
        <button
          @click="scroll('left')"
          class="absolute rounded-full bg-gray-50/5 left-1 top-1/2 -translate-y-1/2 z-10 hover:bg-slate-700/80 h-9 w-9 flex justify-center items-center shadow-lg transition"
        >
          <ChevronLeft class="w-7 h-7 text-gray-400" />
        </button>

        <!-- Scroll Container -->
        <div
          ref="scrollEl"
          class="flex gap-2 bg-gray-900 items-center w-full overflow-x-auto no-scrollbar scroll-smooth"
        >
          <button
            v-for="(option, index) in slotGameProviders"
            :key="index"
            @click="setProvider(option?.name, option?.GpId)"
            class="shrink-0 flex flex-col peer-last:mr-4 gap-2 justify-center items-center text-sm whitespace-nowrap"
          >
            <Card
              class="p-1 hover:bg-gray-700 transition rounded-md bg-gray-600/50 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              <CardContent class="flex items-center justify-center">
                <img :src="option?.icon" class="h-10" fetchpriority="auto"/>
              </CardContent>
            </Card>
          </button>
        </div>

        <!-- Right Arrow -->
        <button
          @click="scroll('right')"
          class="absolute w-9 h-9 flex justify-center items-center right-1 top-1/2 -translate-y-1/2 z-10 hover:bg-gray-700/70 bg-gray-100/5 rounded-full shadow-lg transition"
        >
          <ChevronRight class="w-7 h-7 text-gray-400" />
        </button>
      </div>
      <div class="px-2">
        <InputGroup
          class="border-gray-500/70 text-white bg-gray-600/50 ring-gray-400/70 ring-0 rounded-full h-12"
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
    </aside>
    <div class="flex justify-between items-center pt-2 px-3">
      <div class="flex gap-1 items-center my-2">
        <img :src="slot" class="w-8 h-8" />
        <p class="text-white text-lg font-bold">{{ t("slots") }}</p>
      </div>
      <div class="flex gap-4 items-center">
        <button
          @click="
            sortBy = 'rank';
            fetchGames(true);
          "
          :class="sortBy === 'rank'?'gold-bg animate-pulse':'bg-none'"
          class="p-1 rounded-full border border-white"
        >
          <!-- <img :src="hot" /> -->
           <Flame class="w-4 h-4" :class="sortBy === 'rank'?'text-black':'text-white'" />
        </button>

        <button
          @click="
            sortBy = 'rtp';
            fetchGames(true);
          "
          :class="sortBy === 'rtp'?'gold-bg animate-pulse':'bg-none'"
          class="p-1 rounded-full border border-white"
        >
          <Percent class="w-4 h-4 " :class="sortBy === 'rtp'?'text-black':'text-white'"/>
        </button>
        <button
          @click="
            topOnly = !topOnly;
            providerId = 0;
          "
          :class="topOnly?'gold-bg animate-pulse':'bg-none'"
          class="p-1 rounded-full border border-white"
        >
          <Trophy class="w-4 h-4 " :class="topOnly?'text-black':'text-white'"/>
        </button>
      </div>
    </div>
    <div class="px-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2" v-if="!games?.length">
      <div class="h-40 grid-1 bg-white/10 animate-pulse rounded-xl" v-for="n in 18" :key="n"></div>
    </div>
    <GameViews v-else :game-data="games"/>
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
  </main>
  <Footer />
</template>

<style scoped>
@supports not (aspect-ratio: 3/4) {
  img {
    height: 150px;
  }
}
</style>
