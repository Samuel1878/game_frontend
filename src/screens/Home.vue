<script lang="ts" setup>
import type { Game } from "@/utils/types";
import { ref, watch } from "vue";
import type { CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";
import {
  homeSlide,
  hotGames,
  RTPGames,
  topGames,
} from "@/consts";
import { sboGames } from "@/consts/sboGames";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Coins,
  CrownIcon,
  Gamepad2Icon,
  GoalIcon,
  HistoryIcon,
  LucideWalletMinimal,
  User2Icon,
  Users2Icon,
  Wallet2Icon,
} from "lucide-vue-next";
import ScrollViews from "@/components/scrollViews.vue";
import { toast } from "vue-sonner";
import { africanBuffaloSlots } from "@/consts/afbGames";
import { enterGameAPI } from "@/services/gameAPI";
import Button from "@/components/ui/button/Button.vue";
import Footer from "@/components/footer.vue";
import router from "@/router";
import Loading from "@/components/loading.vue";
import { useUIStore } from "@/stores/ui";
import { useI18n } from "vue-i18n";

const gameType = ref<string>("lobby");
const authStore = useAuthStore();
const ui = useUIStore();
const loading = ref(false)
let games = ref<Game[] | null>(sboGames);
const api = ref<CarouselApi | null>(null);
const current = ref(0);
const totalCount = ref(0);
const {t } = useI18n();
const plugin = Autoplay({
  delay: 3000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
})
function setApi(val: CarouselApi) {
  api.value = val;
}
watch(
  api,
  (embla) => {
    if (!embla) return;

    totalCount.value = embla.scrollSnapList().length;
    current.value = embla.selectedScrollSnap() + 1;

    const onSelect = () => {
      current.value = embla.selectedScrollSnap() + 1;
    };

    embla.on("select", onSelect);
    // Cleanup when component unmounts
    return () => {
      embla.off("select", onSelect);
    };
  },
  { immediate: true },
);

const enterGame = async (game: Game) => {
  loading.value = true;
  if (!game) return loading.value = false;

  if (!authStore.isLoggedIn || !authStore.user) {
    toast.warning("Please login to enter the game");
    ui.openAuthModal("/");
    loading.value = false;
    return;
  }

  try {
    const data = await enterGameAPI({
      userName: authStore.user.name ?? "",
      gameId: game.gameID,
      gpId: game.gameProviderId,
    });

    if (!data?.url) {
      toast.warning("Failed to launch game");
      loading.value = false;
      return;
    }
    const launchUrl =
      `${data.url}` +
      `&gpid=${game.gameProviderId}` +
      `&gameid=${game.gameID}true` +
      `&lang=en&device=m&betCode=`;

    // External redirect

    window.location.href = launchUrl;
    loading.value = false

  } catch (error) {
    console.error(error);
    loading.value = false
    toast.error("Something went wrong");
  }
};
</script>
<template>
  <main class="bg-slate-950 max-w-6xl w-full flex justify-between flex-col">
    <Loading :show="loading" :message="'loading...'" />
    <div>
      <div>
        <div class="w-full p-2">
          <Carousel class="relative w-full min-h-55 cursor-pointer" @init-api="setApi"
            :opts="{ loop: true, align: 'start' }" :plugins="[plugin]" @mouseenter="plugin.stop"
            @mouseleave="[plugin.reset(), plugin.play(), console.log('Running')]">
            <CarouselContent class="">
              <CarouselItem v-for="(slide, index) in homeSlide" :key="index" class="h-55">
                <Card class="border-0 rounded-2xl bg-slate-900 h-full p-0 overflow-hidden">
                  <CardContent class="relative flex items-center justify-center h-full" :style="{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }">
                    <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>

                   
                    <div class="relative z-10 text-white w-full h-full flex flex-col items-start justify-end ">
                      <h2 class="text-lg font-bold tracking-wide">
                        {{ slide.title || "Play & Win Big" }}
                      </h2>
                      <p class="text-xs text-gray-300">
                        {{ slide.description || "High RTP • Instant Play" }}
                      </p>

                      <Button size="sm" class="mt-2 mb-6 bg-yellow-500 text-black hover:bg-yellow-400">
                        {{ t("play_now") }}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div v-if="authStore.isLoggedIn"
        class="bg-gray-900 w-full p-2 flex gap-2 justify-around border-b border-b-gray-800">

        <div class="flex flex-col items-center justify-between gap-2 cursor-pointer" @click="router.push('/deposit')">
          <div class="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <BanknoteArrowDown class="w-8 h-8 text-sky-300" />
          </div>

          <p class="text-gray-400 text-xs font-medium">
            {{ t("deposit") }}
          </p>
        </div>
        <div class="flex flex-col items-center justify-between gap-2 cursor-pointer" @click="router.push('/withdrawal')">
          <div class="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <BanknoteArrowUp class="w-8 h-8 text-sky-300" />
          </div>
          <p class="text-gray-400 text-sm font-medium">
            {{ t("withdraw") }}
          </p>
        </div>
        <div class="flex flex-col items-center justify-between gap-2 cursor-pointer" @click="router.push('/transactions')">
          <div class="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <HistoryIcon class="w-8 h-8 text-sky-300" />
          </div>

          <p class="text-gray-400 text-sm font-medium">
            {{ t("transactions") }}
          </p>
        </div>
        <div class="flex flex-col items-center justify-between gap-2 cursor-pointer" @click="router.push('/games')">
          <div class="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <Gamepad2Icon class="w-8 h-8 text-sky-300" />
          </div>

          <p class="text-gray-400 text-sm font-medium">
            {{ t("games") }}
          </p>
        </div>
      </div>
      <div v-if="games" class="flex items-center w-full flex-col lg:grid bg-gray-900">
        <section class="w-full h-full px-2" id="lobby" v-if="gameType === 'lobby'">
          <ScrollViews :game-data="hotGames" :header="t('hot_games')" :icon="CrownIcon" :handler="enterGame" />
          <ScrollViews :game-data="topGames" :header="t('top_picks')" :icon="Users2Icon" :handler="enterGame" />
          <ScrollViews :game-data="RTPGames" :header="t('most_wins')" :icon="Coins" :handler="enterGame" />
          <div class="w-full mt-4 rounded-sm bg-gray-950 h-25 flex justify-center items-center flex-col gap-2">
            <p>Get earn today</p>
            <Button class="bg-sky-500" @click="router.push('/deposit')">
              Deposit Now
            </Button>
          </div>
          <ScrollViews :game-data="africanBuffaloSlots" :header="t('best_provider')" :icon="GoalIcon" :handler="enterGame" />
        </section>

      </div>
      <div v-else class="flex items-center flex-col lg:grid">
        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
          <div id="skeleton" class="w-full" v-for="(_, index) in 25" :key="index">
            <Skeleton class="w-30 sm:35 h-45 rounded-2xl bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
</template>
<style lang="css">

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
