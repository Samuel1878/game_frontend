<script setup lang="ts">

import { discord, openChat, openDiscord, openTelegram, openViber, telegram, viber } from '@/utils';
import { Headset } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
const props = defineProps<{containerStyle:string}>()
 const {t} = useI18n();

</script>
<template>
    <section
        class="mt-6 p-4 mb-20 rounded-2xl glass-bg" :class="containerStyle">
        <p class="text-center font-semibold mb-4">
          {{ t("need_help") }}
        </p>

        <div class="flex justify-center gap-5">
          <!-- Support -->
          <div @click="openChat" class="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
            <Headset class="text-black" />
          </div>

          <!-- Socials -->
          <img :src="viber" @click="openViber"  class="w-10 h-10 hover:scale-110 transition cursor-pointer" />
          <img :src="telegram" @click="openTelegram" class="w-10 h-10 hover:scale-110 transition cursor-pointer" />
          <img :src="discord" @click="openDiscord" class="w-10 h-10 hover:scale-110 transition cursor-pointer" />
        </div>
      </section>
</template>