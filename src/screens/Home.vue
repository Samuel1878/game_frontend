<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { hotGames, popularGames, topBuffaloGames, topCasinoGames, topFishGames, topSlotGames} from "@/consts/games"
import {  BellRingIcon, Download  } from "lucide-vue-next";
import router from "@/router";
import { useI18n } from "vue-i18n";
import GameOptions from "@/components/layout/gameOptions.vue";
import {
  buffalo,
  casino,
  fish,
  hot_icon,
  slot,
  star,
} from "@/utils/assets";
const Footer = defineAsyncComponent(()=>import("@/components/footer.vue"));
import HeroSlider from "@/components/homeSlider.vue";
import { useGameStore } from "@/stores/game";
import { defineAsyncComponent} from "vue";
import ScrollGameViewTwo from "@/components/scrollGameViewTwo.vue";
import ScrollViews from "@/components/scrollViews.vue";
const authStore = useAuthStore();
const { t } = useI18n();
const {prepareGame} = useGameStore()
</script>
<template>
  <main class="bg-gray-900 max-w-6xl w-full flex flex-col min-h-screen">
    <div>
      <div class="w-full mb-2 bg-gray-900 border-gray-800 border-0 px-2">
        <div
          class="flex my-1 p-1 py-0.5 items-center rounded-2xl bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <BellRingIcon :size="16" class="text-gray-100 mx-2" />
          <div class="w-full overflow-hidden">
            <div class="flex w-max animate-marquee gap-10 text-xs text-yellow-400 font-normal">
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
          <div class="px-2">
            <button class="gold-bg rounded-full p-1" @click="router.push('/download')">
              <Download :size="13" class="text-gray-900" aria-label="go to download page"/>
            </button>
          </div>
        </div>
        <HeroSlider />
      </div>
      <div class="w-full space-y-2 px-2" v-show="authStore.user">
        <div class="flex justify-between gap-4 pb-2">
          <button
            @click="router.push('/deposit')"
            class="w-full h-8 gold-bg overflow-hidden relative cursor-pointer flex justify-center items-center gap-2 rounded-full">
            <span class="font-bold text-glow">
              {{ t("deposit") }}
            </span>
          </button>
          <button
            @click="router.push('/withdraw')"
            class="w-full h-8 text-linear-gold overflow-hidden cursor-pointer flex justify-center items-center gap-2 rounded-full bg-gray-800/20 border border-yellow-400/50">
            <span class="font-bold">
              {{ t("withdraw") }}
            </span>
          </button>
        </div>
      </div>
      <GameOptions current_page="lobby" />
       <div class=" bg-gray-900">
        <section class="w-full h-full px-2 ">
          <ScrollGameViewTwo v-if="topSlotGames" :game-data="topSlotGames" :header="t('hot_games')" :icon="hot_icon"
            :handler="prepareGame" :action="()=>router.push('/slots')" />
             <ScrollViews :game-data="hotGames" :header="t('slots')" :icon="slot"
            :handler="prepareGame" :action="()=>router.push('/slots')" />
            <ScrollViews :game-data="topBuffaloGames" :header="t('buffalo')" :icon="buffalo"
            :handler="prepareGame" :action="()=>router.push('/buffalo')" />
           <ScrollViews :game-data="topFishGames" :header="t('fishing')" :icon="fish"
            :handler="prepareGame" :action="()=>router.push('/fishing')" />
         <ScrollViews :game-data="topCasinoGames" :header="t('casino')" :icon="casino"
            :handler="prepareGame" :action="()=>router.push('/casino')"/>
            <ScrollViews :game-data="popularGames" :header="t('top_picks')" :icon="star"
            :handler="prepareGame" :action="()=>router.push('/slots')"/>
        </section>
      </div>
    </div>
    <Footer />
  </main>
  
</template>