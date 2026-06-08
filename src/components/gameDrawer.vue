<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import {DrawerContent, Drawer} from "./ui/drawer"
const gameStore = useGameStore();
const { drawerOpen, loading, selectedGame } = storeToRefs(gameStore);
const { t, locale } = useI18n();
const closeDrawer = () => {
  gameStore.closeDrawer();
  gameStore.resetGame();
};
</script>
<template>
  <Drawer :open="drawerOpen" @update:open="drawerOpen = $event">
    <DrawerContent
      class="glass-bg rounded-t-2xl p-4 pt-0 flex flex-col w-full border-t-2 gap-4"
    >
      <div class="flex gap-3">
        <div class="relative overflow-hidden border border-white/10 rounded-lg max-w-1/2">
          <img
            :src="
              locale === 'cn'
                ? selectedGame?.cn_icon_url
                  ? selectedGame?.cn_icon_url
                  : selectedGame?.icon_url
                : selectedGame?.icon_url
            "
            alt="game"
            loading="eager"
            class="aspect-square rounded-lg object-cover"
          />
          <div class="glass absolute inset-0"></div>

          <div class="shine absolute inset-0"></div>
          <div class="absolute inset-0 bg-black/10 rounded-lg"></div>
        </div>
        <div class="flex flex-col justify-between relative">
          
          <span class="text-white text-xl font-extrabold leading-loose">
            {{
              locale === "cn"
                ? selectedGame?.cn_name
                  ? selectedGame?.cn_name
                  : selectedGame?.name
                : selectedGame?.name || "Unknown Game"
            }}
            
          </span>
          <div class="flex items-center gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800/20 border border-white/5 shadow-inner">
              <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">RTP</span>
              <span class="text-xs text-emerald-400 font-black drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                {{ selectedGame?.rtp ? (Number(selectedGame.rtp) * 100 ||96).toFixed(2) + "%" : "N/A" }} - {{ ((Number(selectedGame?.rtp)* 100 || 96) + 9.9684).toFixed(2)  + "%" }}
              </span>
            </div>
          </div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800/20 border border-white/5 shadow-inner">
              <svg class="w-3 h-3 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p class="text-xs text-zinc-400 font-bold uppercase tracking-wider">VOL</p>
              <span class="text-xs text-amber-400 font-black drop-shadow-[0_0_6px_rgba(245,158,11,0.3)] uppercase tracking-wide">
                {{ 
                  ['MEDIUM', 'HIGH', 'LOW'][((selectedGame?.game_rank || selectedGame?.id || selectedGame?.name || '').toString().charCodeAt(0)) % 3] 
                }}
              </span>
            </div>
            </div>
         
        </div>
      </div>
      <div class="space-y-4 mt-2">
        <button
          :disabled="loading"
          @click="gameStore.enterGame"
          class="w-full h-14 rounded-lg gold-bg border-white/40 border text-glow font-bold active-button flex items-center justify-center"
        >
          {{ loading ? t("loading") : t("start_game") }}
        </button>
        <button
          @click="closeDrawer"
          class="w-full h-14 rounded-lg border border-gray-400/10 active-button text-gray-300 font-medium"
        >
          {{ t("cancel") }}
        </button>
      </div>
    </DrawerContent>
  </Drawer>
</template>
