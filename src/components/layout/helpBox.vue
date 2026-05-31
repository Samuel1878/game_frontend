<script setup lang="ts">

import { openChat, openDiscord, openTelegram, openViber } from '@/utils';
import { Headset } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
const props = defineProps<{containerStyle:string}>()
 const {t} = useI18n();

</script>
<template>
    <section
        class="mt-6 p-4 mb-20 rounded-2xl info-bg" :class="containerStyle">
        <p class="text-center font-semibold mb-4 text-white">
          {{ t("need_help") }}
        </p>

        <div class="flex justify-center gap-5">
          <!-- Support -->
          <div @click="openChat" class="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
            <Headset class="text-black" />
          </div>

          <!-- Socials -->
          <img src="/socials/viber.webp" @click="openViber"  class="w-10 h-10 hover:scale-110 transition cursor-pointer" alt="viber"/>
          <img src="/socials/telegram.svg" @click="openTelegram" class="w-10 h-10 hover:scale-110 transition cursor-pointer" alt="telegram"/>
          <img src="/socials/discord.webp" @click="openDiscord" class="w-10 h-10 hover:scale-110 transition cursor-pointer" alt="discord"/>
        </div>
      </section>
</template>