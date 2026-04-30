<script setup lang="ts">
import Footer from '@/components/footer.vue';
import GameOptions from '@/components/layout/gameOptions.vue';
import {  getGamesByProviderAPI } from '@/services/gameAPI';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import {  fish, hot, hot_rtp_icon, top_icon } from '@/utils';
import type { gameType } from '@/utils/types';
import { useReturnRefresh } from '@/utils/useReturn';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t ,locale} = useI18n();
const loading = ref(false);
const games = ref<gameType[] | null>(null);
// const providerId = ref<number>(0);
const limit = 18;
const offset = ref(0);
const hasMore = ref(true);
const isLoadingMore = ref(false);
const sortBy = ref("rank");
const topOnly = ref(false);
const gameStore = useGameStore();
const authStore = useAuthStore()
const onClickGame = (game: gameType) => {
  gameStore.prepareGame(game);
};
const fetchGames = async (reset = false) => {

    if (reset) {
        offset.value = 0;
        hasMore.value = true;
    }

    loading.value = reset;
    isLoadingMore.value = !reset;
    let lang = locale.value==="cn" ?"zh_cn":"en"
    try {
        const res = await getGamesByProviderAPI({
            providerId: 0,
            newGameType: 203,
            limit: limit,
            offset: offset.value,
            lang: lang,
            sortBy:sortBy.value,
            top:topOnly.value
            //   search: debouncedSearch.value, // 🔥 add this backend support
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
onMounted(()=>fetchGames(true))
const loadMore = async () => {
    if (!hasMore.value || isLoadingMore.value) return;

    offset.value += limit;
    await fetchGames(false);
};
const btnClass = (active: boolean) =>
  active
    ? "animate-pulse-scale"
    : "";
useReturnRefresh(async() => {
    authStore.init();
})
</script>
<template>
    <main class="bg-gray-900 max-w-lg w-full flex justify-between flex-col">
        <div class="p-2">
            <div class="w-full flex gap-2 h-28 items-center justify-between 
            rounded-2xl bg-gray-800/10 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]
            ">
                <div class="px-4">
                    <img :src="fish" class="w-18 h-18" />
                </div>
                <div class="flex flex-col gap-4 justify-between flex-1">
                    <h1 class="text-white font-bold text-xl">
                        {{ t("game_title_fish") }}
                    </h1>
                    <p class="text-gray-400 font-medium text-md">
                        {{ t("game_description_fish") }}
                    </p>
                </div>

            </div>
        </div>
        <GameOptions current_page="fishing" />
         <div class="flex justify-between items-center pt-2 px-3">
            <div class="flex gap-1 items-center">
              
                <img :src="fish" class="w-8 h-8"/>
                <p>{{ t('fishing') }}</p>
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
            <button
                v-if="hasMore"
                @click="loadMore"
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
                <span v-if="!isLoadingMore">{{ t('view_more') }}</span>
                <span v-else>{{ t('loading') }}...</span>
            </button>
        </div>
        <Footer/>
    </main>
</template>