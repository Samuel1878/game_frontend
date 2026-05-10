<script setup lang="ts">
import { useFakeGameStatsWithId } from "@/lib/fakeGameStatHook";
import { useGameStore } from "@/stores/game";
import type { gameType } from "@/utils/types"
import { Diamond, Users } from "lucide-vue-next";
import { watch } from "vue";

const props = defineProps<{
  gameData: gameType[]
}>();
console.log("gameView Mounting")
const gameStore = useGameStore()
const onClickGame = (game: gameType) => {
  gameStore.prepareGame(game);
};
const { stats, registerKeys } = useFakeGameStatsWithId();

watch(
  props.gameData,
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
          class="relative overflow-hidden rounded-lg hover:border-white/30 group transition-all duration-300 bg-gray-900"
          @click="onClickGame(game)"
        >
            <div
                class="absolute inset-0 bg-black/20 z-0 group-hover:bg-black/0 transition-colors"
            />
            <div class="relative overflow-hidden rounded-lg">
                <div
                class="pointer-events-none absolute inset-0 rounded-md bg-white/5 bg-linear-to-b from-white/0 via-white/10 to-gray-950"
                />
                <div
                class="pointer-events-none absolute inset-0 rounded-md border-shine"
                />
                <div class="absolute top-1 left-1 z-20 flex flex-col gap-0.5">
                    <div
                        v-if="stats[key(game)]"
                        class="flex items-center gap-2 px-1 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
                    >
                        <Diamond class="w-2 h-2 text-blue-500" />
                        <span class="text-[8px] text-white font-bold">
                        {{ stats[`${game.provider_id}-${game.game_id}`]?.rtp }}
                        </span>
                    </div>

                    <div
                        v-if="stats[key(game)]"
                        class="flex items-center w-fit gap-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
                    >
                        <Users class="w-2 h-2 text-green-500" />
                        <span class="text-[8px] text-white font-bold">
                        {{ stats[`${game.provider_id}-${game.game_id}`]?.users }}
                        </span>
                    </div>
                </div>
                <img
                :src="game.icon_url"
                class="w-full aspect-3/4 rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                />
                <div
                class="absolute bottom-0 left-0 right-0 p-1.5 z-20 bg-linear-to-t from-black/80 to-transparent"
                >
                    <p
                        class="text-[10px] md:text-xs text-white font-medium truncate text-center"
                    >
                        {{ game.name }}
                    </p>
                </div>
            </div>
        </button>
      </div>
    </article>
</template>
<style scoped>
@supports not (aspect-ratio: 3/4) {
  img {
    height: 150px;
  }
}
</style>


