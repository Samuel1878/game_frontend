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
  <main class="bg-gray-900 maxw-6xl flex justify-between flex-col p-4 items-center">
    <div>
      <div>
        <div class="w-full">
          <Carousel
            class="relative w-full "
            @init-api="setApi"
            :plugins="[
              Autoplay({
                delay: 2000,
              }),
            ]"
          >
            <CarouselContent>
              <CarouselItem v-for="(_, index) in 5" :key="index">
                  <Card class=" border-0 rounded-2xl">
                    <CardContent
                      class="flex aspect-square items-center justify-center p-6 bg-gray-800 rounded-2xl"
                    >
                      <span class="text-4xl font-semibold">{{
                        index + 1
                      }}</span>
                    </CardContent>
                  </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <!-- <div class="py-2 text-center text-sm text-muted-foreground">
            Slide {{ current }} of {{ totalCount }}
          </div> -->
        </div>
      </div>
      <div class="w-full flex justify-between px-4 gap-2 mb-3" id="provider options">
        <button class="text-gray-100 flex-1 justify-center items-center bg-gray-800 h-12 rounded-2xl">
          Deposit
        </button>
       <button class="text-gray-100 flex-1 justify-center items-center bg-gray-800 h-12 rounded-2xl">
          Withdraw
        </button>
       <button class="text-gray-100 flex-1 justify-center items-center bg-gray-800 h-12 rounded-2xl">
          Download
        </button>
      </div>
      <h1 class="">Hot Games</h1>
     <div v-if="games" class="flex items-center w-full flex-col lg:grid">
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">     
            <a :href="`${authStore.url}&gpid=${game.gameProviderId}&gameid=${game.gameID}&lang=en&device=m&betCode=`"  v-for="game in games" :key="game?.gameID" class="w-30 sm:35  cursor-pointer" @click="enterGame(game)">
              <div class="h-45 rounded-2xl bg-gray-800 overflow-hidden">
                <img :src="game?.gameInfos.filter((e)=>e.language === 'en')[0]?.gameIconUrl" alt="game thumbnail" class="w-full h-full object-cover"/>
              </div>
              <p class="text-white text-center mt-2 font-bold">{{ game?.gameInfos.filter((e)=>e.language === 'en')[0]?.gameName  }}  </p>

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
