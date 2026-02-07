<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import { getGameListAPI } from '@/services/gameAPI';
import type{ Game } from '@/utils/types';
import { ref, watchEffect } from 'vue';
let games = ref<Game[]>([]);
watchEffect(async () => {
  const response = await getGameListAPI();
  console.log("response", response)
  if (response) games.value = response.seamlessGameProviderGames;
});
</script>
<template>
    <main class="bg-gray-900 pt-4">
      <div class="w-full" v-if="games.values?.length">
        <div v-for="game in games" :key="game?.gameID">
          {{ game }}
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