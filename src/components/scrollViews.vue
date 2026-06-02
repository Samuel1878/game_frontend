<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import type { gameType } from "@/utils/types";
import { ChevronLeft, ChevronRight, Users, Diamond } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useFakeGameStatsWithId } from "@/lib/fakeGameStatHook";
import "swiper/css";
const { stats, registerKeys } = useFakeGameStatsWithId();
const swiperRef = ref<any>(null); // This will hold the Swiper instance
const { t, locale } = useI18n();
const props = defineProps<{
  action?: () => void;
  header?: string;
  gameData?: gameType[];
  handler?: (gameData: gameType) => void;
  icon: string;
}>();
watch(
  () => props.gameData, // Use a getter function here
  (list) => {
    if (!list || list.length === 0) return;

    const keys = list.map((g) => `${g.provider_id}-${g.game_id}`);
    registerKeys(keys);
  },
  { immediate: true },
);
const onSwiper = (swiper: any) => {
  swiperRef.value = swiper; // Correct assignment
};
const slideLeft = () => {
  if (swiperRef.value) swiperRef.value.slidePrev();
};
const slideRight = () => {
  if (swiperRef.value) swiperRef.value.slideNext();
};
const key = (game: any) => `${game.provider_id}-${game.game_id}`;
const total = computed(() => props.gameData?.length ?? 0);
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
          <p class="text-gray-300 text-xs hover:text-white transition-colors">
            {{ t("view_more") }}
          </p>
          <span class="text-gray-300 ml-1">{{ total }}</span>
        </button>

        <div class="flex gap-2 ml-1">
          <button
            @click="slideLeft"
            aria-label="slider left"
            class="bg-gray-800/20 border border-gray-500/20 p-1.5 rounded-md hover:bg-gray-700 transition"
          >
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </button>
          <button
            @click="slideRight"
            aria-label="slide right"
            class="bg-gray-800/20 border border-gray-500/20 p-1.5 rounded-md hover:bg-gray-700 transition"
          >
            <ChevronRight class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
    <Swiper
  @swiper="onSwiper"
  :speed="400"
  :space-between="8"
  :slides-per-view="'auto'"
  :touch-ratio="1"
  :resistance-ratio="0.85"
  :watch-slides-progress="true"
  :observer="true"
  :observe-parents="true"
  :grab-cursor="true"
  :breakpoints="{
    0: { slidesPerView: 3 },
    640: { slidesPerView: 4 },
    768: { slidesPerView: 6 },
    1024: { slidesPerView: 8 },
    1200: { slidesPerView: 10 },
  }"
  class="w-full"
