<script setup lang="ts">
import { useFakeGameStatsWithId } from "@/lib/fakeGameStatHook";
import { useGameStore } from "@/stores/game";
import type { gameType } from "@/utils/types";
import { Diamond, Users } from "lucide-vue-next";
import { watch } from "vue";
const props = defineProps<{
  gameData: gameType[];
}>();
// console.log("gameView Mounting")
const gameStore = useGameStore();
const onClickGame = (game: gameType) => {
  gameStore.prepareGame(game);
};
const { stats, registerKeys } = useFakeGameStatsWithId();

watch(
  () => props.gameData,
  (list) => {
    if (!list?.length) return;

    registerKeys(list.map((g) => `${g.provider_id}-${g.game_id}`));
  },
  { immediate: true },
);
const key = (game: any) => `${game.provider_id}-${game.game_id}`;
</script>
<template>
  <article class="px-2">
    <div
      class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2"
    >
      <button
        v-for="(game, index) in props.gameData"
        :key="game?.id ?? index"
        class="relative overflow-hidden rounded-lg aspect-3/3.5"
        @click="onClickGame(game)"
      >
        <div
          class="pointer-events-none absolute bottom-0 inset-x-0 h-1/4 bg-linear-to-t from-black/60 via-white/10 to-transparent z-10"
        />
        <div
          class="pointer-events-none absolute bottom-0 transform-gpu backface-hidden inset-x-0 h-full backdrop-saturate-100 z-10"
        />
        <div class="absolute top-1 left-1 z-20 flex flex-col gap-1">
          <div
            v-if="stats[key(game)]"
            class="flex items-center gap-1 px-1 py-0.5 rounded-full bg-gray-800/70 border border-gray-500/20 shadow-lg"
          >
            <Diamond
              class="w-2 h-2 text-blue-400 fill-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"
            />
            <span class="text-[7px] text-white/95 font-bold tracking-wide">
              <span class="text-blue-400 font-extrabold">RTP</span>
              {{ stats[key(game)]?.rtp }}
            </span>
          </div>

          <div
            v-if="stats[key(game)]"
            class="flex items-center w-fit gap-1 px-1 py-0.5 rounded-full bg-gray-800/70 border border-gray-500/20 shadow-lg"
          >
            <Users
              class="w-2 h-2 text-green-400 fill-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"
            />
            <span class="text-[7px] text-white/95 font-bold tracking-wide">
              {{ stats[key(game)]?.users }}
            </span>
          </div>
        </div>
        <img
          :src="game.icon_url"
          class="w-full h-full rounded-lg object-cover"
          loading="lazy"
          decoding="async"
          :alt="game.name"
        />
        <div
          class="absolute bottom-0 left-0 right-0 px-3 z-20"
        >
          <p
            class="font-extrabold text-white text-[8px] text-center truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
          >
            {{ game.name }}
          </p>
        </div>
        <!-- </div> -->
      </button>
    </div>
  </article>
</template>
<!-- <style scoped>
@supports not (aspect-ratio: 3/4) {
  img {
    height: 150px;
  }
}
</style> -->
