<script lang="ts" setup>
import type { Game } from "@/utils/types";
import { ref } from "vue";
// import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";
import { hotGames, newGames, RTPGames, topGames } from "@/consts";
import { sboGames } from "@/consts/sboGames";
import { QrCode } from "lucide-vue-next";
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
import ProvidersView from "@/components/providersView.vue";
import {
  drops_wins,
  golds_box,
  hot,
  hot_icon,
  hot_rtp,
  hot_rtp_icon,
  new_svg,
  phone,
  spin_svg,
  star_svg,
  top_icon,
} from "@/utils";
import HomeSlider from "@/components/homeSlider.vue";

const gameType = ref<string>("lobby");
const authStore = useAuthStore();
const ui = useUIStore();
const loading = ref(false);
let games = ref<Game[] | null>(sboGames);
// const api = ref<CarouselApi | null>(null);
// const current = ref(0);
// const totalCount = ref(0);
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
  <main class="bg-slate-950 max-w-lg w-full flex justify-between flex-col">
    <Loading :show="loading" :message="'loading...'" />
    <div>
      <div
        class="w-full bg-gray-950 border-gray-800 border-0 px-2"
      >
      <HomeSlider/>
        <!-- <div
          class="flex w-max animate-marquee gap-10 text-sm text-sky-400 font-medium"
        >
          <span>🎉 Welcome! Get your bonus today</span>
          <span>💰 Deposit now and earn rewards</span>
          <span>🔥 Limited time promotion running</span>
          <span>🎁 Daily rewards available</span>

          <span>🎉 Welcome! Get your bonus today</span>
          <span>💰 Deposit now and earn rewards</span>
          <span>🔥 Limited time promotion running</span>
          <span>🎁 Daily rewards available</span>
        </div> -->
      </div>

      <div
        v-if="games"
        class="flex items-center w-full flex-col lg:grid bg-gray-900"
      >
        <section
          class="w-full h-full px-2"
          id="lobby"
          v-if="gameType === 'lobby'"
        >
          <ScrollViews
            :label="hot"
            :game-data="hotGames"
            :header="t('hot_games')"
            :icon="hot_icon"
            :handler="enterGame"
          />
          <ScrollViews
            label-style="from-sky-800 to-sky-300 shadow-sky-200 "
            :label="drops_wins"
            :game-data="topGames"
            :header="t('top_picks')"
            :icon="top_icon"
            :handler="enterGame"
          />
          <ScrollViews
            label-style="from-yellow-800 to-yellow-300 shadow-yellow-200 "
            :label="hot_rtp"
            :game-data="RTPGames"
            :header="t('most_wins')"
            :icon="hot_rtp_icon"
            :handler="enterGame"
          />
          <div
            class="w-full mt-4 rounded-xl relative bg-linear-to-br overflow-hidden from-amber-300 to-gray-950 h-25 flex justify-center items-center flex-col gap-2"
          >
            <p class="text-sm font-normal now text-gray-900">
              Up to 1000% bonus everyday
            </p>
            <img :src="golds_box" class="absolute h-25 right-0" />
            <img
              :src="spin_svg"
              class="absolute h-25 cover left-0 rotate-y-180"
            />
            <Button
              class="bg-amber-400 text-gray-950"
              @click="router.push('/deposit')"
            >
              Explore now
            </Button>
          </div>
          <ScrollViews
            label-style="from-yellow-800 to-yellow-300 shadow-yellow-200 "
            :label="new_svg"
            :game-data="newGames"
            :header="t('new')"
            :icon="star_svg"
            :handler="enterGame"
          />
          <ScrollViews
            label-style="from-red-800 to-yellow-300 shadow-yellow-200 "
            :label="star_svg"
            :game-data="africanBuffaloSlots"
            :header="t('best_provider')"
            :icon="star_svg"
            :handler="enterGame"
          />
        </section>
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
            <Skeleton class="w-30 sm:35 h-45 rounded-2xl bg-slate-800" />
          </div>
        </div>
      </div>
      <div class="">
        <ProvidersView />
      </div>

      <section
        id="download"
        class="px-8 pt-8 bg-gray-900 flex flex-col items-center gap-4"
      >
        <h class="text-xl font-extrabold text-center">{{
          t("download_header")
        }}</h>
        <div class="flex flex-col items-center md:flex-row">
          <div class="md:p-0">
            <img :src="phone" />
          </div>
          <div class="flex gap-4 justify-center w-full my-4">
            <div class="p-2 bg-gray-900 rounded-lg">
              <QrCode class="w-25 h-25" />
            </div>
            <div class="flex flex-col items-center gap-4">
              <div
                class="bg-linear-to-br from-gray-700 to-gray-900 h-10 px-6 flex items-center shadow-gray-600 shadow-inner rounded-full justify-center"
              >
                <p class="text-gray-400 font-bold">{{ t('download_apk') }}</p>
              </div>
              <div class="text-sky-400 font-bold flex gap-2 underline">
                <span>
                  <InfoIcon />
                </span>
                {{ t('install_guide') }}
              </div>
            </div>
          </div>
        </div>
      </section>
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
