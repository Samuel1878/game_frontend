<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth';
import type { Game } from '@/utils/types';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useUIStore } from '@/stores/ui';
import { gameOption, gameProviders, hotGames, RTPGames, topGames, topTableGames } from '@/consts';
import { sboGames } from '@/consts/sboGames';
import { ArrowLeft, ArrowRight, Coins, CrownIcon, GoalIcon, SearchIcon, Users2Icon } from 'lucide-vue-next';
import { pragmaticPlayGames } from '@/consts/pragmaticGames';
import { arcadeGames } from '@/consts/games';
import ScrollViews from '@/components/scrollViews.vue';
import InputGroup from '@/components/ui/input-group/InputGroup.vue';
import InputGroupInput from '@/components/ui/input-group/InputGroupInput.vue';
import InputGroupAddon from '@/components/ui/input-group/InputGroupAddon.vue';
import ProviderOptions from '@/components/providerOptions.vue';
import GameViews from '@/components/gameViews.vue';
import { Card, CardContent } from '@/components/ui/card';
import { refDebounced } from "@vueuse/core";
import { enterGameAPI } from '@/services/gameAPI';
import { africanBuffaloSlots } from '@/consts/afbGames';
import Loading from '@/components/loading.vue';
import { jiliGames } from '@/consts/jiliGames';
import { useI18n } from 'vue-i18n';
import { hot_icon, hot_rtp_icon, star_svg, top_icon } from '@/utils';

const searchQuery = ref("");
const debouncedSearch = refDebounced(searchQuery, 300);
const selectedProvider = ref<{ name: string, GpId: number }>({ name: "", GpId: 0 });
let games = ref<Game[] | null>(sboGames);
const gameType = ref<string>("lobby");
const { t } = useI18n();
const ui = useUIStore();
const loading = ref(false);
const authStore = useAuthStore();
const chooseOption = (value: string) => (gameType.value = value);

const scrollEl = ref<HTMLElement | null>(null);

const scroll = (dir: "left" | "right") => {
  if (!scrollEl.value) return;

  const amount = 200;
  scrollEl.value.scrollBy({
    left: dir === "left" ? -amount : amount,
    behavior: "smooth",
  });
};

const filteredSlotGames = computed(() => {
  const search = debouncedSearch.value.toLowerCase();
  return gameProviders
    .filter(provider =>
      provider.GpId === selectedProvider.value.GpId
    )
    .flatMap(provider =>
      provider.game.filter(game =>
        !search ||
        game.gameInfos[0]?.gameName.toLowerCase().includes(search)
      )
    ).sort((a, b) => a.rank - b.rank);
});

const enterGame = async (game: Game) => {
  loading.value = true
  if (!game) return loading.value = false;

  if (!authStore.isLoggedIn || !authStore.user) {
    loading.value = false

    toast("Please login to enter the game");

    ui.openAuthModal("/");
    return;
  }

  try {
    const data = await enterGameAPI({
      userName: authStore.user.name ?? "",
      gameId: game.gameID,
      gpId: game.gameProviderId,
    });

    if (!data?.url) {
      loading.value = false
      
      toast("Failed to launch game");

      return;
    }

    // useGameStore.setGames(game);

    const launchUrl =
      `${data.url}` +
      `&gpid=${game.gameProviderId}` +
      `&gameid=${game.gameID}` +
      `&lang=en&device=m&betCode=`;

    // External redirect
    window.location.href = launchUrl;
    loading.value = false
  } catch (error) {
    loading.value = false
    console.error(error);
    toast("Something went wrong");
  }
};
const setProvider = (name: string, GpId: number) => {
  selectedProvider.value.name = name;
  selectedProvider.value.GpId = GpId
}

