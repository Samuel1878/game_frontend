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
  const hidden = sessionStorage.getItem(APP_STORAGE_KEY);

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
  sessionStorage.setItem(APP_STORAGE_KEY, "true");
};

const downloadApp = () => {
  router.push("/download");
};

</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="showAppBanner"
      class="z-40 glass-bg shadow-lg"
   
    >
      <div class="flex items-center gap-3 px-3 h-12">
        <!-- App Icon -->
        <img
          src="/favicon.webp"
          alt="App"
          class="w-10 h-10 shadow-md"
        />

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-white font-bold text-sm truncate">
              TZ99
            </h3>

            <div
              class="bg-white/20 px-1.5 py-0.5 rounded text-[8px] text-yellow-500"
            >
              HOT
            </div>
          </div>

          <div class="flex items-center gap-1 text-white/90 text-[8px]">
            <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            <span>•</span>
            <span class="">10K+ {{ t("download") }}</span>
          </div>
        </div>

        <!-- Download -->
        <button
             @click="downloadApp"
          class="gold-bg px-4 py-1 rounded-full text-sm font-semibold animate-pulse active:scale-95 transition"
        >
          <Download class="w-6 h-6"/>
        </button>

        <!-- Close -->
        <button
          @click="closeBanner"
          class="text-white/90 z-50 px-4 cursor-pointer text-lg w-10 h-10 flex items-center justify-center"
        >
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>