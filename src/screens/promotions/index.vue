<script setup lang="ts">
import Footer from '@/components/footer.vue';
import { homeSlide } from '@/consts';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
    <main class="bg-gray-900 max-w-lg w-full flex justify-between flex-col">
        <div class="w-full">
            <h1 class="text-center font-extrabold text-xl">
                {{ t("promotions") }}
            </h1>
            <div v-if="homeSlide?.length" class="p-2 flex flex-col gap-2 w-full">
                <div class="w-full relative" v-for="slide in homeSlide" :key="slide.id">
                    <img :src="slide.image" class="w-full h-60 object-fit rounded-2xl" />
                    <div class="absolute left-4 bottom-4 top-15 flex-col flex justify-between">
                        <div>
                            <p class="text-2xl font-extrabold text-white/80 mb-2">
                                {{ t(slide.title) }}
                            </p>
                            <p class="text-gray-300 text-md w-3/4 font-thin">
                                {{ t(slide.description) }}
                            </p>
                            <button
          @click="() => console.log('clicked')"
          class="cursor-pointer self-center transition-transform duration-300 hover:scale-110 h-10 px-4 w-fit rounded-lg border-2 border-white/10 bg-linear-to-b shadow-xl from-gray-100/10 to-gray-200/10"
        >
          {{ t(slide.button) }}
        </button>
                        </div>
                        
                    </div>
                    <div>
                        <p class="text-lg text-white font-bold">{{ t(slide.description) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <Footer />
</template>