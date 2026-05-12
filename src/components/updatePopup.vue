<script setup lang="ts">
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useAppUpdate } from "@/lib/updateMobileHook";

const { locale } = useI18n();

const {
  showUpdate,
  updateData,
  downloadUpdate,
} = useAppUpdate();

/**
 * Mobile only
 */
const isApp = () => {
  // 1. Check for Capacitor (most common in modern Vue/Ionic apps)
  const isCapacitor = (window as any).Capacitor?.isNative;

  // 2. Check for Cordova/PhoneGap
  const isCordova = !!(window as any).cordova;

  // 3. Protocol Check (Apps often run on capacitor://, ionic://, or file://)
  const isAppProtocol = ['capacitor:', 'http://localhost', 'file:', 'ionic:'].includes(window.location.protocol);

  // 4. Custom User Agent (If you injected a unique string into your App's WebView)
  // Most professional apps add something like "TZ99-APP" to the UA in native settings.
  const isCustomUA = navigator.userAgent.includes("TZ99-APP");

  return isCapacitor || isCordova || isAppProtocol || isCustomUA;
};
/**
 * Current language
 */
const currentLang = computed(() => {
  if (locale.value === "cn") return "cn";
  if (locale.value === "mm") return "mm";

  return "en";
});

/**
 * Dynamic localized fields
 */
const getField = (key: string) => {
  return computed(() => {
    return (
      updateData.value?.[
        `${key}_${currentLang.value}`
      ] || ""
    );
  });
};

const updateTitle = getField("title");

const updateDescription =
  getField("description");

const updateButton = getField("button");

const updateNotice = getField("notice");

/**
 * Lock body scroll
 */
watch(showUpdate, (val) => {
  document.body.style.overflow =
    val ? "hidden" : "";
});
</script>
 <!-- v-if="showUpdate && isMobile" -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
       v-if="showUpdate && isApp()" 
        class="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-xl px-5"
      >
        <!-- Card -->
        <div
          class="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl"
        >
          <!-- Glow -->
          <div
            class="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-yellow-500/10 blur-3xl"
          />

          <div class="relative z-10 p-6">
            <!-- Icon -->
            <div
              class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-b from-yellow-300 to-yellow-600 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 16V4m0 0l-4 4m4-4l4 4m4 8H4"
                />
              </svg>
            </div>

            <!-- Title -->
            <h2
              class="mt-5 text-center text-2xl font-black tracking-tight text-white"
            >
              {{ updateTitle }}
            </h2>

            <!-- Tags -->
            <div
              class="mt-3 flex items-center justify-center gap-2"
            >
              <span
                class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-gray-300"
              >
                v{{ updateData?.version }}
              </span>

              <span
                class="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-yellow-400"
              >
                FORCE UPDATE
              </span>
            </div>

            <!-- Description -->
            <p
              class="mt-5 text-center text-sm leading-relaxed text-gray-400"
            >
              {{ updateDescription }}
            </p>

            <!-- Button -->
            <button
              @click="downloadUpdate"
              class="mt-7 h-14 w-full rounded-2xl bg-linear-to-b from-yellow-300 to-yellow-600 text-base font-black text-black transition active:scale-[0.98]"
            >
              {{ updateButton }}
            </button>

            <!-- Footer -->
            <p
              class="mt-4 text-center text-[10px] italic text-gray-500"
            >
              {{ updateNotice }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>