<script setup>
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { homeSlide } from "@/consts";
import { useI18n } from "vue-i18n";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const autoplayConfig = {
  delay: 3000, // ⏱ time between slides
  disableOnInteraction: false, // keep autoplay after swipe
};
const { t } = useI18n();
</script>

<template>
  <Swiper
    :modules="[Navigation, Pagination, Scrollbar, Autoplay]"
    :slides-per-view="1"
    :space-between="10"
    :speed="1500"
    :autoplay="autoplayConfig"
    :loop="true"
    :navigation="false"
    :pagination="{ clickable: true }"
  >
    <SwiperSlide
      v-for="slide in homeSlide"
      :key="slide.id"
      class="relative w-full"
    >
      <img :src="slide.image" class="w-full h-46 object-cover rounded-2xl" />
      <div class="absolute left-4 bottom-4 top-6 flex-col flex justify-between">
        <div>
          <p class="text-xl font-extrabold text-white/80 mb-2">
            {{ t(slide.title) }}
          </p>

          <p class="text-gray-300/80 text-sm w-3/4 font-medium">
            {{ t(slide.description) }}
          </p>
        </div>

        <button
          @click="() => console.log('clicked')"
          class="cursor-pointer transition-transform duration-300 hover:scale-110 h-10 px-4 w-fit rounded-lg border-2 border-white/10 bg-gradient-to-b shadow-xl from-gray-100/10 to-gray-200/10"
        >
          {{ t(slide.button) }}
        </button>
      </div>
    </SwiperSlide>
  </Swiper>
</template>