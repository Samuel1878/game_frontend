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
import { getGameListAPI } from "@/services/gameAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";
import { gameStore } from "@/stores/game";
import { toast } from "vue-sonner";
import { useWallet } from "@/stores/wallet";
import { homeOptions } from "@/consts";

const api = ref<CarouselApi>();
const totalCount = ref(0);
const authStore = useAuthStore()
let games = ref<Game[]>([]);

const useGameStore = gameStore();
const current = ref(0);
function setApi(val: CarouselApi) {
  api.value = val;
}
const wallet = useWallet();
watchEffect(()=>{
wallet.setWallet(authStore.user?.name ?? null)
})
watchOnce(api, (api) => {
  if (!api) return;
  totalCount.value = api.scrollSnapList().length;
  current.value = api.selectedScrollSnap() + 1;
  api.on("select", () => {
    current.value = api.selectedScrollSnap() + 1;
  });
});
console.log("user", authStore.user)
watchEffect(async () => {
  const response = await getGameListAPI();
  if (response) games.value = response.seamlessGameProviderGames;
});
const enterGame = (game: Game) => {
  console.log("entering game", game);
  if (!authStore.isLoggedIn || !authStore.user) {
    toast("Please login to enter the game")
    return;
  }
  useGameStore.setGames(game)
  
} 
</script>
<template>
  <main class="bg-gray-950 maxw-6xl flex justify-between flex-col p-2 items-center">
    <div>
      <div>
        <div class="w-full h-80">
          <Carousel
            class="relative w-full min-h-70"
            @init-api="setApi"
            :plugins="[
              Autoplay({
                delay: 2000,
              }),
            ]"
          >
            <CarouselContent class="flex h-full">
              <CarouselItem v-for="(_, index) in 5" :key="index" class=" h-70">
                  <Card class="border-0 rounded-2xl bg-gray-900 h-full">
                    <CardContent
                      class="flex items-center justify-center p-6 bg-gray-900"
                    >
                      <!-- <span class="text-4xl font-semibold">{{
                        index + 1
                      }}</span> -->
                      <div class="absolute bottom-4 left-4 space-y-4">
                        <p class="text-red-500 font-bold text-4xl">Welcome Bonus</p>
                        <p class="text-gray-500 font-thin text-2xl">Get welcome bonus for newly registered users</p>
                        <button class="mt-6 h-10 px-4 bg-red-600 rounded-lg text-gray-50">
                          Claim
                        </button>
                      </div>
                    </CardContent>
                  </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <div class="py-2 text-center text-sm text-muted-foreground">
            Slide {{ current }} of {{ totalCount }}
            <!-- <div class="w-3"/> -->
          </div>
        </div>
      </div>
      <div class="w-full flex justify-between gap-2 my-2" id="provider options">
        <button class="text-gray-100 text-sm font-semibold flex-1 justify-center items-center bg-gray-900 h-12 rounded-2xl">
          Deposit
        </button>
       <button class="text-gray-100 text-sm font-semibol flex-1 justify-center items-center bg-gray-900 h-12 rounded-2xl">
          Withdraw
        </button>
       <button class="text-gray-100 text-sm font-semibol flex-1 justify-center items-center bg-gray-900 h-12 rounded-2xl">
          Download
        </button>
      </div>
      <div class="flex gap-2 items-center my-2">
<div v-for="option in homeOptions" class="flex gap-2 items-center h-10 px-2 text-sm">
      <component :is="option.icon" />
      <p class="text-sm">{{ option.label }}</p>
     </div>
      </div>
     
     <div v-if="games" class="flex items-center w-full flex-col lg:grid">
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">     
            <a :href="`${authStore.url}&gpid=${game.gameProviderId}&gameid=${game.gameID}&lang=en&device=m&betCode=`"  v-for="game in games" :key="game?.gameID" class="w-30 sm:35  cursor-pointer" @click="enterGame(game)">
              <div class="h-45 rounded-2xl bg-gray-800 overflow-hidden">
                <img :src="game?.gameInfos.filter((e)=>e.language === 'en')[0]?.gameIconUrl" alt="game thumbnail" class="w-full h-full object-cover"/>
              </div>
              <p class="text-white text-sm text-center mt-2 font-bold">{{ game?.gameInfos.filter((e)=>e.language === 'en')[0]?.gameName  }}  </p>

            </a>
          </div>
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
    </div>
  </main>
</template>
