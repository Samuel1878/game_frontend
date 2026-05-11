<script setup lang="ts">
import Footer from "@/components/footer.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import { Headset, InfoIcon, QrCode } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
// const androidUrl = "https://api.96betx.com/apk/96betx.apk";
// const iosUrl = "https://apps.apple.com/app/your-app-id";
const currentOrigin = window.location.origin;
const isAndroid = ref(false);
const isIOS = ref(false);
const loading = ref(true);

const { t } = useI18n();

onMounted(() => {
  
});

function downloadAPK() {
  const ua = navigator.userAgent;

  isAndroid.value = /Android/i.test(ua);
  isIOS.value = /iPhone|iPad|iPod/i.test(ua);
  loading.value = false;
  const androidUrl = `${currentOrigin}/apk/96betx.apk`;
  const iosUrl = `${currentOrigin}/app/your-app-id`;
  // AUTO REDIRECT (optional)
  if (isAndroid.value) {
    window.location.href = androidUrl;
  }

  if (isIOS.value) {
    window.location.href = iosUrl;
  }
  console.log(currentOrigin)
  window.location.href = androidUrl;
}

</script>

<template>
       <CustomNavBar title="download_center" backTo="/">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn/>
    </template>
  </CustomNavBar>
  <main class=" bg-gray-900 text-white flex items-center justify-center px-2 py-10">

    <section
      id="download"
      class="w-full max-w-6xl bg-gray-900/60 border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col items-center gap-6"
    >

      <!-- Title -->
      <h1 class="text-lg md:text-2xl font-extrabold text-center">
        {{ t("download_header") }}
      </h1>

      <!-- Phone image -->
      <img
        src="/images/phone.svg"
        class="w-45 md:w-56 object-contain"
      />

      <!-- Content -->
      <div class="flex flex-col md:flex-row items-center gap-6 w-full justify-center">

        <!-- QR -->
        <div class="p-3 bg-gray-800 rounded-xl border border-white/10">
          <QrCode class="w-24 h-24 text-white" />
        </div>

        <!-- Actions -->
        <div class="flex flex-col items-center gap-4">

          <div
            v-on:click="downloadAPK"
            class="bg-linear-to-br from-gray-700/70 to-gray-900 h-10 px-6 flex items-center rounded-full border border-white/10"
          >
            <p class="text-gray-300 font-semibold text-sm">
              {{ t("download_apk") }}
            </p>
          </div>

          <div class="text-sky-400 font-medium flex items-center gap-2 underline cursor-pointer">
            <InfoIcon class="w-4 h-4" />
            <span>{{ t("install_guide") }}</span>
          </div>

        </div>
      </div>

      <!-- Mobile note -->
      <p class="text-xs text-gray-500 text-center mt-2">
        {{ t("mobile_coming_soon") }}
      </p>

    </section>

  </main>
  <Footer/>
</template>