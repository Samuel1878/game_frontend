<script setup lang="ts">
import Footer from '@/components/footer.vue';
import GameOptions from '@/components/layout/gameOptions.vue';
import InputGroup from '@/components/ui/input-group/InputGroup.vue';
import InputGroupAddon from '@/components/ui/input-group/InputGroupAddon.vue';
import InputGroupInput from '@/components/ui/input-group/InputGroupInput.vue';
import { getGamesByProviderAPI } from '@/services/gameAPI';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import {  casino, hot, hot_rtp_icon, top_icon } from '@/utils';
import type {  gameType } from '@/utils/types';
import { useReturnRefresh } from '@/utils/useReturn';
import { refDebounced } from '@vueuse/core';
import { SearchIcon } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

import { useI18n } from 'vue-i18n';
const sortBy = ref("rank");
const topOnly = ref(false);
const { t ,locale} = useI18n();
const loading = ref(false);
const games = ref<gameType[] | null>(null);
const limit = 18;
const offset = ref(0);
const hasMore = ref(true);
const isLoadingMore = ref(false);
const searchQuery = ref("")
const debouncedSearch = refDebounced(searchQuery, 300)
const gameStore = useGameStore()
const authStore = useAuthStore()
const onClickGame = (game: gameType) => {
  gameStore.prepareGame(game);
};
const btnClass = (active: boolean) =>
  active
    ? "animate-pulse-scale"
    : "";
const fetchGames = async (reset = false) => {
  console.log("fetching game")

    if (reset) {
        offset.value = 0;
        hasMore.value = true;
    }
 let lang = locale.value==="cn" ?"zh_cn":"en"
    loading.value = reset;
    isLoadingMore.value = !reset;

    try {
        const res = await getGamesByProviderAPI({
            providerId: 0,
            newGameType: "204,101,102,103,104,107,108,105",
            limit: limit,
            offset: offset.value,
            lang: lang,
            search: debouncedSearch.value, 
            sortBy:sortBy.value,
            top:topOnly.value
        });

        const data = res.data;

        if (reset) {
            games.value = data;
        } else {
            games.value = [...(games.value || []), ...data];
        }

        // 🔥 detect end
        if (data.length < limit) {
            hasMore.value = false;
        }

    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
        isLoadingMore.value = false;
    }
};
const loadMore = async () => {
    if (!hasMore.value || isLoadingMore.value) return;

    offset.value += limit;
    await fetchGames(false);
};
watch(debouncedSearch, () => {
  fetchGames(true); // reset on search
});
onMounted(()=>fetchGames(true))
useReturnRefresh(() => {
    authStore.fetchUser();
})
</script>
<template>
    <main class="bg-gray-900 max-w-lg w-full flex justify-between flex-col">
        <div class="p-2">
            <div class="w-full flex gap-2 h-28 items-center justify-between 
            rounded-2xl bg-gray-800/10 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]
            ">
                <div class="px-4">
                    <img :src="casino" class="w-18 h-18" />
                </div>
                <div class="flex flex-col gap-4 justify-between flex-1">
                    <h1 class="text-white font-bold text-xl">
                        {{ t("game_title_casino") }}
                    </h1>
                    <p class="text-gray-400 font-medium text-md">
                        {{ t("game_description_casino") }}
                    </p>
                </div>

            </div>
        </div>
        <GameOptions current_page="casino" />
        <div class="px-2">
                <InputGroup class="border-gray-500/70 bg-gray-800/80 ring-gray-400/70 ring-0 rounded-full h-12">
                    <InputGroupInput v-model="searchQuery" :placeholder="t('search_game')" />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>
                    <div class="flex justify-between items-center pt-2 px-3">
            <div class="flex gap-1 items-center">
              
                <img :src="casino" class="w-8 h-8"/>
                <p class="">{{ t("casino") }}</p>
            </div>
            <div class="flex gap-4">
                <button
                    @click="sortBy = 'rank'; fetchGames(true)"
                    :class="btnClass(sortBy === 'rank')"
                >
                   <img :src="hot"/>
                </button>

                <button
                    @click="sortBy = 'rtp'; fetchGames(true)"
                    :class="btnClass(sortBy === 'rtp')"
                >
                    <img :src="hot_rtp_icon"/>
                </button>

                <button
                    @click="topOnly = !topOnly"
                    :class="btnClass(topOnly)"
                >
                   <img :src="top_icon"/>
                </button>
            </div>
        </div>
         <article class="px-2">

            <div class="grid grid-cols-3 md:flex flex-wrap gap-1.5 my-2">

                <button v-if="games" v-for="(game, index) in games" :key="game?.id ?? index" class="relative overflow-hidden rounded-lg border border-white/20 group
         hover:-translate-y-1 transition-all duration-300" @click="onClickGame(game)">
                    <!-- Glass reflection (auto slow) -->
                    <div class="glass absolute inset-0"></div>

                    <!-- Shine flash (on hover only) -->
                    <div class="shine absolute inset-0"></div>
                    <div class="absolute inset-0 bg-black/10 rounded-lg"></div>
                    <img :src="game.icon_url" class="min-w-22 h-36 rounded-lg object-cover
           transition-transform duration-300 group-hover:scale-105" />
                </button>

            </div>



        </article>
        <div class="flex justify-center my-4">
            <button v-if="hasMore" @click="loadMore"
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                <span v-if="!isLoadingMore">{{ t('view_more') }}</span>
                <span v-else>{{ t('loading') }}...</span>
            </button>
        </div>
        <Footer/>
    </main>
</template>