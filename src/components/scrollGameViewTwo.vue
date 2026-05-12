<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import type { gameType } from "@/utils/types";
import { ChevronLeft, ChevronRight, Diamond, Users2 } from "lucide-vue-next";
import { computed, nextTick, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useGameStat } from "@/lib/gameStat";


const swiperRef = ref<any>(null);
const { t, locale } = useI18n();

const props = defineProps<{
  action?: () => void;
  header?: string;
  gameData?: gameType[];
  handler?: (gameData: gameType) => void;
  icon: string;
}>();

const { stats, startLive } = useGameStat();

onMounted(async () => {
  await nextTick();
  startLive(props.gameData || []);
});

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
        <img :src="icon" class="w-7 h-7 object-contain" alt="section-icon" />
        <h2 class="font-bold text-gray-200 text-lg tracking-tight">
          {{ header }}
        </h2>
      </div>

      <div class="flex gap-2 items-center">
        <button
          @click="action"
          class="text-xs px-3 h-8 rounded-md bg-gray-800/80 border border-white/5 text-gray-300 hover:text-white transition-colors"
        >
          {{ t("view_more") }} <span class="opacity-50 ml-1">{{ total }}</span>
        </button>

        <div class="flex gap-2 ml-1">
          <button
            @click="swiperRef?.slidePrev()"
            class="bg-gray-800 border border-white/5 p-1.5 rounded-md hover:bg-gray-700 transition"
          >
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </button>
          <button
            @click="swiperRef?.slideNext()"
            class="bg-gray-800 border border-white/5 p-1.5 rounded-md hover:bg-gray-700 transition"
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
    :slides-per-view="3"
    :touch-ratio="1.2" 
    :resistance-ratio="0.85"
    :watch-slides-progress="true"
    :breakpoints="{
      640: { slidesPerView: 4 },
      768: { slidesPerView: 5 },
      1024: { slidesPerView: 7 },
      1280: { slidesPerView: 9 },
    }"
    class="pb-2! select-none"
    style="touch-action: pan-y;"
  >
    <SwiperSlide
      v-for="(gamePair, index) in chunkedGames"
      :key="index"
      class="h-auto!"
    >
      <div class="flex flex-col gap-2">
        <div
          v-for="game in gamePair"
          :key="game.id"
          @click="handler?.(game)"
          class="relative flex flex-col group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
          style="transform: translateZ(0);" 
        >
          <!-- Image Wrapper -->
          <div class="relative aspect-3/4 overflow-hidden rounded-lg">
            <div
              class="pointer-events-none absolute inset-0 rounded-md bg-white/5 bg-linear-to-b from-white/0 via-white/10 to-gray-950"
            />
            
            <!-- Optimized Image -->
            <img
              :src="locale === 'cn' ? game.cn_icon_url : game.icon_url"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
              :alt="game.name"
              loading="lazy"
              draggable="false"
            />

            <!-- Overlay Gradients -->
            <div
              class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none"
            />
            <div
              class="pointer-events-none absolute inset-0 rounded-md border-shine"
            />
            
            <!-- Badges -->
            <div class="absolute top-1 left-1 z-20 flex flex-col gap-0.5 pointer-events-none">
              <div
                v-if="stats[game.id]"
                class="flex items-center gap-2 px-1 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
              >
                <Diamond class="w-2 h-2 text-blue-500" />
                <span class="text-[8px] text-white font-bold">
                  {{ stats[game.id]?.rtp }}
                </span>
              </div>

              <div
                v-if="stats[game.id]"
                class="flex items-center w-fit gap-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
              >
                <Users2 class="w-2 h-2 text-green-500" />
                <span class="text-[8px] text-white font-bold">
                  {{ stats[game.id]?.users }}
                </span>
              </div>
            </div>

            <!-- Title Overlay -->
            <div class="absolute bottom-2 left-0 right-0 px-2 pointer-events-none">
              <p class="text-[10px] font-bold text-white text-center truncate drop-shadow-md">
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

</style>
