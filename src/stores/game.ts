import type { Game } from "@/utils/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const gameStore = defineStore('game', () => {
  const games = ref<Game | null>(null);

    const setGames = computed(() => (gameList: Game) => {
      games.value = gameList;
    })
    const resetGames = computed(() => () => {
      games.value = null;
    })
  return {
    setGames,
    games,
    resetGames
  }
})