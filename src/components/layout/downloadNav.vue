<script setup lang="ts">
import router from "@/router";
import { isApp, isPWA } from "@/utils/help";
import { Download } from "lucide-vue-next";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useDownloadBannerStore } from "@/stores/downloadBannerStore";
import { storeToRefs } from "pinia";
const ui = useDownloadBannerStore();
const {showAppBanner} = storeToRefs(ui)
const APP_STORAGE_KEY = "hide-app-download-banner";
onMounted(() => {
  const hidden = localStorage.getItem(APP_STORAGE_KEY);
  const pwa = isPWA();
  const mobile = isApp();
  if (!hidden && !pwa && !mobile) {
    setTimeout(() => {
      ui.showBanner();
    }, 500);
  } else {
    ui.permanentlyHideBanner();
  }
});
const { t } = useI18n();
const closeBanner = () => {
  ui.permanentlyHideBanner();
  localStorage.setItem(APP_STORAGE_KEY, "true");
};
const downloadApp = () => {
  router.push("/download");
};
</script>
<template>
    <div
      v-if="showAppBanner"
      class="z-40 bg-gray-800/20 border-b border-gray-500/20 shadow-lg"
   
    >
      <div class="flex items-center gap-2 px-2 h-12">
        <img
          src="/favicon.webp"
          alt="App"
          class="w-10 h-10 shadow-md"

        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-white font-bold text-sm truncate">
              TZ99
            </h3>
            <div
              class="bg-white/10 px-1.5 py-0.5 rounded text-[7px] text-yellow-500"
            >
              HOT
            </div>
          </div>

          <div class="flex items-center gap-1 text-white/90 text-[10px]">
            <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            <span>•</span>
            <span class="">10K+ {{ t("download") }}</span>
          </div>
        </div>
        <button
          @click="downloadApp"
          aria-label="download"
          class=" px-4 py-1 rounded-full text-sm font-semibold active:scale-95 transition"
        >
          <Download class="w-6 h-6 text-yellow-400"/>
        </button>
        <button
          @click="closeBanner"
          class="text-white/90 z-50 px-4 cursor-pointer text-lg w-10 h-10 flex items-center justify-center"
        >
          ✕
        </button>
      </div>
    </div>
</template>