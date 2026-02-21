<script lang="ts" setup>
import type { Game } from "@/utils/types";
import { ref, watchEffect } from "vue";
import type { CarouselApi } from "@/components/ui/carousel";
import { watchOnce } from "@vueuse/core";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";

import { useWallet } from "@/stores/wallet";
import {
  gameOption,
  hotGames,
  RTPGames,
  topGames,
  topTableGames,
} from "@/consts";
import { sboGames } from "@/consts/sboGames";
import {
  ArrowLeft,
  ArrowRight,
  Coins,
  CrownIcon,
  SearchIcon,
  Users2Icon,
} from "lucide-vue-next";
import ScrollViews from "@/components/scrollViews.vue";
import { arcadeGames } from "@/consts/games";
import GameViews from "@/components/gameViews.vue";
import { jiliGames } from "@/consts/jiliGames";
import { pragmaticPlayGames } from "@/consts/pragmaticGames";
import ProviderOptions from "@/components/providerOptions.vue";
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
const api = ref<CarouselApi>();
const gameType = ref<string>("lobby");
const totalCount = ref(0);
const authStore = useAuthStore();
let games = ref<Game[] | null>(sboGames);
// const useGameStore = gameStore();
const current = ref(0);
// const filterByNewGameType = (
//   games: Game[],
//   type: number
// ): Game[] => {
//   return games.filter(game => game.newGameType === type)
// }

function setApi(val: CarouselApi) {
  api.value = val;
}
const wallet = useWallet();
watchEffect(() => {
  wallet.setWallet(authStore.user?.name ?? null);
});
watchOnce(api, (api) => {
  if (!api) return;
  totalCount.value = api.scrollSnapList().length;
  current.value = api.selectedScrollSnap() + 1;
  api.on("select", () => {
    current.value = api.selectedScrollSnap() + 1;
  });
});
console.log("user", authStore.user);
// watchEffect(async () => {
//   const response = await getGameByGpId(1094);
//   if (response) games.value = response.seamlessGameProviderGames;
// });
// const enterGame = (game: Game) => {
//   console.log("entering game", game);
//   if (!authStore.isLoggedIn || !authStore.user) {
//     toast("Please login to enter the game");
//     return;
//   }
//   useGameStore.setGames(game);
// };
// const cliamhandlern = () => {
//   console.log("Cliamed");
// };
// const getGameByGp = async (e: number) => {
//   const respnse = await getGameByGpId(e);
//   if (respnse) return (games.value = respnse?.seamlessGameProviderGames);
// };
// const chooseGame = (gpid: number) => {
//   games.value =
//     slotGameProviders
//       .filter((e) => e.GpId === gpid)[0]
//       ?.data.filter((e) => e.newGameType === 201) || null;
// };

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

</script>
<template>
  <main class="bg-slate-950 max-w-6xl w-full flex justify-between flex-col">
    <div>
      <div>
        <div class="w-full h-70 p-3">
          <Carousel
            class="relative w-full min-h-65"
            @init-api="setApi"
            :plugins="[
              Autoplay({
                delay: 2000,
              }),
            ]"
          >
            <CarouselContent class="flex h-full">
              <CarouselItem v-for="(_, index) in 5" :key="index" class="h-65">
                <Card class="border-0 rounded-2xl bg-slate-900 h-full">
                  <CardContent
                    class="flex items-center justify-center p-6 bg-slate-900"
                  >
                    <div class="absolute bottom-4 left-4 space-y-4">
                      <p class="text-sky-500 font-bold text-4xl">Welcome</p>
                      <p class="text-gray-500 font-thin text-2xl">
                        Get welcome bonus for newly registered users
                      </p>
                      <button
                        @click=""
                        class="mt-6 h-10 px-4 bg-sky-600 rounded-lg text-gray-50"
                      >
                        Claim
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>

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
          />
          <ScrollViews
            :game-data="topGames"
            header="Top Picks"
            :icon="Users2Icon"
          />
          <ScrollViews :game-data="RTPGames" header="Most Wins" :icon="Coins" />
        </section>

                <section
          v-else-if="gameType === 'slots'"
          class="w-full h-full p-2"
        >
        <aside class="flex justify-between items-center gap-2">
          <InputGroup class="border-sky-500 ring-sky-500 ring-0">
      <InputGroupInput  placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
 <ProviderOptions/>
        </aside>
          
          <!-- <ScrollViews
            :game-data="topSlotGames"
            header="Top Slots"
            :icon="CrownIcon"
          /> -->
         <GameViews header="All Slots" :game-data="jiliGames"/>
        </section>


        <section
          v-else-if="gameType === 'tableGames'"
          class="w-full h-full p-2"
        >
          <ScrollViews
            :game-data="topTableGames"
            header="Top Games"
            :icon="CrownIcon"
          />
            <GameViews header="All Games" :game-data="pragmaticPlayGames"/>
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
          <GameViews header="Arcade Games" :game-data="arcadeGames"/>
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
            <Skeleton class="w-30 sm:35 h-45 rounded-2xl bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style lang="css">
/* hide scrollbar but allow scroll */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
