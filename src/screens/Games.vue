<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth';
import { gameStore } from '@/stores/game';
import type{ Game } from '@/utils/types';
import { ref, watchEffect } from 'vue';
import { toast } from 'vue-sonner';
import {useUIStore} from '@/stores/ui';
import { useWallet } from '@/stores/wallet';

const games = ref<Game[] | null>(null);
const ui = useUIStore();
const authStore = useAuthStore();
const useGameStore = gameStore();
// const wallet = useWallet();
// wallet.setWallet(authStore.user?.name ?? null)
const wallet = useWallet();
watchEffect(()=>{
wallet.setWallet(authStore.user?.name ?? null)
})

// watchEffect(async () => {
//   const response = await getGameListAPI();
//   console.log("response", response)
//   if (response) games.value = response.seamlessGameProviderGames;
// });


const enterGame = (game: Game) => {
  if (!game) return;  
  else if (!authStore.isLoggedIn || !authStore.user) {
    toast("Please login to enter the game");
    ui.openAuthModal("/"); 
    return;
  }
  console.log("entering game", game);
  
  useGameStore.setGames(game)
} 
</script>
<template>
    <main class="bg-gray-900 pt-4">
      <div v-if="games" class="flex items-center w-full flex-col lg:grid">
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">     
            <a v-for="game in games" :key="game?.gameID" class="w-30 sm:35  cursor-pointer" @click="enterGame(game)" :href="`${authStore.url}&gpid=${game.gameProviderId}&gameid=${game.gameID}&lang=en&device=m&betCode=`" >
              <div class="h-45 rounded-2xl bg-gray-800 overflow-hidden">
                <img :src="game?.gameInfos.filter((e)=>e.language === 'en')[0]?.gameIconUrl" alt="game thumbnail" class="w-full h-full object-cover"/>
              </div>
              <p class="text-white text-center mt-2 font-bold">{{ game?.gameInfos.filter((e)=>e.language === 'en')[0]?.gameName  }}  </p>

            </a>
          </div>
      </div>
      <div v-else class="flex items-center flex-col lg:grid">
        <div
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4"
        >
          <div
            id="skeleton"
            class="w-full"
            v-for="(_, index) in 25"
            :key="index"
          >
            <Skeleton class="w-30 sm:35 h-45 rounded-2xl bg-gray-800" />
          </div>
        </div>
      </div>
    </main>
</template>