<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import type { gameType } from "@/utils/types";
import { ChevronLeft, ChevronRight, Diamond, Users2 } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import "swiper/css";
import { useI18n } from "vue-i18n";
import { useFakeGameStatsWithId } from "@/lib/fakeGameStatHook";
const swiperRef = ref<any>(null);
const { t, locale } = useI18n();
const props = defineProps<{
  action?: () => void;
  header?: string;
  gameData?: gameType[];
  handler?: (gameData: gameType) => void;
  icon: string;
}>();
const { stats, registerKeys } = useFakeGameStatsWithId();
watch(
  () => props.gameData, // Use a getter function here
  (list) => {
    if (!list || list.length === 0) return;

    const keys = list.map((g) => `${g.provider_id}-${g.game_id}`);
    registerKeys(keys);
  },
  { immediate: true },
);

const key = (game: any) => `${game.provider_id}-${game.game_id}`;
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
            :key="game.id"
            @click="handler?.(game)"
            class="relative flex flex-col cursor-pointer"
          >
            <div
              class="relative aspect-3/3.5 overflow-hidden rounded-lg"
            >
              <img
                :src="`${
                  locale === 'cn' ? game.cn_icon_url : game.icon_url
                }?width=180&format=webp`"
                :srcset="`
                    ${
                      locale === 'cn' ? game.cn_icon_url : game.icon_url
                    }?width=120&format=webp 120w,
                    ${
                      locale === 'cn' ? game.cn_icon_url : game.icon_url
                    }?width=180&format=webp 180w,
                    ${
                      locale === 'cn' ? game.cn_icon_url : game.icon_url
                    }?width=300&format=webp 300w
                  `"
                sizes="(max-width: 768px) 33vw, 180px"
                class="w-full h-full object-cover"
                :alt="locale === 'cn' ? game.cn_name : game.name"
                :loading="index > 5 ? 'lazy' : 'eager'"
                decoding="async"
                :fetchpriority="index > 5 ? 'auto' : 'high'"
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
                  v-if="stats[key(game)]"
                  class="flex items-center gap-1 px-1 py-0.5 rounded-full bg-gray-800/70 border border-gray-500/20 shadow-lg"
                >
                  <Diamond
                    class="w-2 h-2 text-blue-400 fill-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"
                  />
                  <span
                    class="text-[7px] text-white/95 font-bold tracking-wide"
                  >
                    <span class="text-blue-400 font-extrabold">RTP</span>
                    {{ stats[key(game)]?.rtp }}
                  </span>
                </div>

                <div
                  v-if="stats[key(game)]"
                  class="flex items-center w-fit gap-1 px-1 py-0.5 rounded-full bg-gray-800/70 border border-gray-500/20 shadow-lg"
                >
                  <Users2
                    class="w-2 h-2 text-green-400 fill-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"
                  />
                  <span
                    class="text-[7px] text-white/95 font-bold tracking-wide"
                  >
                    {{ stats[key(game)]?.users }}
                  </span>
                </div>
              </div>

              <div
                class="absolute bottom-1 left-0 right-0 px-3 z-20"
              >
                <p
                  class="font-extrabold text-white text-[10px] text-center truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
                >
                  {{ locale === "cn" ? game.cn_name : game.name }}
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
