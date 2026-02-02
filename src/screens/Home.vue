<script lang="ts" setup>
import type { Game } from "../utils/types";
import { ref, watchEffect } from "vue";
import type { CarouselApi } from "../components/ui/carousel";
import { watchOnce } from "@vueuse/core";
import { Card, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { getGameListAPI } from "../services/gameAPI";
import { Skeleton } from "@/components/ui/skeleton";
const api = ref<CarouselApi>();
const totalCount = ref(0);
let games = ref<Game[]>([]);
const current = ref(0);
function setApi(val: CarouselApi) {
  api.value = val;
}
watchOnce(api, (api) => {
  if (!api) return;
  totalCount.value = api.scrollSnapList().length;
  current.value = api.selectedScrollSnap() + 1;
  api.on("select", () => {
    current.value = api.selectedScrollSnap() + 1;
  });
});

watchEffect(async () => {
  const response = await getGameListAPI();
  if (response) games.value = response.seamlessGameProviderGames;
});
</script>
<template>
  <main>
    <div>
      <div>
        <div class="w-full ">
          <Carousel
            class="relative w-full"
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
                      class="flex aspect-square items-center justify-center p-6 bg-gray-50 rounded-2xl"
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
      <div class="" id="provider options"></div>
      <div class="w-full" v-if="games.values.length">
        <div v-for="game in games" :key="game?.gameID">
          {{ game }}
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
