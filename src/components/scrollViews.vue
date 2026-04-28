<script setup lang="ts">
import { drops_wins, hot, hot_rtp } from '@/utils';
import type {  gameType } from '@/utils/types';
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed } from 'vue';
import {  ref } from 'vue';
import { useI18n } from 'vue-i18n';
const {t} = useI18n();
const props = defineProps<{ action?: ()=>void, isTwo?: boolean, header?: string, 
  gameData?: gameType[], handler?: (gameData: gameType) => void, icon: string }>();
const topGameRef = ref<HTMLElement | null>(null)
const scrollTop = (dir: "left" | "right") => {
  if (!topGameRef.value) return;

  const amount = 200;
  topGameRef.value.scrollBy({
    left: dir === "left" ? -amount : amount,
    behavior: "smooth",
  });
};
const total = computed(() => props.gameData?.length ?? 0)
</script>

<template>
  <article class="w-full" id="TopGame">
    <div class="flex w-full items-center justify-between my-2">
      <div class="flex gap-1 items-center">
        <img :src="icon" class="w-10 h-10"/>
        <p class="font-bold text-gray-200 text-sm">{{ header }}</p>
      </div>
      <div class="flex gap-2 items-center">

        <!-- View More -->
        <button 
          v-on:click="action"
          class="text-xs px-2 h-7 rounded-sm
           bg-gray-800/80 border border-white/10
           text-gray-300 hover:text-white hover:bg-gray-700/80
           transition">
          {{t('view_more')}} ({{ total }})
        </button>

        <!-- Arrows -->
        <button @click="scrollTop('left')" class="bg-gray-700/50 border border-white/10 px-2 h-8 rounded-sm">
          <ChevronLeft class="w-5 h-5 text-gray-400" />
        </button>

        <button @click="scrollTop('right')" class="bg-gray-700/50 border border-white/10 px-2 h-8 rounded-sm">
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>

      </div>
    </div>
    <div ref="topGameRef" class="grid grid-flow-col gap-1.5
         overflow-x-auto no-scrollbar scroll-smooth
         backdrop-blur-2xl" :class="isTwo?'grid-rows-2':'grid-rows-1'">
      <div v-for="game in gameData" :key="game.id" class="rounded-md relative border border-white/20
           shadow-inner cursor-pointer group
         hover:-translate-y-1 transition-all active-button duration-300" @click="handler?.(game)">
        <div class="relative">

            <div class="glass absolute inset-0"></div>

          <div class="shine absolute inset-0"></div>
          <div class="absolute inset-0 bg-black/10 rounded-lg"></div>
          <!-- badges -->

          <div class="flex gap-1 absolute top-1 left-1 z-10">
            <img :src="hot" v-show="game.is_hot"/>
            <img :src="drops_wins" v-show="game.is_drop_win"/>
            <img :src="hot_rtp" v-show="game.is_hot_rtp"/>
          </div>

          <img :src="game.icon_url" class="min-w-22 max-w-32 h-36 object-cover rounded-md" />
        </div>
      </div>
    </div>
  </article>
</template>
