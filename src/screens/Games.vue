<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth';
import { gameStore } from '@/stores/game';
import type{ Game } from '@/utils/types';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import {useUIStore} from '@/stores/ui';
import { gameOption, hotGames, RTPGames, topGames, topTableGames } from '@/consts';
import { sboGames } from '@/consts/sboGames';
// import type { CarouselApi } from '@/components/ui/carousel';
// import { watchOnce } from '@vueuse/core';
import { Coins, CrownIcon, SearchIcon, Users2Icon } from 'lucide-vue-next';
import { jiliGames } from '@/consts/jiliGames';
import { pragmaticPlayGames } from '@/consts/pragmaticGames';
import { arcadeGames } from '@/consts/games';
import ScrollViews from '@/components/scrollViews.vue';
import InputGroup from '@/components/ui/input-group/InputGroup.vue';
import InputGroupInput from '@/components/ui/input-group/InputGroupInput.vue';
import InputGroupAddon from '@/components/ui/input-group/InputGroupAddon.vue';
import ProviderOptions from '@/components/providerOptions.vue';
import GameViews from '@/components/gameViews.vue';
import { Card, CardContent } from '@/components/ui/card';
// const totalCount = ref(0);
let games = ref<Game[] | null>(sboGames);
// const current = ref(0);
// const api = ref<CarouselApi>();
const gameType = ref<string>("lobby");

// watchOnce(api, (api) => {
//   if (!api) return;
//   totalCount.value = api.scrollSnapList().length;
//   current.value = api.selectedScrollSnap() + 1;
//   api.on("select", () => {
//     current.value = api.selectedScrollSnap() + 1;
//   });
// });
// const games = ref<Game[] | null>(null);
const ui = useUIStore();
const authStore = useAuthStore();
const useGameStore = gameStore();
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


const enterGame = (game: Game) => {
  if (!game) return;  
  else if (!authStore.isLoggedIn || !authStore.user) {
    toast("Please login to enter the game");
    ui.openAuthModal("/"); 
    return;
  }
  console.log("entering game", game);
  
  useGameStore.setGames(game)
} 
</script>
<template>
    <main class="bg-slate-950 max-w-6xl w-full flex justify-between flex-col">
        <div v-if="games" class="flex items-center w-full flex-col lg:grid">
        <div class="relative w-full mt-1 pl-2 pr-2 md:pl-10 flex">
          <!-- Left Arrow -->
          <button
            @click="scroll('left')"
            class="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-transparent hover:bg-slate-700/80 px-2 h-8 rounded-sm shadow-lg transition"
          >
            <ArrowLeft class="w-5 h-5 text-sky-400" />
          </button>

          <!-- Scroll Container -->
          <div
            ref="scrollEl"
            class="flex gap-2 bg-slate-950 items-center w-full overflow-x-auto no-scrollbar scroll-smooth"
          >
            <button
              v-for="(option, index) in gameOption"
              :key="index"
              @click="chooseOption(option.value)"
              class="shrink-0 flex flex-col peer-last:mr-4 gap-2 justify-center items-center text-sm whitespace-nowrap"
            >
              <Card
                class="border-0 bg-gray-800 px-2 py-2 hover:bg-gray-700 transition rounded-sm"
              >
                <CardContent class="flex items-center justify-center">
                  <span class="`text-xs font-semibold text-slate-200`">
                    {{ option.label }}
                  </span>
                </CardContent>
              </Card>
            </button>
          </div>

          <!-- Right Arrow -->
          <button
            @click="scroll('right')"
            class="absolute right-1 top-1/2 -translate-y-1/2 z-10 hover:bg-slate-700/70 bg-transparent p-2 rounded-sm shadow-lg transition"
          >
            <ArrowRight class="w-5 h-5 text-sky-400" />
          </button>
        </div>

        <section
          class="w-full h-full p-2"
          id="lobby"
          v-if="gameType === 'lobby'"
        >
          <ScrollViews
            :game-data="hotGames"
            header="Hot Games"
            :icon="CrownIcon"
            :handler="enterGame"
          />
          <ScrollViews
            :game-data="topGames"
            header="Top Picks"
            :icon="Users2Icon"
            :handler="enterGame"
          />
          <ScrollViews
            :game-data="RTPGames"
            header="Most Wins"
            :icon="Coins"
            :handler="enterGame"
          />
        </section>

        <section v-else-if="gameType === 'slots'" class="w-full h-full p-2">
          <aside class="flex justify-between items-center gap-2">
            <InputGroup class="border-sky-500 ring-sky-500 ring-0">
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
            <ProviderOptions />
          </aside>

          <!-- <ScrollViews
            :game-data="topSlotGames"
            header="Top Slots"
            :icon="CrownIcon"
          /> -->
          <GameViews
            header="All Slots"
            :game-data="jiliGames"
            :handler="enterGame"
          />
        </section>

        <section
          v-else-if="gameType === 'tableGames'"
          class="w-full h-full p-2"
        >
          <ScrollViews
            :game-data="topTableGames"
            header="Top Games"
            :icon="CrownIcon"
            :handler="enterGame"
          />
          <GameViews
            header="All Games"
            :game-data="pragmaticPlayGames"
            :handler="enterGame"
          />
        </section>
        <section
          v-else-if="gameType === 'arcadeGames'"
          class="w-full h-full p-2"
        >
          <!-- <ScrollViews
            :game-data="topTableGames"
            header="Top Games"
            :icon="CrownIcon"
          /> -->
          <GameViews
            header="Arcade Games"
            :game-data="arcadeGames"
            :handler="enterGame"
          />
        </section>
      </div>
      <div v-else class="flex items-center flex-col lg:grid">
        <div
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4"
        >
          <div
            id="skeleton"
            class="w-full"
            v-for="(_, index) in 25"
            :key="index"
          >
            <Skeleton class="w-30 sm:35 h-45 rounded-2xl bg-gray-800" />
          </div>
        </div>
      </div>
    </main>
</template>