<script lang="ts" setup>
import type { Game } from "@/utils/types";
import { ref } from "vue";
// import Autoplay from "embla-carousel-autoplay";
import { useAuthStore } from "@/stores/auth";
import { footer_images, hotGames, newGames, RTPGames, topGames } from "@/consts";

import {  Download,  } from "lucide-vue-next";
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
import {
  drops_wins,
  golds_box,
  hot,
  hot_icon,
  hot_rtp,
  hot_rtp_icon,
  new_svg,
  spin_svg,
  star_svg,
  top_icon,
} from "@/utils";
import GameOptions from "@/components/layout/gameOptions.vue";
import HomeSlider from "@/components/homeSlider.vue";
const authStore = useAuthStore();
const ui = useUIStore();
const loading = ref(false);
const { t } = useI18n();


const enterGame = async (game: Game) => {
  loading.value = true;
  if (!game) return (loading.value = false);

  if (!authStore.accessToken || !authStore.user) {
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
      toast.warning("Not enough fund!");
      router.push("/deposit");
      loading.value = false;
      return;
    }
    const launchUrl =
      `${data.url}` +
      `&gpid=${game.gameProviderId}` +
      `&gameid=${game.gameID}true` +
      `&lang=en&device=m&betCode=`;
    window.location.href = launchUrl;
    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
    toast.error("Something went wrong");
  }
};
</script>
<template>
  <main class="bg-gray-900 max-w-lg w-full flex justify-between flex-col">
    <Loading :show="loading" :message="'loading...'" />
    <div>
      <div class="w-full mb-2 bg-gray-900 border-gray-800 border-0 px-2">

        <div
          class="flex my-1 p-1 items-center rounded-2xl bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <BellRingIcon :size="16" class="text-gray-100 mx-2" />
          <div class="w-full overflow-hidden">
            <div class="flex w-max animate-marquee gap-10 text-xs text-sky-400 font-medium">
              <span>🎉 Welcome! Get your bonus today</span>
              <span>💰 Deposit now and earn rewards</span>
              <span>🔥 Limited time promotion running</span>
              <span>🎁 Daily rewards available</span>

              <span>🎉 Welcome! Get your bonus today</span>
              <span>💰 Deposit now and earn rewards</span>
              <span>🔥 Limited time promotion running</span>
              <span>🎁 Daily rewards available</span>
            </div>
          </div>

          <div class="px-2">
            <button class="bg-sky-400 rounded-full p-1">
              <Download :size="13" class="text-gray-900" />
            </button>

          </div>
        </div>

        <HomeSlider />
      </div>
      <div class="w-full space-y-2 px-2" v-show="authStore.user && authStore.accessToken">
        <div class="flex justify-between gap-4 p-2">
          <button
            class="w-full h-8 flex justify-center items-center gap-2 rounded-full bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

            <span class="font-bold
             ">
              {{ t("deposit") }}
            </span>
          </button>
          <button
            class="w-full h-8 flex justify-center items-center gap-2 rounded-full bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

            <span class="font-bold
             ">
              {{ t("withdraw") }}
            </span>
          </button>
        </div>
      </div>
      <GameOptions current_page="lobby" />
      <div class="flex items-center w-full flex-col lg:grid bg-gray-900">
        <section class="w-full h-full px-2">
          <ScrollViews :label="hot" :game-data="hotGames" :header="t('hot_games')" :icon="hot_icon"
            :handler="enterGame" />
          <ScrollViews label-style="from-sky-800 to-sky-300 shadow-sky-200 " :label="drops_wins" :game-data="topGames"
            :header="t('top_picks')" :icon="top_icon" :handler="enterGame" />
          <ScrollViews label-style="from-yellow-800 to-yellow-300 shadow-yellow-200 " :label="hot_rtp"
            :game-data="RTPGames" :header="t('most_wins')" :icon="hot_rtp_icon" :handler="enterGame" />
          <div
            class="w-full mt-4 rounded-xl relative bg-linear-to-br overflow-hidden from-amber-300 to-gray-950 h-25 flex justify-center items-center flex-col gap-2">
            <p class="text-sm font-normal now text-gray-900">
              Up to 1000% bonus everyday
            </p>
            <img :src="golds_box" class="absolute h-25 right-0" />
            <img :src="spin_svg" class="absolute h-25 cover left-0 rotate-y-180" />
            <Button class="bg-amber-400 text-gray-950" @click="router.push('/deposit')">
              Explore now
            </Button>
          </div>
          <ScrollViews label-style="from-yellow-800 to-yellow-300 shadow-yellow-200 " :label="new_svg"
            :game-data="newGames" :header="t('new')" :icon="star_svg" :handler="enterGame" />
          <!-- <ScrollViews label-style="from-red-800 to-yellow-300 shadow-yellow-200 " :label="star_svg"
            :game-data="africanBuffaloSlots" :header="t('best_provider')" :icon="star_svg" :handler="enterGame" /> -->
        </section>
      </div>
      <!-- <div v-else class="flex items-center flex-col lg:grid">
        <div
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4"
        >
          <div
            id="skeleton"
            class="w-full"
            v-for="(_, index) in 25"
            :key="index"
          >
            <Skeleton class="w-30 sm:35 h-45 rounded-2xl bg-slate-800" />
          </div>
        </div>
      </div> -->
      <!-- <div class="">
        <ProvidersView />
      </div> -->


    </div>
    <div class="max-w-7xl flex flex-col items-center p-6 w-full">
      <div class="gap-8 flex flex-col items-center w-full">
        <h2 class="text-lg font-extrabold text-white text-center">{{ t('footer_header') }}</h2>
        <div class="flex gap-1 flex-wrap items-center justify-center">
          <img v-for="value in footer_images" :src="value" class="h-10 md:h-15 lg:-18 my-2" />
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

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 20s linear infinite;
}
</style>
