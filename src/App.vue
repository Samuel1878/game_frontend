<script setup lang="ts">
import { Toaster } from "./components/ui/sonner";
import "vue-sonner/style.css";
import BottomNav from "./components/layout/bottomNav.vue";
import TopNavBar from "./components/layout/topNavBar.vue";
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useReferralStore } from "./stores/referralStore";
import { useRoute } from "vue-router";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { useAuthStore } from "./stores/auth";
import { useNotificationStore } from "./stores/notification";
import { useI18n } from "vue-i18n";
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
const SpeedInsights = import.meta.env.PROD
  ? defineAsyncComponent(() =>
      import("@vercel/speed-insights/vue").then((module) => module.SpeedInsights),
    )
  : null;
const Analytics = import.meta.env.PROD
  ? defineAsyncComponent(() =>
      import("@vercel/analytics/vue").then((module) => module.Analytics),
    )
  : null;
const isDesktop = ref(false);
const route = useRoute();
const referralStore = useReferralStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const { locale } = useI18n();

watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      void notificationStore.fetchUnreadCount();
      return;
    }
    notificationStore.reset();
  },
  { immediate: true, flush: "sync" },
);

watch(locale, () => {
  if (!authStore.isLoggedIn) return;
  void notificationStore.fetchUnreadCount();
  void notificationStore.refreshForCurrentLanguage();
});

authStore.$onAction(({ name, after }) => {
  if (name !== "revalidate") return;
  after(() => {
    if (authStore.isLoggedIn) {
      void notificationStore.fetchUnreadCount();
    }
  });
});

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

const loadTawk = () => {
  if ((window as any).Tawk_API) return;
  (window as any).Tawk_API = (window as any).Tawk_API || {};
  (window as any).Tawk_LoadStart = new Date();
  (window as any).Tawk_API.customStyle = {
    visibility: {
      desktop: {
        position: "br",
        xOffset: 10,
        yOffset: 80,
      },
      mobile: {
        position: "br",
        xOffset: 10,
        yOffset: 80,
      },
    },
  };
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = "https://embed.tawk.to/69d614b826e9591c36b0cf98/1jlm41sjh";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  document.head.appendChild(s1);
};

onMounted(() => {
  isDesktop.value = window.innerWidth >= 1280
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadTawk, { timeout: 3000 });
  } else {
    globalThis.setTimeout(loadTawk, 1500);
  }
});
</script>
<template>
  <SidebarProvider :default-open="isDesktop" :key="isDesktop.toString()">
    <div class="flex min-h-dvh w-full bg-gray-950 ios-scroll-fix">
      <SideBar />
      <SidebarInset class="flex flex-col flex-1 min-w-0 bg-gray-900">
        <DownloadNav v-if="!route.meta.hideNavbar" />
        <TopNavBar v-if="!route.meta.hideTopNav" />
        <div class="relative flex-1 flex flex-col items-center w-full">
          <router-view v-slot="{ Component }">
            <Suspense>
              <template #default>
                <keep-alive v-if="route.meta.keepAlive">
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
                <component v-else :is="Component" :key="route.fullPath" />
              </template>
              <template #fallback>
                <div
                  class="flex items-center justify-center h-screen w-full"
                  style="transform: translateZ(0)"
                >
                  <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"
                  ></div>
                </div>
              </template>
            </Suspense>
          </router-view>
          <UpdatePopup />
          <GameDrawer v-if="!route.meta.hideNavbar" />
        </div>
      </SidebarInset>
    </div>
    <Toaster position="top-left" richColors />
    <BottomNav v-if="!route.meta.hideNavbar" class="md:hidden" />
  </SidebarProvider>
  <component :is="SpeedInsights" v-if="SpeedInsights" />
  <component :is="Analytics" v-if="Analytics" />
</template>
<style scoped>
.ios-scroll-fix {
  /* Forces the layout container to use hardware acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}

/* Force iOS WebKit to maintain momentum and paint buffers */
.min-h-dvh {
  -webkit-overflow-scrolling: touch;
}
</style>
