<script setup lang="ts">
import { drops_wins, hot, hot_rtp } from '@/utils';
import type { gameType } from '@/utils/types';
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
const props = defineProps<{
  action?: () => void, isTwo?: boolean, header?: string,
  gameData?: gameType[], handler?: (gameData: gameType) => void, icon: string
}>();
const topGameRef = ref<HTMLElement | null>(null)
const scrollTop = (dir: "left" | "right") => {
  if (!topGameRef.value) return;

  const container = topGameRef.value;

  // scroll by container width (responsive)
  const amount = container.clientWidth * 0.8;

  container.scrollBy({
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
        <img :src="icon" class="w-8 h-8" />
        <p class="font-bold text-gray-200 text-shadow-sm text-sm">{{ header }}</p>
      </div>
      <div class="flex gap-2 items-center">

        <!-- View More -->
        <button v-on:click="action" class="text-xs px-2 h-7 rounded-sm
             overflow-hidden relative cursor-pointer
           bg-gray-800/80 border border-white/10
           text-gray-300 hover:text-white hover:bg-gray-700/80
           transition">
          {{ t('view_more') }} ({{ total }})
        </button>

        <!-- Arrows -->
        <button @click="scrollTop('left')" class="bg-gray-700/50 border border-white/10 px-2 h-7 rounded-sm">
          <ChevronLeft class="w-5 h-5 text-gray-400" />
        </button>

        <button @click="scrollTop('right')" class="bg-gray-700/50 border border-white/10 px-2 h-7 rounded-sm">
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>

      </div>
    </div>

    <div ref="topGameRef" 
      class="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
      <div v-for="game in gameData" :key="game.id" 
         class="relative border-2 border-amber-400 rounded-lg
          shadow-inner cursor-pointer group 
         hover:-translate-y-1 transition-all active-button duration-300" 
         @click="handler?.(game)">

        <div class="relative overflow-hidden">
          <div
            class="pointer-events-none absolute inset-0 rounded-md bg-white/5 bg-linear-to-b from-white/0 via-white/5 to-yellow-400/30">
          </div>
          <div class="pointer-events-none absolute inset-0 rounded-md border-shine"></div>
          <!-- <p style="font-size: 10px; font-weight: 900;" class="absolute bottom-0 text-shadow-xs left-0 right-0 text-center font-extrabold text-white">{{ game.name }}</p> -->
          <div class="flex gap-1 absolute top-1 left-1 z-10">
            <img :src="hot" v-show="game.is_hot" class="w-4 h-4" />
            <img :src="drops_wins" v-show="game.is_drop_win" class="h-4" />
            <img :src="hot_rtp" v-show="game.is_hot_rtp" class="h-4" />
          </div>

          <img :src="locale==='cn'?game.cn_icon_url :game.icon_url" class="min-w-30 max-w-30 h-32 object-cover rounded-md" />
        </div>
      </div>
    </div>
  </article>
</template>
