<script setup lang="ts">
import Footer from "@/components/footer.vue";
import GameViews from "@/components/gameViews.vue";
import GameOptions from "@/components/layout/gameOptions.vue";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import InputGroup from "@/components/ui/input-group/InputGroup.vue";
import InputGroupAddon from "@/components/ui/input-group/InputGroupAddon.vue";
import InputGroupInput from "@/components/ui/input-group/InputGroupInput.vue";
import { slotGameProviders } from "@/consts";
import { getGamesByProviderAPI } from "@/services/gameAPI";
import { useAuthStore } from "@/stores/auth";
import { hot, hot_rtp_icon, slot, top_icon } from "@/utils";
import type { gameType } from "@/utils/types";
import { useReturnRefresh } from "@/utils/useReturn";
import { refDebounced } from "@vueuse/core";
import {
  ChevronLeft,
  ChevronRight,
  SearchIcon,
} from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
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
const authStore = useAuthStore();
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
    console.log(data);
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
const btnClass = (active: boolean) => (active ? "animate-pulse-scale" : "");
useReturnRefresh(async () => {
  await authStore.fetchUser();
});
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
    <GameOptions current_page="slots" />
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
              class="p-1 hover:bg-gray-700 transition rounded-md bg-gray-800/10 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              <CardContent class="flex items-center justify-center">
                <img :src="option?.icon" class="w-20" />
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
          class="border-gray-500/70 text-white bg-gray-800/80 ring-gray-400/70 ring-0 rounded-full h-12"
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
      <div class="flex gap-4">
        <button
          @click="
            sortBy = 'rank';
            fetchGames(true);
          "
          :class="btnClass(sortBy === 'rank')"
        >
          <img :src="hot" />
        </button>

        <button
          @click="
            sortBy = 'rtp';
            fetchGames(true);
          "
          :class="btnClass(sortBy === 'rtp')"
        >
          <img :src="hot_rtp_icon" />
        </button>

        <button
          @click="
            topOnly = !topOnly;
            providerId = 0;
          "
          :class="btnClass(topOnly)"
        >
          <img :src="top_icon" />
        </button>
      </div>
    </div>
    <GameViews v-if="games" :game-data="games"/>
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
