<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import type { gameType } from "@/utils/types";
import { ChevronLeft, ChevronRight, Diamond, Users2 } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
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
const isReady = ref(false);
onMounted(async() => {
    await import("swiper/css");
  requestAnimationFrame(() => {
    isReady.value = true;
  });
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
          alt="section-icon"
          fetchpriority="high"
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
          class=" px-3 h-8 rounded-md bg-gray-800/80 border border-white/5 flex gap-2 items-center"
        >
        <p class=" text-gray-300 text-xs hover:text-white transition-colors">{{ t("view_more") }} </p>
          <span class="text-gray-300 ml-1">{{ total }}</span>
        </button>

        <div class="flex gap-2 ml-1">
          <button
            aria-label="slider left"
            @click="swiperRef?.slidePrev()"
            class="bg-gray-800 border border-white/5 p-1.5 rounded-md hover:bg-gray-700 transition"
          >
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </button>
          <button
            aria-label="slide right"
            @click="swiperRef?.slideNext()"
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
      <!-- Loop through the paired columns instead of individual games -->
      <SwiperSlide
        v-for="(gamePair, index) in chunkedGames"
        :key="index"
        class="h-auto!"
      >
        <!-- Stack the two games vertically with a gap -->
        <div class="flex flex-col gap-2">
          <div
            v-for="game in gamePair"
            :key="game.id"
            @click="handler?.(game)"
            class="relative flex flex-col group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
          >
            <!-- Image Wrapper -->
            <div class="relative aspect-3/4 overflow-hidden rounded-lg">
              <div
                class="pointer-events-none absolute inset-0 rounded-md bg-white/5 bg-linear-to-b from-white/0 via-white/10 to-gray-950"
              />
             <img
                :src="locale === 'cn' ? game.cn_icon_url : game.icon_url"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                :alt="game.name"
                loading="lazy"
                decoding="async"
              />
              <!-- Overlay Gradients -->
              <div
                class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60"
              />
              <div
                class="pointer-events-none absolute inset-0 rounded-md border-shine"
              />
              <!-- Badges -->
              <div class="absolute top-1 left-1 z-20 flex flex-col gap-0.5">
                <div
                  v-if="stats[key(game)]"
                  class="flex items-center gap-1 px-1 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
                >
                  <Diamond class="w-2 h-2 text-blue-500" />
                  <span class="text-[8px] text-white font-bold">
                    <span class="text-[8px] text-blue-500">RTP</span> {{ stats[`${game.provider_id}-${game.game_id}`]?.rtp }}
                  </span>
                </div>

                <div
                  v-if="stats[key(game)]"
                  class="flex items-center w-fit gap-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
                >
                  <Users2 class="w-2 h-2 text-green-500" />
                  <span class="text-[8px] text-white font-bold">
                    {{ stats[`${game.provider_id}-${game.game_id}`]?.users }}
                  </span>
                </div>
              </div>

              <!-- Title Overlay -->
              <div class="absolute bottom-2 left-0 right-0 px-2">
                <p
                  class=" font-bold text-white text-[10px] text-center truncate drop-shadow-md"
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

  <!-- :src="`${locale==='cn'? game.cn_icon_url:game.icon_url}?width=180&format=webp`"
                :srcset="`
                  ${locale==='cn'? game.cn_icon_url:game.icon_url}?width=120&format=webp 120w,
                  ${locale==='cn'? game.cn_icon_url:game.icon_url}?width=180&format=webp 180w,
                  ${locale==='cn'? game.cn_icon_url:game.icon_url}?width=300&format=webp 300w
                `"
                sizes="(max-width: 768px) 33vw, 180px" -->