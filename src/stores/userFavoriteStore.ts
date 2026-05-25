// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import api from '@/services/api';
// import type { FavoriteGames, gameType } from '@/utils/types';

// export const useFavoritesStore = defineStore('favorites', () => {
//   const favoriteKeys = ref<Set<string>>(new Set());
//   const isLoading = ref(false);

//   const isFavorite = (providerId: number, gameId: number) => 
//     favoriteKeys.value.has(`${providerId}-${gameId}`);

//   const syncFavorites = async () => {
//     isLoading.value = true;
//     try {
//       const res = await api.get(`/user/game/favorites`);
//       if (res.data) {
//         console.log(res.data)
//         const data: FavoriteGames[] = res.data?.data;
//         favoriteKeys.value = new Set(data.map(g => `${g.provider_id}-${g.game_id}`));
//       }
//     } catch(error){
//       console.log(error)
//     }
//      finally {
//       isLoading.value = false;
//     }
//   };

//   const toggleFavorite = async (game: gameType) => {
//     const key = `${game.provider_id}-${game.game_id}`;
//     // 1. Save previous state for potential rollback
//     const wasFavorite = favoriteKeys.value.has(key);
//     // 2. Optimistic UI Update
//     if (wasFavorite) {
//       favoriteKeys.value.delete(key);
//     } else {
//       favoriteKeys.value.add(key);
//     }
//     try {
//       const response = await api.post("/user/game/toggle-favorite", {
//         game_id: game.game_id, 
//         provider_id: game.provider_id
//       });
//       if (!response.data?.success) {
//         throw new Error("Toggle failed");
//       }
//       return
//     } catch (error) {
//       console.error("Favorite toggle error:", error);
//       // Rollback on error
//       if (wasFavorite) {
//         favoriteKeys.value.add(key);
//       } else {
//         favoriteKeys.value.delete(key);
//       }
//     }
//   };

//   return { favoriteKeys, isFavorite, toggleFavorite, syncFavorites };
// });