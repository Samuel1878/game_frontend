<script setup lang="ts">
import {  Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { homeSlide } from "@/consts";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

</script>

<template>
  <div class="w-full">
    <Swiper
      v-if="homeSlide?.length"
      :modules="[Pagination, Autoplay]"
      :slides-per-view="1"
      :space-between="10"
      :speed="800"
      :loop="true"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
    >
      <SwiperSlide
        v-for="slide in homeSlide"
        :key="slide.id"
        class="relative w-full"
      >
        <div class="h-46">
          <img
            :src="slide.image"
            class="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <!-- <div class="absolute left-4 bottom-4 top-6 flex flex-col justify-between">
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
            class="cursor-pointer transition-transform duration-300 hover:scale-110 h-10 px-4 w-fit rounded-lg border-2 border-white/10 bg-linear-to-b shadow-xl from-gray-100/10 to-gray-200/10"
          >
            {{ t(slide.button) }}
          </button>
        </div> -->
      </SwiperSlide>
    </Swiper>
  </div>
</template>