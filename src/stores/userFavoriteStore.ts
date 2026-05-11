import api from "@/services/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";

export const useFavoriteStore = defineStore("favorite", () => {
  const favoriteGameIds = ref<number[]>([]);
  const authStore = useAuthStore();
  const loading = ref(false);
  const isFavorite = computed(() => {
    return (gameId: number) =>
      favoriteGameIds.value.includes(gameId);
  });
  const fetchFavorites = async () => {
    loading.value = true;
    try {
      const res = await api.get(`/user/game/favorite/${authStore.user?.id}`);
      favoriteGameIds.value = res.data.map((g: any) => g.id);
    } finally {
      loading.value = false;
    }
  };

  const toggleFavorite = async (game: any) => {
    const exists = favoriteGameIds.value.includes(game.id);
    if (exists) {
      favoriteGameIds.value = favoriteGameIds.value.filter(
        (id) => id !== game.id
      );
      await api.delete(`/user/game/favorites/${game.id}`);
    } else {
      favoriteGameIds.value.push(game.id);

      await api.post("/user/game/favorites/", {
        game_id: game.id,
        provider_id: game.provider_id,
      });
    }
  };

  return {
    favoriteGameIds,
    loading,
    isFavorite,
    fetchFavorites,
    toggleFavorite,
  };
});