<script setup lang="ts">
import type { Game } from '@/utils/types';
import { ArrowLeft, ArrowRight } from "lucide-vue-next";
import { ref, type Component } from 'vue';

const props = defineProps<{ header?: string, gameData?: Game[], handler?: (gameData:Game) => void , icon?:Component}>();
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
  <article class="w-full space-y-2" id="TopGame">
    <div class="flex w-full items-center justify-between my-2">
      <div class="flex gap-1 items-center">
        <component :is="icon" class="text-sky-500" :size="16" />
        <p class="font-bold text-slate-200 text-sm">{{ header }}</p>
      </div>
      <div class="flex gap-1">
        <p class="font-normal bg-slate-800 px-2 rounded-sm text-center text-sm h-8 flex justify-center items-center">
          View More
        </p>
        <button @click="scrollTop('left')"
          class="bg-slate-800 hover:bg-slate-700/80 px-2 h-8 rounded-sm shadow-lg transition">
          <ArrowLeft class="w-5 h-5 text-sky-400" />
        </button>
        <button @click="scrollTop('right')"
          class="bg-slate-800 hover:bg-slate-700/80 px-2 h-8 rounded-sm shadow-lg transition">
          <ArrowRight class="w-5 h-5 text-sky-400" />
        </button>
      </div>
    </div>
    <div class="flex bg-slate-950 gap-1 items-center w-full overflow-x-auto no-scrollbar scroll-smooth"
      ref="topGameRef">
      <div v-for="game in gameData" class="rounded-xl" @click="handler?.(game)">
        <div v-if="
          game?.gameInfos.filter((e) => e.language === 'en')[0]
            ?.gameIconUrl
        ">
          <img :src="game?.gameInfos.filter((e) => e.language === 'en')[0]
              ?.gameIconUrl
            " alt="game thumbnail" class="min-w-26 w-auto max-w-32 h-45 object-fit rounded-xl" />
        </div>
        <div v-else class="min-w-22 w-auto max-w-32 h-45 object-fit rounded-xl">
          <img :src="game?.gameInfos.filter(
            (e) => e.language === 'zh_cn',
          )[0]?.gameIconUrl
            " alt="game thumbnail CN" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </article>
</template>
