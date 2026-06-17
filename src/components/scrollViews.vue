<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import type { gameType } from "@/utils/types";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { GAME_IMAGE_FALLBACK, gameKey, gameProviderName, localizedGameImage, localizedGameName } from "@/utils/game";
import { useGameStore } from "@/stores/game";
import "swiper/css";
const swiperRef = ref<any>(null); // This will hold the Swiper instance
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
  swiperRef.value = swiper; // Correct assignment
};
const slideLeft = () => {
  if (swiperRef.value) swiperRef.value.slidePrev();
};
const slideRight = () => {
  if (swiperRef.value) swiperRef.value.slideNext();
};
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
  <article class="w-full" id="TopGame">
    <div class="flex w-full items-center justify-between my-4">
      <div class="flex gap-2 items-center">
        <img
          :src="icon"
          class="w-7 h-7 object-contain"
          alt="section-icon"
          fetchpriority="low"
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
          <p class="text-gray-300 text-xs hover:text-white">
            {{ t("view_more") }}
          </p>
          <span class="text-gray-300 ml-1">{{ total }}</span>
        </button>

        <div class="flex gap-2 ml-1">
          <button
            @click="slideLeft"
            aria-label="slider left"
            class="bg-gray-800/20 border border-gray-500/20 p-1.5 rounded-md hover:bg-gray-700"
          >
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </button>
          <button
            @click="slideRight"
            aria-label="slide right"
            class="bg-gray-800/20 border border-gray-500/20 p-1.5 rounded-md hover:bg-gray-700"
          >
            <ChevronRight class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
    <Swiper
      @swiper="onSwiper"
      :speed="500"
      :space-between="8"
      :slides-per-view="'auto'"
      :touch-ratio="1"
      :resistance-ratio="0.85"
      :watch-slides-progress="false"
      :observer="false"
      :observe-parents="false"
      :breakpoints="{
        0: { slidesPerView: 3 },
        640: { slidesPerView: 4 },
        768: { slidesPerView: 6 },
        1024: { slidesPerView: 8 },
        1200: { slidesPerView: 10 },
      }"
      class="w-full"
    >
      <SwiperSlide v-for="(game, index) in gameData || []" :key="gameKey(game)">
        <div
          class="relative rounded-lg cursor-pointer"
          @click="handler?.(game)"
        >
          <div
            class="relative aspect-square overflow-hidden rounded-lg "
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
            <div
                class="pointer-events-none absolute bottom-0 inset-x-0 h-1/4 bg-linear-to-t from-black/60 via-black/10 to-transparent z-10"
              />

            <div
              class="pointer-events-none absolute bottom-0 transform-gpu backface-hidden inset-x-0 h-full backdrop-saturate-100 z-10"
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
              class="absolute bottom-0 left-0 right-0 px-3 z-20"
            >
              <p
                class="font-extrabold text-white text-[8px] shadow-xl text-center truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
              >
                {{ localizedGameName(game, locale) }}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </article>
</template>
