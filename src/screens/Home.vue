<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { BellRingIcon, Download } from "lucide-vue-next";
import router from "@/router";
import { useI18n } from "vue-i18n";
import GameOptions from "@/components/layout/gameOptions.vue";
import { buffalo, casino, fish, hot_icon, slot, star } from "@/utils/assets";
const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
import HeroSlider from "@/components/homeSlider.vue";
import { useGameStore } from "@/stores/game";
import { defineAsyncComponent, onMounted } from "vue";
import ScrollGameViewTwo from "@/components/scrollGameViewTwo.vue";
import ScrollViews from "@/components/scrollViews.vue";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { t } = useI18n();
const gameStore = useGameStore();
const { hotGames, topGames, featuredGames, categoryGames, loading, error } = storeToRefs(gameStore);
const { prepareGame, fetchHomeGameSections } = gameStore;

onMounted(() => {
  void fetchHomeGameSections();
});
</script>
<template>
  <main class="bg-gray-900 max-w-6xl w-full flex flex-col min-h-screen ios-layer-isolate">
    <div>
      <div class="w-full mb-2 bg-gray-900 border-gray-800 border-0 px-2">
        <div
          class="flex my-1 p-1 py-0.5 items-center rounded-2xl bg-gray-900/20 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >
          <BellRingIcon :size="16" class="text-gray-100 mx-2" />
          <div class="w-full overflow-hidden">
            <div
              class="flex w-max animate-marquee gap-10 text-xs text-yellow-400 font-normal"
            >
              <span>👨‍💻 {{ t("description_one") }}</span>
              <span>🎁{{ t("description_two") }}</span>
              <span>💰 {{ t("description_three") }}</span>
              <span>🎮 {{ t("description_four") }}</span>
              <span>👨‍💻 {{ t("description_one") }}</span>
              <span>🎁 {{ t("description_two") }}</span>
              <span>💰 {{ t("description_three") }}</span>
              <span>🎮 {{ t("description_four") }}</span>
            </div>
          </div>
          <div class="pl-2">
            <button
              class="gold-bg rounded-full p-1"
              @click="router.push('/download')"
            >
              <Download
                :size="13"
                class="text-gray-900"
                aria-label="go to download page"
              />
            </button>
          </div>
        </div>
        <HeroSlider />
      </div>
      <div class="w-full space-y-2 px-2" v-show="authStore.user">
        <div class="flex justify-between gap-4 pb-2">
          <button
            @click="router.push('/deposit')"
            class="w-full h-8 gold-bg overflow-hidden relative cursor-pointer flex justify-center items-center gap-2 rounded-full"
          >
            <span class="font-bold text-glow">
              {{ t("deposit") }}
            </span>
          </button>
          <button
            @click="router.push('/withdraw')"
            class="w-full h-8 text-linear-gold overflow-hidden cursor-pointer flex justify-center items-center gap-2 rounded-full bg-gray-800/20 border border-yellow-400/50"
          >
            <span class="font-bold">
              {{ t("withdraw") }}
            </span>
          </button>
        </div>
      </div>
      <GameOptions current_page="lobby" />
      <div class="bg-gray-900">
        <section class="w-full h-full px-2">
          <div
            v-if="loading && !hotGames.length"
            class="grid grid-cols-3 gap-2 py-4"
          >
            <div
              v-for="n in 6"
              :key="n"
              class="aspect-square rounded-lg bg-white/10 animate-pulse"
            />
          </div>
          <div
            v-if="error && !hotGames.length"
            class="rounded-lg border border-red-400/30 bg-red-500/10 p-4 my-4 text-center"
          >
            <p class="text-sm text-red-200">{{ t(error) }}</p>
            <button
              class="mt-3 px-4 py-2 rounded-lg gold-bg text-black font-bold"
              @click="fetchHomeGameSections(true)"
            >
              {{ t("retry") }}
            </button>
          </div>
          <ScrollGameViewTwo
            v-if="hotGames.length"
            :game-data="hotGames"
            :header="t('hot_games')"
            :icon="hot_icon"
            :handler="prepareGame"
            :action="() => router.push('/slots')"
          />
          <ScrollViews
            v-if="categoryGames.SLOT?.length"
            :game-data="categoryGames.SLOT"
            :header="t('slots')"
            :icon="slot"
            :handler="prepareGame"
            :action="() => router.push('/slots')"
          />
          <ScrollViews
            v-if="categoryGames.BUFFALO?.length"
            :game-data="categoryGames.BUFFALO"
            :header="t('buffalo')"
            :icon="buffalo"
            :handler="prepareGame"
            :action="() => router.push('/buffalo')"
          />
          <ScrollViews
            v-if="categoryGames.FISHING?.length"
            :game-data="categoryGames.FISHING"
            :header="t('fishing')"
            :icon="fish"
            :handler="prepareGame"
            :action="() => router.push('/fishing')"
          />
          <ScrollViews
            v-if="categoryGames.LIVE_CASINO?.length"
            :game-data="categoryGames.LIVE_CASINO"
            :header="t('casino')"
            :icon="casino"
            :handler="prepareGame"
            :action="() => router.push('/casino')"
          />
          <ScrollViews
            v-if="topGames.length"
            :game-data="topGames"
            :header="t('top_picks')"
            :icon="star"
            :handler="prepareGame"
            :action="() => router.push('/slots')"
          />
          <ScrollViews
            v-if="featuredGames.length"
            :game-data="featuredGames"
            :header="t('featured_games')"
            :icon="star"
            :handler="prepareGame"
            :action="() => router.push('/arcade-games')"
          />
        </section>
      </div>
    </div>
    <Footer />
  </main>
</template>
