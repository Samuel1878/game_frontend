<script setup lang="ts">
const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
import LanguageBtn from "@/components/languageBtn.vue";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import { Asterisk, Headset } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import QrcodeVue from "qrcode.vue";
import { defineAsyncComponent } from "vue";
const supabaseURL =
  "https://vptocypywfkpepmggrym.supabase.co/storage/v1/object/public/app"; // Replace with actual URL
const androidUrl = `${supabaseURL}/tz99.apk`;

const iosUrl = `https://vptocypywfkpepmggrym.supabase.co/storage/v1/object/public/app/tz99.mobileconfig`;
const { t } = useI18n();

const downloadIOS = () => {
  window.location.href = iosUrl;
};

const downloadAndroid = () => {
  window.location.href = androidUrl;
};
</script>

<template>
  <CustomNavBar :title="t('download_center')" backTo="/">
    <template #right>
      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>

  <main
    class="bg-gray-900 text-white flex flex-col items-center justify-center px-2 py-6"
  >
    <h1 class="text-lg md:text-2xl font-extrabold text-center">
      {{ t("download_header") }}
    </h1>

    <section
      id="download"
      class="w-full max-w-6xl bg-gray-900/60 border border-white/10 rounded-2xl my-4 p-6 md:p-10 space-y-2"
    >
      <div class="flex gap-2 items-center">
        <img src="/favicon.webp" class="w-12 h-12" alt="App Logo" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-white font-bold text-lg text-linear-gold truncate">
              TZ99
            </h3>
            <div
              class="bg-white/20 px-1.5 py-0.5 rounded text-xs text-gray-300"
            >
              5.0 {{ t("rating") }}
            </div>
          </div>
          <div class="flex items-center gap-1 text-white/90 text-sm">
            <span>⭐ ⭐ ⭐ ⭐ ⭐</span>
            <span>•</span>
            <span class="text-[9px]">10K+ {{ t("download_count") }}</span>
          </div>
        </div>
      </div>

      <!-- Instructional List -->
      <div class="space-y-2 my-6">
        <div class="flex gap-2 items-center">
          <Asterisk class="w-4 h-4 text-yellow-500" />
          <p class="text-xs text-gray-400 leading-loose">
            {{ t("instruction_qr") }}
          </p>
        </div>
        <div class="flex gap-2 items-center">
          <Asterisk class="w-4 h-4 text-yellow-500" />
          <p class="text-xs text-gray-400 leading-loose">
            {{ t("instruction_android") }}
          </p>
        </div>
        <div class="flex gap-2 items-center">
          <Asterisk class="w-4 h-4 text-yellow-500" />
          <p class="text-xs text-gray-400 leading-loose">
            {{ t("instruction_ios") }}
          </p>
        </div>
        <div class="flex gap-2 items-center">
          <Asterisk class="w-4 h-4 text-yellow-500" />
          <p class="text-xs text-gray-400 leading-loose">
            {{ t("instruction_enjoy") }}
          </p>
        </div>
      </div>

      <div class="flex justify-around">
        <div class="flex flex-col items-center gap-2">
          <div
            class="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-zinc-800 to-black/90 p-2 shadow-2xl"
          >
            <!-- Glow -->
            <div
              class="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-cyan-500/10"
            />
            <div class="relative z-10 flex flex-col items-center">
              <!-- QR Wrapper -->
              <div
                class="relative rounded-xl bg-white p-4 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
              >
                <QrcodeVue
                  :value="iosUrl"
                  :size="90"
                  level="H"
                  background="#ffffff"
                  foreground="#000000"
                  render-as="svg"
                />

                <!-- Center Logo -->
                <div
                  class="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-black shadow-lg"
                >
                  <img src="/favicon.webp" class="h-4 w-4" alt="logo" />
                </div>
              </div>
            </div>
          </div>
          <p class="text-white/80 text-xs">{{ t("scan_qr") }}</p>
          <p class="text-blue-500 text-xs">{{ t("ios_lite_app") }}</p>
          <button
            @click="downloadIOS"
            aria-label="Download IOS APP"
            class="gold-bg h-10 px-6 flex items-center rounded-full"
          >
            <p class="text-glow font-semibold text-sm">{{ t("download") }}</p>
          </button>
        </div>

        <div class="flex flex-col items-center gap-2">
          <div
            class="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-zinc-800 to-black/90 p-2 shadow-2xl"
          >
            <!-- Glow -->
            <div
              class="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-cyan-500/10"
            />
            <div class="relative z-10 flex flex-col items-center">
              <!-- QR Wrapper -->
              <div
                class="relative rounded-xl bg-white p-4 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
              >
                <QrcodeVue
                  :value="androidUrl"
                  :size="90"
                  level="H"
                  background="#ffffff"
                  foreground="#000000"
                />
                <div
                  class="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-black shadow-lg"
                >
                  <img src="/favicon.webp" class="h-4 w-4" alt="logo" />
                </div>
              </div>
            </div>
          </div>
          <p class="text-white/80 text-xs">{{ t("scan_qr") }}</p>
          <p class="text-green-500 text-xs">{{ t("android_apk") }}</p>
          <button
            @click="downloadAndroid"
            aria-label="Download Android APP"
            class="gold-bg h-10 px-6 flex items-center rounded-full"
          >
            <p class="text-glow font-semibold text-sm">
              {{ t("download_apk") }}
            </p>
          </button>
        </div>
      </div>
      <div class="w-full flex flex-col items-center">
        <img
          src="/images/phone.webp"
          class="w-3/4"
          loading="lazy"
          fetchpriority="low"
          alt="mobile_image"
        />
      </div>
    </section>
  </main>
  <Footer />
</template>
