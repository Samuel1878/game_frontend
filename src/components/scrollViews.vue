<script setup lang="ts">
import {  getGameIcon } from '@/utils';
import type { Game } from '@/utils/types';
import {  ChevronLeft, ChevronRight } from "lucide-vue-next";
import { ref } from 'vue';

const props = defineProps<{ label?:string, labelStyle?:string, header?: string, gameData?: Game[], handler?: (gameData:Game) => void , icon?:string}>();
const topGameRef = ref<HTMLElement | null>(null)
const scrollTop = (dir: "left" | "right") => {
  if (!topGameRef.value) return;

  const amount = 200;
  topGameRef.value.scrollBy({
    left: dir === "left" ? -amount : amount,
    behavior: "smooth",
  });
};
</script>

<template>
  <article class="w-full" id="TopGame">
    <div class="flex w-full items-center justify-between my-2">
      <div class="flex gap-1 items-center">
        <img :src="icon"/>
        <p class="font-bold text-gray-200 text-sm">{{ header }}</p>
      </div>
      <div class="flex gap-1">
        <!-- <RouterLink to="/games"  class="font-normal bg-gray-800 shadow-gray-700/50 shadow-inner px-2 rounded-sm text-center text-xs h-6 flex justify-center items-center">
        {{ t("view_more") }}
        </RouterLink> -->
        <button @click="scrollTop('left')"
          class="bg-gray-700/50 border-white/10 border hover:bg-gray-700/80 shadow-white/10 px-2 h-8 rounded-sm transition">
          <ChevronLeft class="w-5 h-5 text-gray-400" />
        </button>
        <button @click="scrollTop('right')"
          class="bg-gray-700/50 hover:bg-gray-700/80 border-white/10 border px-2 h-8 rounded-sm shadow-white/10 transition">
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
    <div class="flex backdrop-blur-2xl gap-1.5 items-center w-full overflow-x-auto no-scrollbar scroll-smooth"
      ref="topGameRef">
      <div v-for="game in gameData" class="rounded-md relative 
        shadow-inner border border-white/20"  @click="handler?.(game)">
        <div class="">
          <!-- <img v-show="label" :src="label" :class="labelStyle" class="absolute top-1 left-1"/> -->
            <div v-if="game.badge" class="flex gap-1 absolute top-1 left-1">
            <img v-show="game?.badge" class="" :src="game?.badge"/>
               <img v-show="game?.badge_1" class="" :src="game?.badge_1"/>

            </div>
          
            
            <img :src="getGameIcon(game)" alt="game thumbnail" class="min-w-22 w-auto max-w-32 h-36 object-fit rounded-md" />
        
        </div>
      </div>
    </div>
  </article>
</template>
