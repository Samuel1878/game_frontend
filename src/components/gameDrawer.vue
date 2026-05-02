<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import Drawer from "./ui/drawer/Drawer.vue";
import DrawerContent from "./ui/drawer/DrawerContent.vue";
import { formatRandomRange } from "@/utils";

const gameStore = useGameStore();
const { drawerOpen, loading, selectedGame } = storeToRefs(gameStore);
const { t, locale } = useI18n();


const closeDrawer = () => {
  gameStore.drawerOpen = false;
};
</script>

<template>
  <Drawer :open="drawerOpen" @update:open="drawerOpen = $event">
    <DrawerContent class="glass-bg rounded-t-2xl p-4 pt-0 flex flex-col w-full border-t-2 gap-4  ">
   

        <!-- 🎮 Game Info -->
        <div class="flex items-center gap-3">
          <div class="relative">

            <img :src="locale==='cn'?selectedGame?.cn_icon_url?selectedGame?.cn_icon_url :selectedGame?.icon_url :selectedGame?.icon_url" alt="game" class="w-40 h-44 rounded-lg object-cover" />
            <div class="glass absolute inset-0"></div>

            <div class="shine absolute inset-0"></div>
            <div class="absolute inset-0 bg-black/10 rounded-lg"></div>
          </div>

          <div class="flex flex-col">
            <span class="text-white text-2xl font-extrabold leading-loose">
              {{ locale==="cn" ?selectedGame?.cn_name? selectedGame?.cn_name:selectedGame?.name :selectedGame?.name || "Unknown Game" }}
            </span>

            <span class="text-green-400 text-sm">
              RTP ~ {{ formatRandomRange(Number(selectedGame?.rtp) || 9.6) }}%
            </span>
          </div>
        </div>


        <!-- 🎯 Actions -->
        <div class="space-y-4 mt-2">
          <!-- Cancel -->


          <!-- Start Game -->
          <button :disabled="loading" @click="gameStore.enterGame"
            class="w-full h-14 rounded-lg gold-bg border-white/40 border text-gray-50 font-bold active-button flex items-center justify-center">
            {{ loading ? t("loading") : t("start_game") }}
          </button>
          <button @click="closeDrawer"
            class="w-full h-14 rounded-lg border border-gray-400/10 active-button text-gray-300 font-medium">
            {{ t("cancel") }}
          </button>
        </div>

   
    </DrawerContent>
  </Drawer>
</template>