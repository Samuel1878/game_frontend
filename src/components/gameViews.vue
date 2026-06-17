<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import type { gameType } from "@/utils/types";
import { GAME_IMAGE_FALLBACK, gameKey, gameProviderName, localizedGameImage, localizedGameName } from "@/utils/game";
import { useI18n } from "vue-i18n";
const props = defineProps<{
  gameData: gameType[];
}>();
const gameStore = useGameStore();
const { locale, t } = useI18n();
const onClickGame = (game: gameType) => {
  gameStore.prepareGame(game);
};
const onDemo = (event: Event, game: gameType) => {
  event.stopPropagation();
  void gameStore.launchDemoGame(game);
};
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = GAME_IMAGE_FALLBACK;
};
</script>
<template>
  <article class="px-2">
    <div
      class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2"
    >
      <button
        v-for="(game, index) in props.gameData"
        :key="gameKey(game) || index"
        class="relative overflow-hidden rounded-lg aspect-square"
        @click="onClickGame(game)"
      >
        <div
          class="pointer-events-none absolute bottom-0 inset-x-0 h-1/4 bg-linear-to-t from-black/60 via-black/10 to-transparent z-10"
        />
        <div
          class="pointer-events-none absolute bottom-0 transform-gpu backface-hidden inset-x-0 h-full backdrop-saturate-100 z-10"
        />
        <div class="absolute top-1 left-1 z-20 flex flex-col gap-1">
          <div
            class="max-w-24 truncate px-1.5 py-0.5 rounded-full bg-gray-800/80 border border-gray-500/20 shadow-lg text-[7px] text-white/95 font-bold"
          >
            {{ gameProviderName(game) }}
          </div>

          <div
            v-if="game.is_hot || game.is_top_pick || game.is_high_rtp"
            class="w-fit px-1.5 py-0.5 rounded-full bg-yellow-400/90 text-[7px] text-black font-black shadow-lg"
          >
            {{ game.is_hot ? t("hot_games") : game.is_top_pick ? t("top_picks") : t("featured_games") }}
          </div>
        </div>
        <button
          v-if="game.supports_demo"
          type="button"
          class="absolute top-1 right-1 z-30 px-1.5 py-0.5 rounded-full bg-white/90 text-[8px] font-black text-gray-900"
          @click="onDemo($event, game)"
        >
          {{ t("demo") }}
        </button>
        <img
          :src="localizedGameImage(game, locale)"
          class="w-full h-full rounded-lg object-cover"
          loading="lazy"
          decoding="async"
          :alt="localizedGameName(game, locale)"
          @error="onImageError"
        />
        <div
          class="absolute bottom-0 left-0 right-0 px-3 z-20"
        >
          <p
            class="font-extrabold text-white text-[10px] text-center truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide"
          >
            {{ localizedGameName(game, locale) }}
          </p>
          <p class="text-[7px] text-gray-300 text-center truncate">
            {{ game.category || game.game_type }}
          </p>
        </div>
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
