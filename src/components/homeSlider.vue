<script setup lang="ts">
import { homeSlide } from '@/consts'
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
const current = ref(0)
let interval: any = null
const {t} = useI18n()
const startAutoPlay = () => {
  interval = setInterval(() => {
    current.value = (current.value + 1) % homeSlide.length
  }, 3000)
}

const stopAutoPlay = () => {
  if (interval) clearInterval(interval)
}

const goTo = (index: number) => {
  current.value = index
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div
    class="relative w-full max-w-xl mx-auto overflow-hidden rounded-2xl shadow-lg"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <!-- Slides -->
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${current * 100}%)` }"
    >
      <!-- :style="{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }" -->
      <div
        v-for="slide in homeSlide"
        :key="slide.id"
      
        class="min-w-full relative z-40 h-50"
      >
        <img :src="slide.image" class="w-full h-50 object-cover"/>
                  <div class="absolute left-4 bottom-4 top-6 flex-col flex justify-between">
                    <div>
                <p class="text-xl font-extrabold text-white/80 mb-2">{{ t(slide.title )}}</p>
                    <p class="text-gray-300/80 text-sm w-3/4 text-wrap font-medium font-sans">{{ t(slide.description) }}</p>
                    </div>
               
                    <button @cliick="" class="cursor-pointer hover:scale-z-120 h-10 px-4 w-fit rounded-lg border-2 border-white/10 bg-linear-to-b shadow-xl to-gray-200/10 from-gray-100/10">
                    {{t(slide.button)  }}
                    </button>
                  </div>
       
      </div>
    </div>

    <!-- Dots -->
    <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
      <button
        v-for="(_, index) in homeSlide"
        :key="index"
        @click="goTo(index)"
        class="w-2 h-2 rounded-full transition-all"
        :class="current === index ? 'bg-gray-300 w-8' : 'bg-gray-300 w-2'"
      />
    </div>
  </div>
</template>