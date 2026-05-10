<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Grid, FreeMode } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/free-mode";

import type { gameType } from "@/utils/types";
import { ChevronLeft, ChevronRight, Users, Percent, Diamond } from "lucide-vue-next";
import { computed, onMounted, ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useFakeGameStats } from "@/lib/gamStatHook";

const swiperRef = ref<any>(null);
const { t, locale } = useI18n();

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

const { stats: gameStats, startLive } = useFakeGameStats();

onMounted(async () => {
  await nextTick();
  startLive(props.gameData || []);
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

    <!-- Swiper Grid Container -->
    <Swiper
      @swiper="onSwiper"
      :modules="[Grid, FreeMode]"
      :slides-per-view="3"
      :grid="{ rows: 2, fill: 'row' }"
      :space-between="10"
      :free-mode="true"
      :breakpoints="{
        640: { slidesPerView: 4, grid: { rows: 2 } },
        768: { slidesPerView: 5, grid: { rows: 2 } },
        1024: { slidesPerView: 7, grid: { rows: 2 } },
        1280: { slidesPerView: 9, grid: { rows: 2 } },
      }"
      class="two-row-swiper pb-2!"
    >
      <SwiperSlide
        v-for="game in gameData || []"
        :key="game.id"
        class="h-auto!"
      >
        <div
          @click="handler?.(game)"
          class="relative flex flex-col group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
        >
          <!-- Image Wrapper -->
          <div
            class="relative aspect-3/4 overflow-hidden rounded-lg"
          >
          <div
              class="pointer-events-none absolute inset-0 rounded-md bg-white/5 bg-linear-to-b from-white/0 via-white/10 to-gray-950"
            />
            <img
              :src="locale === 'cn' ? game.cn_icon_url : game.icon_url"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              :alt="game.name"
            />

            <!-- Overlay Gradients -->
            <div
              class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60"
            />
 <div
              class="pointer-events-none absolute inset-0 rounded-md border-shine"
            />
            <!-- Stats Badge -->
            <div class="absolute top-1 left-1 z-20 flex flex-col gap-0.5">
              <div
                v-if="gameStats[game.id]"
                class="flex items-center gap-2 px-1 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
              >
                <!-- <p>RTP</p> -->
                <Diamond class="w-2 h-2 text-blue-500" />
                <span class="text-[8px] text-white font-bold">
                  {{ gameStats[game.id]?.rtp }}
                </span>
              </div>

              <div
                v-if="gameStats[game.id]"
                class="flex items-center w-fit gap-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
              >
                <Users class="w-2 h-2 text-green-500" />
                <span class="text-[8px] text-white font-bold">
                  {{ gameStats[game.id]?.users }}
                </span>
              </div>
            </div>

            <!-- Title Overlay -->
            <div class="absolute bottom-2 left-0 right-0 px-2">
              <p
                class="text-[10px] font-bold text-white text-center truncate drop-shadow-md"
              >
                {{ locale === "cn" ? game.cn_name : game.name }}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </article>
</template>

<style scoped>
/* Swiper Grid requires specific height handling */
.two-row-swiper {
  width: 100%;
  height: auto;
  /* Adjust this based on your design if slides appear squashed */
  margin-left: auto;
  margin-right: auto;
}

/* Ensure slides don't collapse when using Grid */
:deep(.swiper-grid-column .swiper-wrapper) {
  flex-direction: row !important;
}

:deep(.swiper-slide) {
  margin-top: 10px !important; /* Vertical gap between rows */
}
</style>
