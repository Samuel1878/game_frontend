<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onUnmounted, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useGameStore } from "@/stores/game";
import { GAME_IMAGE_FALLBACK, gameProviderName, localizedGameImage, localizedGameName } from "@/utils/game";

const gameStore = useGameStore();
const { drawerOpen, loading, launching, selectedGame } = storeToRefs(gameStore);
const { t, locale } = useI18n();
const displayName = computed(() =>
  selectedGame.value ? localizedGameName(selectedGame.value, locale.value) : t("game_unavailable"),
);
const iconUrl = computed(() =>
  selectedGame.value ? localizedGameImage(selectedGame.value, locale.value) : GAME_IMAGE_FALLBACK,
);
const rtpLabel = computed(() => {
  const rtp = selectedGame.value?.rtp;
  if (rtp === null || rtp === undefined || rtp === "") return "N/A";
  const parsed = Number(rtp);
  if (!Number.isFinite(parsed)) return String(rtp);
  return `${parsed.toFixed(2)}%`;
});

const closeDrawer = () => {
  gameStore.closeDrawer();
  gameStore.resetGame();
};
const launchDemo = () => {
  if (selectedGame.value) {
    void gameStore.launchDemoGame(selectedGame.value);
  }
};
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = GAME_IMAGE_FALLBACK;
};

watch(drawerOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

useEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Escape" && drawerOpen.value) {
    closeDrawer();
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="drawerOpen"
      class="fixed inset-0 z-50 flex items-end"
      role="presentation"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/50"
        aria-label="Close game launch"
        @click="closeDrawer"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Game launch"
        class="glass-bg relative w-full rounded-t-3xl p-5 pt-2 flex flex-col border-t border-white/10 gap-5 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]"
      >
        <div class="mx-auto h-1.5 w-12 rounded-full bg-white/30" />
        <div class="flex gap-4 items-center">
          <div
            class="relative overflow-hidden rounded-2xl border border-white/10 shrink-0"
          >
            <img
              :src="iconUrl"
              :alt="displayName"
              loading="eager"
              class="w-24 h-24 object-cover"
              @error="onImageError"
            />
            <div class="glass absolute inset-0"></div>
            <div class="shine absolute inset-0"></div>
          </div>

          <div class="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <h2 class="text-white text-lg font-extrabold truncate">
                {{ displayName }}
              </h2>

              <p
                v-if="selectedGame"
                class="text-yellow-400 font-bold text-sm mt-1 tracking-wide"
              >
                {{ gameProviderName(selectedGame) }}
              </p>
            </div>

            <div class="flex gap-2 mt-3 flex-wrap">
              <div
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
              >
                <span class="text-[10px] text-gray-400 font-bold">RTP</span>
                <span class="text-emerald-400 text-xs font-black">
                  {{ rtpLabel }}
                </span>
              </div>

              <div
                v-if="selectedGame?.volatility"
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
              >
                <span class="text-[10px] text-gray-400 font-bold">VOL</span>
                <span class="text-amber-400 text-xs font-black uppercase">
                  {{ selectedGame.volatility }}
                </span>
              </div>

              <div
                v-if="selectedGame?.category || selectedGame?.game_type"
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
              >
                <span class="text-[10px] text-gray-400 font-bold">{{ t("category") }}</span>
                <span class="text-sky-300 text-xs font-black uppercase">
                  {{ selectedGame.category || selectedGame.game_type }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3 my-2 mb-[calc(2rem+env(safe-area-inset-bottom))]">
          <button
            :disabled="loading || launching"
            @click="gameStore.enterGame"
            class="w-full h-14 rounded-lg gold-bg border-2 border-yellow-500 text-black font-extrabold tracking-wide active-button flex items-center justify-center shadow-lg shadow-yellow-500/10 disabled:opacity-70"
          >
            {{ loading || launching ? t("launching") : t("start_game") }}
          </button>

          <button
            v-if="selectedGame?.supports_demo"
            :disabled="loading || launching"
            @click="launchDemo"
            class="w-full h-12 rounded-lg border border-yellow-400/60 bg-yellow-400/10 text-yellow-300 font-extrabold active-button disabled:opacity-70"
          >
            {{ t("demo") }}
          </button>

          <button
            @click="closeDrawer"
            class="w-full h-12 rounded-lg border border-white/10 bg-white/5 text-gray-300 font-medium active-button"
          >
            {{ t("cancel") }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
