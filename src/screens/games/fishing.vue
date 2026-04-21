<script setup lang="ts">
import Footer from '@/components/footer.vue';
import GameViews from '@/components/gameViews.vue';
import GameOptions from '@/components/layout/gameOptions.vue';
import { africanBuffaloSlots } from '@/consts/afbGames';
import { enterGameAPI } from '@/services/gameAPI';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import {  fish } from '@/utils';
import type { Game } from '@/utils/types';
import { useReturnRefresh } from '@/utils/useReturn';
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';
const { t } = useI18n();
const ui = useUIStore();
const loading = ref(false);
const authStore = useAuthStore();


const enterGame = async (game: Game) => {
    loading.value = true
    if (!game) return loading.value = false;

    if (!authStore.accessToken || !authStore.user) {
        loading.value = false

        toast.warning("Please login to enter the game");

        ui.openAuthModal("/");
        return;
    }

    try {
        const data = await enterGameAPI({
            userName: authStore.user.name ?? "",
            gameId: game.gameID,
            gpId: game.gameProviderId,
        });

        if (!data?.url) {
            loading.value = false

            toast.error("Failed to launch game");

            return;
        }

        // useGameStore.setGames(game);

        const launchUrl =
            `${data.url}` +
            `&gpid=${game.gameProviderId}` +
            `&gameid=${game.gameID}` +
            `&lang=en&device=m&betCode=`;

        // External redirect
        window.location.replace(launchUrl);
        loading.value = false
    } catch (error) {
        loading.value = false
        console.error(error);
        toast.error("Something went wrong");
    }
};

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
        <GameViews header="" :game-data="africanBuffaloSlots" :handler="enterGame" />
        <Footer/>
    </main>
</template>