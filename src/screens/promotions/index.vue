<script setup lang="ts">
import Footer from '@/components/footer.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import { homeSlide } from '@/consts';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { computed } from "vue";

const currentImage = computed(() => {
    return image.find((img) => img.id === view.value)?.url || "";
});
const { t, locale } = useI18n();
const view = ref(0);
const open = ref(false);
const image = [
    {
        id: 1,
        url: "/images/vip_bonus.jpg"
    },
    {
        id: 2,
        url: "/images/welcome_bonus.jpg"
    },
    {
        id:3,
        url:"/images/deposit_bonus.jpg"
    },
    {
        id:4,
        url:"/images/lost_cashback.jpg"
    }
]
const openDialog = (id: number) => {
    open.value = true;
    view.value = id
}

import { X } from 'lucide-vue-next';

// onMounted(() => {
//   setTimeout(() => {
//     openDialog(1);
//   }, 500);
// });
</script>

<template>
    <main class="bg-gray-900 max-w-lg w-full flex justify-between flex-col">
        <div class="w-full">
            <h1 class="text-center font-extrabold text-2xl mt-2 text-white">
                {{ t("promotions") }}
            </h1>
            <div class="p-2 flex flex-col gap-2 w-full">
                <div class="w-full relative border-2 border-yellow-400 rounded-2xl cursor-pointer" @click="openDialog(1)">
                    <img :src="locale === 'cn' ? homeSlide[0]?.cn_image : homeSlide[0]?.image"
                        class="w-full object-fit rounded-2xl" />
                </div>
                <div class="w-full relative cursor-pointer border-2 border-yellow-400 rounded-2xl" @click="openDialog(2)">
                    <img :src="locale === 'cn' ? homeSlide[1]?.cn_image : homeSlide[1]?.image"
                        class="w-full object-fit rounded-2xl" />
                </div>
                  <div class="w-full relative cursor-pointer border-2 border-yellow-400 rounded-2xl" @click="openDialog(3)">
                <img :src="locale === 'cn' ? homeSlide[2]?.cn_image : homeSlide[2]?.image"
                        class="w-full object-fit rounded-2xl" />
                </div>
                  <div class="w-full relative cursor-pointer border-2 border-yellow-400 rounded-2xl" @click="openDialog(4)">
                    <img :src="locale === 'cn' ? homeSlide[3]?.cn_image : homeSlide[3]?.image"
                        class="w-full object-fit rounded-2xl" />
                </div>
            </div>
        </div>

    </main>
    <Footer />
    <Dialog v-model:open="open">
        <DialogContent
            class="bg-black/90 border-0 p-0 flex items-center justify-center max-w-lg w-full overflow-hidden">
            <!-- close -->
            <button class="absolute top-3 right-3 text-white z-10" @click="open = false">
                <X class="w-10 h-10 text-gray-50"/>
            </button>

            <!-- image -->
            <img :src="currentImage" class="w-full max-h-[80vh] object-contain" />
        </DialogContent>
    </Dialog>
</template>