<!-- 
<script setup lang="ts">
import { Heart } from "lucide-vue-next";
import { useFavoritesStore } from "@/stores/userFavoriteStore";
import { useAuthStore } from "@/stores/auth";
import type { gameType } from "@/utils/types";

const props = defineProps<{ game: gameType }>();
const favStore = useFavoritesStore();
const auth = useAuthStore();

const toggle = (e: Event) => {

  e.stopPropagation(); // Don't trigger the game click
  if (!auth.user) return; // Open Auth Modal logic here
  favStore.toggleFavorite(props.game);
};

</script>

<template>
  <button 
    @click="toggle"
    class="absolute top-1 right-1 z-20 p-1 bg-black/20 backdrop-blur-md rounded-full transition-transform hover:scale-110"
  >
    <Heart 
      class="w-4 h-4 transition-colors"
      :class="favStore.isFavorite(game.provider_id, game.game_id) ? 'fill-red-500 text-red-500' : 'text-white'"
    />
  </button>
</template>
  -->