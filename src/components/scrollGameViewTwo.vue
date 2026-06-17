<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import type { gameType } from "@/utils/types";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed, ref } from "vue";
import "swiper/css";
import { useI18n } from "vue-i18n";
import { useGameStore } from "@/stores/game";
import { GAME_IMAGE_FALLBACK, gameKey, gameProviderName, localizedGameImage, localizedGameName } from "@/utils/game";
const swiperRef = ref<any>(null);
const { t, locale } = useI18n();
const gameStore = useGameStore();
const props = defineProps<{
  action?: () => void;
  header?: string;
  gameData?: gameType[];
  handler?: (gameData: gameType) => void;
  icon: string;
}>();
const onSwiper = (swiper: any) => {
  swiperRef.value = swiper;
};
const chunkedGames = computed(() => {
  const result = [];
  const data = props?.gameData || []; // replace gameData.value with your actual data source
  for (let i = 0; i < data.length; i += 2) {
    result.push(data.slice(i, i + 2));
  }
  return result;
});
const total = computed(() => props.gameData?.length ?? 0);
const onDemo = (event: Event, game: gameType) => {
  event.stopPropagation();
  void gameStore.launchDemoGame(game);
};
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = GAME_IMAGE_FALLBACK;
};
</script>

<template>
  <article class="w-full" id="TwoRowGames">
    <!-- Header Section -->
    <div class="flex w-full items-center justify-between my-4">
      <div class="flex gap-2 items-center">
        <img
          :src="icon"
          class="w-7 h-7 object-contain"
          alt="game-options"
          loading="lazy"
          decoding="async"
        />
        <h2 class="font-bold text-gray-200 text-lg tracking-tight">
          {{ header }}
        </h2>
      </div>

      <div class="flex gap-2 items-center">
        <button
          @click="action"
          aria-label="view more"
          class="px-3 h-8 rounded-md bg-gray-800/20 border border-gray-500/20 flex gap-2 items-center"
        >
          <p class="text-gray-300 text-xs hover:text-white transition-colors">
            {{ t("view_more") }}
          </p>
          <span class="text-gray-300 ml-1">{{ total }}</span>
        </button>

        <div class="flex gap-2 ml-1">
          <button
            aria-label="slider left"
            @click="swiperRef?.slidePrev()"
            class="bg-gray-800/20 border border-gray-500/20 p-1.5 rounded-md hover:bg-gray-700 transition"
          >
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </button>
          <button
            aria-label="slide right"
            @click="swiperRef?.slideNext()"
            class="bg-gray-800/20 border border-gray-500/20 p-1.5 rounded-md hover:bg-gray-700 transition"
          >
            <ChevronRight class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>

    <Swiper
      @swiper="onSwiper"
      :speed="300"
      :space-between="8"
      :css-mode="true"
      :slides-per-view="3"
      :touch-ratio="1"
      :resistance-ratio="0.85"
      :watch-slides-progress="false"
      :observer="false"
      :observe-parents="false"
      :breakpoints="{
        640: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 7 },
        1280: { slidesPerView: 8 },
      }"
      class="pb-2!"
    >
      <SwiperSlide
        v-for="(gamePair, index) in chunkedGames"
        :key="index"
        class="h-auto!"
      >
        <div class="flex flex-col gap-2">
          <div
            v-for="(game, index) in gamePair"
            :key="gameKey(game)"
            @click="handler?.(game)"
            class="relative flex flex-col cursor-pointer"
          >
            <div
              class="relative aspect-3/3.5 overflow-hidden rounded-lg"
            >
              <img
                :src="localizedGameImage(game, locale)"
                sizes="(max-width: 768px) 33vw, 180px"
                class="w-full h-full object-cover"
                :alt="localizedGameName(game, locale)"
                :loading="index > 5 ? 'lazy' : 'eager'"
                decoding="async"
                :fetchpriority="index > 5 ? 'auto' : 'high'"
                @error="onImageError"
              />
              <!-- 1. Ultra-Light Contrast Scrim (Just enough to protect white text, letting color shine) -->
              <div
                class="pointer-events-none absolute bottom-0 inset-x-0 h-1/2 bg-linear-to-t from-white/20 via-white/10 to-transparent z-10"
              />

              <!-- 2. The Vibrant Progressive Blur (Boosts and melts the actual background colors) -->
              <div
                class="pointer-events-none absolute bottom-0 inset-x-0 h-1/4 backdrop-blur-xl backdrop-saturate-200 mask-[linear-gradient(to_top,white_30%,transparent_100%)] z-10"
              />
              <div class="absolute top-1 left-1 z-20 flex flex-col gap-1">
                <div
                  class="max-w-24 truncate px-1.5 py-0.5 rounded-full bg-gray-800/80 border border-gray-500/20 shadow-lg text-[7px] text-white/95 font-bold"
                >
                  {{ gameProviderName(game) }}
                </div>

                <div
                  v-if="game.is_hot || game.is_top_pick || game.is_high_rtp"
                  class="w-fit px-1.5 py-0.5 rounded-full bg-yellow-400/90 text-[7px] text-black font-black shadow-lg"
                >
                  {{ game.is_hot ? t("hot_games") : game.is_top_pick ? t("top_picks") : t("featured_games") }}
                </div>
              </div>
              <button
                v-if="game.supports_demo"
                type="button"
                class="absolute top-1 right-1 z-30 px-1.5 py-0.5 rounded-full bg-white/90 text-[8px] font-black text-gray-900"
                @click="onDemo($event, game)"
              >
                {{ t("demo") }}
              </button>

              <div
                class="absolute bottom-1 left-0 right-0 px-3 z-20"
              >
                <p
                  class="font-extrabold text-white text-[10px] text-center truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
                >
                  {{ localizedGameName(game, locale) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </article>
</template>

<style scoped>
.two-row-swiper .swiper-wrapper {
  /* This tells the browser to prioritize movement over paint */
  will-change: transform;
}

/* Optional: disable the hover effect on mobile while swiping */
@media (hover: none) {
  .group:active {
    transform: none !important;
  }
}
</style>
