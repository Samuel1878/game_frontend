<script lang="ts" setup>
import {  ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { footer_images } from "@/consts";
import { hotGames, topBuffaloGames, topCasinoGames, topFishGames, topSlotGames} from "@/consts/games"
import {  BellRingIcon, Download  } from "lucide-vue-next";
import ScrollViews from "@/components/scrollViews.vue";
import Footer from "@/components/footer.vue";
import router from "@/router";
import Loading from "@/components/loading.vue";
import { useI18n } from "vue-i18n";

import GameOptions from "@/components/layout/gameOptions.vue";
import {
  buffalo,
  casino,
  fish,
  hot_icon,
  slot,
} from "@/utils";

import HomeSlider from "@/components/homeSlider.vue";
import { useGameStore } from "@/stores/game";
// import { useReturnRefresh } from "@/utils/useReturn";
import ScrollGameViewTwo from "@/components/scrollGameViewTwo.vue";
const authStore = useAuthStore();
const loading = ref(false);
const { t } = useI18n();

const {prepareGame} = useGameStore()
// useReturnRefresh(async() => {
//     await authStore.fetchUser();
// })
</script>
<template>
  <main class="bg-gray-900 max-w-6xl w-full flex flex-col min-h-screen">
    <Loading :show="loading" :message="'loading...'" />
    <div>
      <div class="w-full mb-2 bg-gray-900 border-gray-800 border-0 px-2">

        <div
          class="flex my-1 p-1 py-0.5 items-center rounded-2xl bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <BellRingIcon :size="16" class="text-gray-100 mx-2" />
          <div class="w-full overflow-hidden">
            <div class="flex w-max animate-marquee gap-10 text-xs text-yellow-400 font-medium">
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
            <button class="gold-bg rounded-full p-1 animate-pulse-scale" @click="router.push('/download')">
              <Download :size="13" class="text-gray-900" />
            </button>
          </div>
        </div>
        <HomeSlider/>
      </div>
      <div class="w-full space-y-2 px-2" v-show="authStore.user">
        <div class="flex justify-between gap-4 pb-2">
          <button
            @click="router.push('/deposit')"
            class="w-full h-8 gold-bg shine-auto overflow-hidden relative cursor-pointer flex justify-center items-center gap-2 rounded-full bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

            <span class="font-bold text-glow">
              {{ t("deposit") }}
            </span>
          </button>
          <button
            @click="router.push('/withdraw')"
            class="w-full h-8 text-linear-gold  shine-auto overflow-hidden cursor-pointer flex justify-center items-center gap-2 rounded-full bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

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
        </section>
      </div>
    </div>
    <div class="max-w-7xl flex flex-col items-center p-6 mt-8 w-full">
      <div class="gap-5 flex flex-col items-center w-full">
        <h2 class="text-lg font-extrabold text-white text-center text-linear-gold ">{{ t('footer_header') }}</h2>
        <div class="flex gap-1 flex-wrap items-center justify-center">
          <img :key="value" v-for="value in footer_images" :src="value" class="h-7 md:h-15 lg:-18 my-2" />
        </div>
      </div>
    </div>
    <Footer />
  </main>
  
</template>