<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import GameOptions from "@/components/layout/gameOptions.vue";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { slotGameProviders } from "@/consts";
import { slot } from "@/utils/assets";
import type { gameType } from "@/utils/types";
import { useGameStore } from "@/stores/game";
import { refDebounced } from "@vueuse/core";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Percent,
  SearchIcon,
  Trophy,
} from "lucide-vue-next";
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
const GameViews = defineAsyncComponent(() => import("@/components/gameViews.vue"));

const { t } = useI18n();
const gameStore = useGameStore();
const { providers } = storeToRefs(gameStore);

const searchQuery = ref("");
const debouncedSearch = refDebounced(searchQuery, 300);
const selectedProvider = ref<{ name: string; code: string }>({ name: t("all"), code: "" });
const loading = ref(false);
const error = ref<string | null>(null);
const games = ref<gameType[]>([]);
const page = ref(1);
const limit = 18;
const hasMore = ref(true);
const isLoadingMore = ref(false);
const section = ref<"all" | "featured" | "top">("all");
const scrollEl = ref<HTMLElement | null>(null);

const providerTabs = computed(() => {
  const activeCodes = new Set(
    providers.value
      .filter((provider) => provider.status !== "DISABLED")
      .map((provider) => provider.provider_code),
  );
  const tabs = slotGameProviders
    .filter((provider) => activeCodes.size === 0 || activeCodes.has(String(provider.GpId)))
    .map((provider) => ({
      name: provider.name,
      code: String(provider.GpId),
      icon: provider.icon,
    }));

  return [
    { name: t("all"), code: "", icon: slot },
    ...tabs,
  ];
});

const setProvider = (name: string, code: string) => {
  selectedProvider.value = { name, code };
};

const scroll = (direction: "left" | "right") => {
  if (!scrollEl.value) return;
  scrollEl.value.scrollBy({
    left: direction === "left" ? -200 : 200,
    behavior: "smooth",
  });
};

const filters = () => ({
  providerCode: selectedProvider.value.code || undefined,
  gameType: "SLOT",
  page: page.value,
  limit,
  search: debouncedSearch.value,
});

const fetchGames = async (reset = false) => {
  if (reset) {
    page.value = 1;
    hasMore.value = true;
  }

  loading.value = reset;
  isLoadingMore.value = !reset;
  error.value = null;

  try {
    const entry = section.value === "top"
      ? await gameStore.fetchCuratedGames("top", filters())
      : section.value === "featured"
        ? await gameStore.fetchCuratedGames("featured", filters())
        : await gameStore.fetchGames(filters());

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

const loadMore = async () => {
  if (!hasMore.value || isLoadingMore.value) return;
  page.value += 1;
  await fetchGames(false);
};

watch([debouncedSearch, () => selectedProvider.value.code, section], () => {
  void fetchGames(true);
});

onMounted(async () => {
  await gameStore.fetchProviders();
  await fetchGames(true);
});
</script>

<template>
  <main class="bg-gray-900 max-w-6xl w-full flex justify-between flex-col ios-layer-isolate">
    <div class="p-2">
      <div
        class="w-full flex gap-2 h-28 items-center justify-between rounded-2xl bg-gray-800/20 border border-gray-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      >
        <div class="px-4">
          <img :src="slot" class="w-18 h-18" alt="slots" />
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
        <button
          @click="scroll('left')"
          class="absolute rounded-full bg-gray-50/5 left-1 top-1/2 -translate-y-1/2 z-10 hover:bg-gray-700/80 h-9 w-9 flex justify-center items-center shadow-lg transition"
          aria-label="scroll providers left"
        >
          <ChevronLeft class="w-7 h-7 text-gray-400" />
        </button>

        <div
          ref="scrollEl"
          class="flex gap-2 bg-gray-900 items-center w-full overflow-x-auto no-scrollbar scroll-smooth"
        >
          <button
            v-for="option in providerTabs"
            :key="option.code || 'all'"
            @click="setProvider(option.name, option.code)"
            class="shrink-0 flex flex-col peer-last:mr-4 gap-2 justify-center items-center text-sm whitespace-nowrap"
          >
            <Card
              :class="option.code === selectedProvider.code
                ? 'gold-bg animate-pulse border-yellow-400'
                : 'bg-gray-800/20 border-white/10'"
              class="p-1 hover:bg-gray-700 transition rounded-md bg-gray-800/20 border border-white/10"
            >
              <CardContent class="flex items-center justify-center">
                <img :src="option.icon" class="h-10" :alt="option.name" fetchpriority="auto" />
              </CardContent>
            </Card>
          </button>
        </div>

        <button
          @click="scroll('right')"
          class="absolute w-9 h-9 flex justify-center items-center right-1 top-1/2 -translate-y-1/2 z-10 hover:bg-gray-700/70 bg-gray-100/5 rounded-full shadow-lg transition"
          aria-label="scroll providers right"
        >
          <ChevronRight class="w-7 h-7 text-gray-400" />
        </button>
      </div>
      <div class="px-2">
        <InputGroup
          class="border-gray-500/20 text-white bg-gray-800/20 ring-gray-500/20 ring-0 rounded-full h-12"
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
      <div class="flex gap-1 items-center my-2 min-w-0">
        <img :src="slot" class="w-8 h-8" alt="slots" />
        <p class="text-white text-lg font-bold truncate">
          {{ selectedProvider.name || t("slots") }}
        </p>
      </div>
      <div class="flex gap-4 items-center">
        <button
          @click="section = 'all'"
          :class="section === 'all' ? 'gold-bg animate-pulse' : 'bg-none'"
          class="p-1 rounded-full border border-white/70"
          :aria-label="t('all')"
        >
          <Flame class="w-4 h-4" :class="section === 'all' ? 'text-black' : 'text-white'" />
        </button>

        <button
          @click="section = 'featured'"
          :class="section === 'featured' ? 'gold-bg animate-pulse' : 'bg-none'"
          class="p-1 rounded-full border border-white/70"
          :aria-label="t('featured_games')"
        >
          <Percent class="w-4 h-4" :class="section === 'featured' ? 'text-black' : 'text-white'" />
        </button>
        <button
          @click="section = 'top'"
          :class="section === 'top' ? 'gold-bg animate-pulse' : 'bg-none'"
          class="p-1 rounded-full border border-white/70"
          :aria-label="t('top_picks')"
        >
          <Trophy class="w-4 h-4" :class="section === 'top' ? 'text-black' : 'text-white'" />
        </button>
      </div>
    </div>

    <div
      v-if="loading && !games.length"
      class="px-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2"
    >
      <div class="h-40 bg-white/10 animate-pulse rounded-xl" v-for="n in 18" :key="n" />
    </div>

    <div v-else-if="error && !games.length" class="px-4 py-10 text-center">
      <p class="text-gray-300 text-sm">{{ t(error) }}</p>
      <button
        class="mt-3 px-4 py-2 gold-bg text-black font-bold rounded-lg"
        @click="fetchGames(true)"
      >
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
  </main>
  <Footer />
</template>
