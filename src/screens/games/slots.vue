<script setup lang="ts">
import GameViews from '@/components/gameViews.vue';
import GameOptions from '@/components/layout/gameOptions.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import InputGroup from '@/components/ui/input-group/InputGroup.vue';
import InputGroupAddon from '@/components/ui/input-group/InputGroupAddon.vue';
import InputGroupInput from '@/components/ui/input-group/InputGroupInput.vue';
import { gameProviders, slotGameProviders } from '@/consts';
import { enterGameAPI } from '@/services/gameAPI';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { slot } from '@/utils';
import type { Game } from '@/utils/types';
import { useReturnRefresh } from '@/utils/useReturn';
import { refDebounced } from '@vueuse/core';
import { ChevronLeft, ChevronRight, SearchIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';
const { t } = useI18n();
const searchQuery = ref("");
const debouncedSearch = refDebounced(searchQuery, 300);
const selectedProvider = ref<{ name: string, GpId: number }>({ name: "", GpId: 0 });
const ui = useUIStore();
const loading = ref(false);
const authStore = useAuthStore();

const filteredSlotGames = computed(() => {
    const search = debouncedSearch.value.toLowerCase();
    return gameProviders
        .filter(provider =>
            provider.GpId === selectedProvider.value.GpId
        )
        .flatMap(provider =>
            provider.game.filter(game =>
                !search ||
                game.gameInfos[0]?.gameName.toLowerCase().includes(search)
            )
        ).sort((a, b) => a.rank - b.rank);
});

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
const setProvider = (name: string|any, GpId: number|any) => {
    selectedProvider.value.name = name;
    selectedProvider.value.GpId = GpId
}
const scrollEl = ref<HTMLElement | null>(null);

const scroll = (direction: "left" | "right") => {
  if (!scrollEl.value) return;

  const scrollAmount = 200;

  scrollEl.value.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};
// onMounted(() => {
//   if (slotGameProviders.length > 0) {
//     selectedProvider.value = {
//       name: slotGameProviders[0].name,
//       GpId: slotGameProviders[0].GpId,
//     };
//   }
// });
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
                    <img :src="slot" class="w-18 h-18" />
                </div>
                <div class="flex flex-col gap-4 justify-between flex-1">
                    <h1 class="text-white font-bold text-xl">
                        {{ t("game_title_slot") }}
                    </h1>
                    <p class="text-gray-400 font-medium text-md">
                        {{ t("game_description_slot") }}
                    </p>
                </div>

            </div>
        </div>
        <GameOptions current_page="slots" />
        <aside class="space-y-2">
            <!-- <ProviderOptions :provider-name="selectedProvider.name" :-gp-id="selectedProvider.GpId"
                :set-value="setProvider" /> -->
            <div class="relative w-full mt-1 pl-2 pr-2 md:pl-10 flex">
          <!-- Left Arrow -->
          <button
            @click="scroll('left')"
            class="absolute rounded-full bg-gray-50/5 left-1 top-1/2 -translate-y-1/2 z-10 hover:bg-slate-700/80 h-9 w-9 flex justify-center items-center shadow-lg transition"
          >
            <ChevronLeft class="w-7 h-7 text-gray-400" />
          </button>

          <!-- Scroll Container -->
          <div
            ref="scrollEl"
            class="flex gap-2 bg-gray-900 items-center w-full overflow-x-auto no-scrollbar scroll-smooth"
          >
            <button
              v-for="(option, index) in slotGameProviders"
              :key="index"
              @click="setProvider(option?.name, option?.GpId)"
              class="shrink-0 flex flex-col peer-last:mr-4 gap-2 justify-center items-center text-sm whitespace-nowrap"
            >
              <Card
                class="p-1 hover:bg-gray-700 transition rounded-md bg-gray-800/10 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
              >
                <CardContent class="flex items-center justify-center">
                  <img :src="option?.icon" class="w-20"/>
                </CardContent>
              </Card>
            </button>
          </div>

          <!-- Right Arrow -->
          <button
            @click="scroll('right')"
            class="absolute w-9 h-9 flex justify-center items-center right-1 top-1/2 -translate-y-1/2 z-10 hover:bg-gray-700/70 bg-gray-100/5 rounded-full shadow-lg transition"
          >
            <ChevronRight class="w-7 h-7 text-gray-400" />
        </button>

        </div>
            <div class="px-2">
                <InputGroup class="border-gray-500/70 bg-gray-800/80 ring-gray-400/70 ring-0 rounded-full h-12">
                    <InputGroupInput v-model="searchQuery" :placeholder="t('search_game')" />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>


        </aside>
        <GameViews header="All Slots" :game-data="filteredSlotGames" :handler="enterGame" />
    </main>
</template>