</script>
<template>
  <main class="bg-slate-950 max-w-6xl w-full flex justify-between flex-col">
    <Loading :show="loading" :message="'loading...'" />
    <div v-if="games" class="flex items-center w-full flex-col lg:grid">
      <div class="relative w-full mt-1 pl-2 pr-2 md:pl-10 flex">
        <!-- Left Arrow -->
        <button @click="scroll('left')"
          class="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-transparent hover:bg-slate-700/80 px-2 h-8 rounded-sm shadow-lg transition">
          <ArrowLeft class="w-5 h-5 text-sky-400" />
        </button>
        <!-- Scroll Container -->
        <div ref="scrollEl"
          class="flex gap-2 bg-slate-950 items-center w-full overflow-x-auto no-scrollbar scroll-smooth">
          <button v-for="(option, index) in gameOption" :key="index" @click="chooseOption(option.value)"
            class="shrink-0 flex flex-col peer-last:mr-4 gap-2 justify-center items-center text-sm whitespace-nowrap">
            <Card class="border-0 bg-gray-800 px-2 py-2 hover:bg-gray-700 transition rounded-sm">
              <CardContent class="flex items-center justify-center">
                <span class="`text-xs font-semibold text-slate-200`">
                  {{ t(option.label) }}
                </span>
              </CardContent>
            </Card>
          </button>
        </div>
        <button @click="scroll('right')"
          class="absolute right-1 top-1/2 -translate-y-1/2 z-10 hover:bg-slate-700/70 bg-transparent p-2 rounded-sm shadow-lg transition">
          <ArrowRight class="w-5 h-5 text-sky-400" />
        </button>
      </div>
      <section class="w-full h-full p-2" id="lobby" v-if="gameType === 'lobby'">
        <ScrollViews :game-data="hotGames" :header="t('hot_games')" :icon="hot_icon" :handler="enterGame" />
        <ScrollViews :game-data="topGames" :header="t('top_picks')" :icon="top_icon"
          label-style="from-sky-800 to-sky-300 shadow-sky-200 " label="TOP" :handler="enterGame" />
        <ScrollViews :game-data="RTPGames" :header="t('most_wins')" :icon="hot_rtp_icon"
          label-style="from-yellow-800 to-yellow-300 shadow-yellow-200 " :label="t('RTP')" :handler="enterGame" />

        <ScrollViews :game-data="africanBuffaloSlots" :header="t('best_provider')"
          label-style="from-red-800 to-yellow-300 shadow-yellow-200 " label="BEST" :icon="star_svg"
          :handler="enterGame" />
        <ScrollViews :game-data="jiliGames.sort((a, b) => a.rank - b.rank).slice(0, 14)" header="Best Provider"
          label-style="from-red-800 to-yellow-300 shadow-yellow-200 " label="BEST" :icon="star_svg"
          :handler="enterGame" />
      </section>
      <section v-else-if="gameType === 'slots'" class="w-full h-full p-2">
        <aside class="flex justify-between items-center gap-2">
          <InputGroup class="border-sky-500 ring-sky-500 ring-0">
            <InputGroupInput v-model="searchQuery" placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <ProviderOptions :provider-name="selectedProvider.name" :-gp-id="selectedProvider.GpId"
            :set-value="setProvider" />
        </aside>
        <GameViews header="All Slots" :game-data="filteredSlotGames" :handler="enterGame" />
      </section>
      <section v-else-if="gameType === 'tableGames'" class="w-full h-full p-2">
        <ScrollViews :game-data="topTableGames" :header="t('top_games')" :icon="top_icon" :handler="enterGame" />
        <GameViews header="All Games" :game-data="pragmaticPlayGames" :handler="enterGame" />
      </section>
      <section v-else-if="gameType === 'arcadeGames'" class="w-full h-full p-2">
        <GameViews header="Arcade Games" :game-data="arcadeGames" :handler="enterGame" />
      </section>
    </div>
    <div v-else class="flex items-center flex-col lg:grid">
      <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
        <div id="skeleton" class="w-full" v-for="(_, index) in 25" :key="index">
          <Skeleton class="w-30 sm:35 h-45 rounded-2xl bg-gray-800" />
        </div>
      </div>
    </div>
  </main>
</template>