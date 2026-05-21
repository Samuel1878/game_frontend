<script setup lang="ts">
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { homeSlide } from "@/consts";
import "swiper/css";
import "swiper/css/pagination";
import { useI18n } from "vue-i18n";
import { onMounted, ref } from "vue";
const { locale } = useI18n();
const isReady = ref(false);
onMounted(() => {
  // delay lets browser finish critical render first
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});
</script>

<template>
  <div class="w-full relative">
    <div
      v-if="!isReady"
      class="w-full h-50
             bg-white/10 animate-pulse rounded-xl"
    />
    <Swiper
        v-else
      :modules="[Pagination, Autoplay]"
      :loop="true"
      :speed="800"
      :init="true"
      :preload-images="true"
      :observer="false"
      :observe-parents="false"
      :observe-slide-children="false"
      :watch-slides-progress="false"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :space-between="10"
      :breakpoints="{
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },   // tablet
        1024: { slidesPerView: 3 }   // desktop
      }"
    >
      <SwiperSlide
        v-for="( slide, index) in homeSlide"
        :key="slide.id"
        class="relative w-full"
      >
        <div class="h-full">
          <img
            :src="locale === 'cn' ? slide.cn_image : slide.image"
            class="w-full h-full object-cover "
            fetchpriority="high"
             :loading="index === 0 ? 'eager' : 'lazy'"
            decoding="async"
            alt="Hero"
            
          />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
<style>
/* Add this to your style block */
.swiper {
  /* Color of the active dot */
  --swiper-pagination-color: #f6c43b; /* Tailwind blue-500 */
  
  /* Color of the inactive dots */
  --swiper-pagination-bullet-inactive-color: #94a3b8; /* Tailwind slate-400 */
  
  /* Opacity of inactive dots */
  --swiper-pagination-bullet-inactive-opacity: 0.5;
  
  /* Size of the dots (optional) */
  --swiper-pagination-bullet-size: 8px;
  --swiper-pagination-bullet-horizontal-gap: 4px;
}</style>