<script setup lang="ts">
import Footer from "@/components/footer.vue";
import GameOptions from "@/components/layout/gameOptions.vue";
import { topBuffaloGames } from "@/consts/games";
import { useGameStat } from "@/lib/gameStat";
import { useAuthStore } from "@/stores/auth";
import { useGameStore } from "@/stores/game";
import { buffalo, slot } from "@/utils";
import { useReturnRefresh } from "@/utils/useReturn";
import { Diamond , Users} from "lucide-vue-next";
import { nextTick, onMounted } from "vue";

import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const authStore = useAuthStore();
const { prepareGame } = useGameStore();

const { stats: gameStats, startLive } = useGameStat();

onMounted(async () => {
  await nextTick();
  startLive(topBuffaloGames || []);
});
useReturnRefresh(async () => {
  await authStore.init();
});
</script>
<template>
  <main class="bg-gray-900 max-w-6xl w-full flex justify-between flex-col">
    <div class="p-2">
      <div
        class="w-full flex gap-2 h-28 items-center justify-between rounded-2xl bg-gray-800/10 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      >
        <div class="px-4">
          <img :src="buffalo" class="w-18 h-18" />
        </div>
        <div class="flex flex-col gap-4 justify-between flex-1">
          <h1 class="text-white font-bold text-xl">
            {{ t("game_title_buffalo") }}
          </h1>
          <p class="text-gray-400 font-medium text-md">
            {{ t("game_description_buffalo") }}
          </p>
        </div>
      </div>
    </div>
    <GameOptions current_page="buffalo" />
    <div class="flex gap-1 items-center my-2">
        <img :src="slot" class="w-8 h-8" />
        <p class="text-white text-lg font-bold">{{ t("buffalo") }}</p>
     </div>
    <article class="px-2">
      <div
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 my-2"
      >
        <button
          v-if="topBuffaloGames"
          v-for="(game, index) in topBuffaloGames"
          :key="game?.id ?? index"
           class="relative overflow-hidden rounded-lg hover:border-white/30 group transition-all duration-300 bg-gray-900"
          @click="prepareGame(game)"
        >
            <div class="absolute inset-0 bg-black/20 z-0 group-hover:bg-black/0 transition-colors"/>
            <div class="relative overflow-hidden rounded-lg">
                <div
                class="pointer-events-none absolute inset-0 rounded-md bg-white/5 bg-linear-to-b from-white/0 via-white/10 to-gray-950"
                />
                <div
                class="pointer-events-none absolute inset-0 rounded-md border-shine"
                />
          <!-- RTP + USERS -->
                <div class="absolute top-1 left-1 z-20 flex flex-col gap-0.5">
                    <div
                    v-if="gameStats[game.id]"
                    class="flex items-center gap-2 px-1 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
                    >
                        <Diamond class="w-2 h-2 text-blue-500" />
                        <span class="text-[8px] text-white font-bold">
                            {{ gameStats[game.id]?.rtp }}
                        </span>
                    </div>

                    <div
                    v-if="gameStats[game.id]"
                    class="flex items-center w-fit gap-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm"
                    >
                        <Users class="w-2 h-2 text-green-500" />
                        <span class="text-[8px] text-white font-bold">
                            {{ gameStats[game.id]?.users }}
                        </span>
                    </div>
                </div>
                <img
                    :src="locale === 'cn' ? game.cn_icon_url : game.icon_url"
                    class="w-full aspect-3/4 rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div
                class="absolute bottom-0 left-0 right-0 p-1.5 z-20 bg-linear-to-t from-black/80 to-transparent"
                >
                    <p
                        class="text-[10px] md:text-xs text-white font-medium truncate text-center"
                    >
                    {{ locale === "cn" ? game.cn_name : game.name }}
                    </p>
                </div>
            </div>
        </button>
      </div>
    </article>

    <Footer />
  </main>
</template>
<style scoped>
@supports not (aspect-ratio: 3/4) {
  img {
    height: 150px;
  }
}
</style>

