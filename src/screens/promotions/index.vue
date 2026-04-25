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
                    
                </div>
            </div>
        </div>
    </main>
    <Footer />
</template>