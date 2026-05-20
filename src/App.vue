<script setup lang="ts">
import { Toaster } from "./components/ui/sonner";
import "vue-sonner/style.css";
import BottomNav from "./components/layout/bottomNav.vue";
import TopNavBar from "./components/layout/topNavBar.vue";
import { defineAsyncComponent, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useReferralStore } from "./stores/referralStore";
import { useRoute } from "vue-router";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
// import Loading from "./components/loading.vue";
import { useLoaderStore } from "./stores/loaderStore";
import { storeToRefs } from "pinia";
const DownloadNav = defineAsyncComponent(
  () => import("./components/layout/downloadNav.vue"),
);
const SideBar = defineAsyncComponent(() => import("@/components/sideBar.vue"));
const UpdatePopup = defineAsyncComponent(
  () => import("./components/updatePopup.vue"),
);
const GameDrawer = defineAsyncComponent(
  () => import("./components/gameDrawer.vue"),
);
const AuthModal = defineAsyncComponent(() => import("@/components/Auth.vue"));
const route = useRoute();
const referralStore = useReferralStore();
const { locale } = useI18n();

const store = useLoaderStore();
const { transitioning } = storeToRefs(store);
watch(
  locale,
  (lang) => {
    document.documentElement.classList.remove("lang-en", "lang-my", "lang-zh");

    if (lang === "mm") {
      document.documentElement.classList.add("lang-my");
    } else if (lang === "cn") {
      document.documentElement.classList.add("lang-zh");
    } else {
      document.documentElement.classList.add("lang-en");
    }
  },
  { immediate: true },
);
watch(
  () => route.query.rid,
  (rid) => {
    if (typeof rid !== "string") return;
    if (/^[A-Z][0-9]{3}$/.test(rid)) {
      referralStore.setReferral(rid);
    }
  },
  { immediate: true },
);
</script>

<template>
  <SidebarProvider :default-open="true">
    <div class="flex min-h-dvh w-full bg-gray-950">
      <SideBar />
      <SidebarInset class="flex flex-col flex-1 min-w-0 bg-gray-900">
        <DownloadNav />
        <TopNavBar />
        <div class="relative flex-1 flex flex-col items-center w-full">
          <div class="relative flex-1 overflow-hidden flex-col items-center w-full">
            <router-view v-slot="{ Component, route }">
              <transition
                mode="out-in"
                enter-active-class="duration-200 ease-out transition-all"
                enter-from-class="opacity-100 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="duration-150 ease-in transition-all"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <div
                  :key="route.fullPath"
                  class="w-full min-h-dvh"
                >
                  <component :is="Component" />
                </div>
              </transition>
            </router-view>

              <div
                v-if="transitioning"
                class="absolute inset-0 z-9999 flex items-center justify-center bg-black/10"
              >
                <div
                  class="w-10 h-10 rounded-full border-2 border-white/20 border-t-yellow-400 animate-spin"
                />
              </div>

          </div>

          <!-- <router-view /> -->

          <UpdatePopup />
          <AuthModal />
          <GameDrawer />
        </div>

        <BottomNav class="md:hidden" />
      </SidebarInset>
    </div>

    <Toaster position="top-left" richColors />
  </SidebarProvider>
</template>
<!-- <div class="min-h-screen w-full bg-black flex justify-center gap-8 flex-col">
          <p class="text-2xl text-red-600">
            Maintainance Alert!
          </p>
          <p class="text-md text-yellow-300">
            We are updating the system for the better game play experience. It will be done by tonight 5 PM. 
          </p>
          <p class="text-lg text-yellow-50">
            ပိုမိုကောင်းမွန် သော ဂိမ်းအတွေ့ကြုံနင့် နိုင်ပွဲများ အတွက် ဆာဗာ ပြင်ဆင်နေပါ သဖြင့် ယနေ့ည ၅ နာရီမှသာပြန်လည် ကစားနိုင် မည် ဖြစ်သည်
          </p>
        </div> -->