>
  <SwiperSlide v-for="(game, index) in gameData || []" :key="game.id" class="will-change-transform">
    <!-- Outer Card Wrapper: Converted to transform-gpu & isolated transitions to stop lag -->
    <div
      class="relative rounded-lg cursor-pointer group hover:scale-105 transition-transform duration-300 transform-gpu"
      @click="handler?.(game)"
    >
      <!-- Inner Frame: Added isolation and backface visibility constraints -->
      <div
        class="relative aspect-3/3.5 overflow-hidden rounded-lg transition-all duration-300 group-hover:ring-white/20 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transform-gpu backface-hidden"
      >
        <img
          :src="`${
            locale === 'cn' ? game.cn_icon_url : game.icon_url
          }?width=180&format=webp`"
          :srcset="`
            ${locale === 'cn' ? game.cn_icon_url : game.icon_url}?width=120&format=webp 120w,
            ${locale === 'cn' ? game.cn_icon_url : game.icon_url}?width=180&format=webp 180w,
            ${locale === 'cn' ? game.cn_icon_url : game.icon_url}?width=300&format=webp 300w
          `"
          sizes="(max-width: 768px) 33vw, 180px"
          class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 transform-gpu"
          :alt="locale === 'cn' ? game.cn_name : game.name"
          :loading="index > 5 ? 'lazy' : 'eager'"
          decoding="async"
          :fetchpriority="index > 5 ? 'auto' : 'high'"
        />

        <!-- 1. The Shadow Scrim (Flipped to black base so white text stands out perfectly) -->
        <div
          class="pointer-events-none absolute bottom-0 inset-x-0 h-1/2 bg-linear-to-t from-white/20 via-white/10 to-transparent z-10"
        />

        <!-- 2. The Color-Bleed Progressive Blur Layer (Forced into hardware layer isolation) -->
        <div
          class="pointer-events-none absolute bottom-0 inset-x-0 h-1/4 backdrop-blur-md backdrop-saturate-200 mask-[linear-gradient(to_top,white_30%,transparent_100%)] z-10 transform-gpu backface-hidden"
        />

        <!-- Stats Badges Layer -->
        <div class="absolute top-1 left-1 z-20 flex flex-col gap-1 transform-gpu">
          <div
            v-if="stats[key(game)]"
            class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg"
          >
            <Diamond
              class="w-2 h-2 text-blue-400 fill-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"
            />
            <span class="text-[7px] text-white/95 font-bold tracking-wide">
              <span class="text-blue-400 font-extrabold">RTP</span>
              {{ stats[key(game)]?.rtp }}
            </span>
          </div>

          <div
            v-if="stats[key(game)]"
            class="flex items-center w-fit gap-1 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg"
          >
            <Users
              class="w-2 h-2 text-green-400 fill-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"
            />
            <span class="text-[7px] text-white/95 font-bold tracking-wide">
              {{ stats[key(game)]?.users }}
            </span>
          </div>
        </div>

        <!-- 3. Title Container Layer (Forced layer caching via backface-hidden to prevent disappearing) -->
        <div
          class="absolute bottom-1.5 left-0 right-0 px-2 z-20 transition-transform duration-300 group-hover:-translate-y-0.5 transform-gpu backface-hidden"
        >
          <p
            class="font-extrabold text-white text-[10px] text-center truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-wide"
          >
            {{ locale === "cn" ? game.cn_name : game.name }}
          </p>
        </div>
      </div>
    </div>
  </SwiperSlide>
</Swiper>
    <!-- <Swiper
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
      <SwiperSlide v-for="(game, index) in gameData || []" :key="game.id">
        <div
          class="relative rounded-lg cursor-pointer group hover:scale-105 hover:backdrop-blur-2xl hover:bg-gray-100/50 transition-all duration-300"
          @click="handler?.(game)"
        >
          <div
            class="relative aspect-3/3.5 overflow-hidden rounded-lg transition-all duration-300 group-hover:ring-white/20 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)]"
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
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              :alt="locale === 'cn' ? game.cn_name : game.name"
              :loading="index > 5 ? 'lazy' : 'eager'"
              decoding="async"
              :fetchpriority="index > 5 ? 'auto' : 'high'"
            />
            <div
              class="pointer-events-none absolute bottom-0 inset-x-0 h-1/2 bg-linear-to-t from-white/20 via-white/10 to-transparent z-10"
            />
            <div
              class="pointer-events-none absolute bottom-0 inset-x-0 h-1/4 backdrop-blur-xl backdrop-saturate-200 mask-[linear-gradient(to_top,white_30%,transparent_100%)] z-10"
            />
            <div class="absolute top-1 left-1 z-20 flex flex-col gap-1">
              <div
                v-if="stats[key(game)]"
                class="flex items-center gap-1 px-1 py-0.5 rounded-full bg-gray-800/20 backdrop-blur-md border border-white/10 shadow-lg"
              >
                <Diamond
                  class="w-2 h-2 text-blue-400 fill-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"
                />
                <span class="text-[7px] text-white/95 font-bold tracking-wide">
                  <span class="text-blue-400 font-extrabold">RTP</span>
                  {{ stats[key(game)]?.rtp }}
                </span>
              </div>

              <div
                v-if="stats[key(game)]"
                class="flex items-center w-fit gap-1 px-1 py-0.5 rounded-full bg-gray-800/20 backdrop-blur-md border border-white/10 shadow-lg"
              >
                <Users
                  class="w-2 h-2 text-green-400 fill-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"
                />
                <span class="text-[7px] text-white/95 font-bold tracking-wide">
                  {{ stats[key(game)]?.users }}
                </span>
              </div>
            </div>
            <div
              class="absolute bottom-1 left-0 right-0 px-3 z-20 transition-transform duration-300 group-hover:-translate-y-1"
            >
              <p
                class="font-extrabold text-white text-[10px] text-center truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
              >
                {{ locale === "cn" ? game.cn_name : game.name }}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper> -->
  </article>
</template>
