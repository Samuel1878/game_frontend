<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/free-mode"; // Added missing CSS for FreeMode
import type { gameType } from "@/utils/types";
import { ChevronLeft, ChevronRight, Users, Percent } from "lucide-vue-next";
import { computed, onMounted, ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
// import { useCasinoLiveStats } from "@/lib/gamStatHook";
import { useGameStat } from "@/lib/gameStat";
// import { useFakeGameStats } from "@/lib/gamStatHook";

const swiperRef = ref<any>(null); // This will hold the Swiper instance
const { t, locale } = useI18n();

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

const {startLive, stats} = useGameStat()
onMounted(async () => {
  await nextTick();
  startLive(props.gameData || []);
});
const isReady = ref(false);
onMounted(() => {
  // delay lets browser finish critical render first
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});
const total = computed(() => props.gameData?.length ?? 0);
</script>

<template>
  <article class="w-full" id="TopGame">
   <div class="flex w-full items-center justify-between my-4">
      <div class="flex gap-2 items-center">
        <img :src="icon" class="w-7 h-7 object-contain" alt="section-icon" fetchpriority="low"/>
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
            @click="slideLeft"
            class="bg-gray-800 border border-white/5 p-1.5 rounded-md hover:bg-gray-700 transition"
          >
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </button>
          <button
            @click="slideRight"
            class="bg-gray-800 border border-white/5 p-1.5 rounded-md hover:bg-gray-700 transition"
          >
            <ChevronRight class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
    <div class="space-y-3" v-if="!isReady">
        
        <div class="flex gap-3">
          <div class="h-40 w-2/3 bg-white/10 animate-pulse rounded-xl"></div>
          <div class="h-40 w-2/3 bg-white/10 animate-pulse rounded-xl"></div>
          <div class="h-40 w-2/3 bg-white/10 animate-pulse rounded-xl"></div>
        </div>
    </div>
    <Swiper
      v-else
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
      <SwiperSlide v-for="game in gameData || []" :key="game.id">
        <div
          class="relative rounded-lg cursor-pointer group hover:scale-105 hover:backdrop-blur-2xl hover:bg-gray-100/50 transition-all duration-300"
          @click="handler?.(game)"
        >
          <div class="relative overflow-hidden rounded-lg">
            <div
              class="pointer-events-none absolute inset-0 rounded-md bg-white/5 bg-linear-to-b from-white/0 via-white/10 to-gray-950"
            />
            <div
              class="pointer-events-none absolute inset-0 rounded-md border-shine"
            />

            <!-- RTP + USERS -->
            <div class="absolute top-1 left-1 z-20 flex flex-col gap-0.5">
              <div
                v-if="stats[game.id]"
                class="flex items-center gap-2 px-1 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
              >
                <Percent class="w-2 h-2 text-blue-500" />
                <span class="text-[8px] text-white font-bold">
                  {{ stats[game.id]?.rtp }}
                </span>
              </div>

              <div
                v-if="stats[game.id]"
                class="flex items-center w-fit gap-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
              >
                <Users class="w-2 h-2 text-green-500" />
                <span class="text-[8px] text-white font-bold">
                  {{ stats[game.id]?.users }}
                </span>
              </div>
            </div>

            <p
              class="absolute bottom-1 left-0 right-0 z-10 text-center text-[10px] font-black text-white truncate px-1"
            >
              {{ locale === "cn" ? game.cn_name : game.name }}
            </p>

            <img
              :src="locale === 'cn' ? game.cn_icon_url : game.icon_url"
              class="w-full aspect-3/4 sm:aspect-4/5 md:aspect-square object-cover rounded-lg"
              :alt="game.name"
                fetchpriority="auto"
                decoding="async"
                loading="lazy"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </article>
</template>

 <!-- :modules="[FreeMode]"
      :free-mode="{
        enabled: true,
        momentum: true,
        momentumRatio: 0.35,
        momentumVelocityRatio: 0.8,
        sticky: false,
      }" -->