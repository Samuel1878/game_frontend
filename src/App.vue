<script setup lang="ts">
import { Toaster } from "./components/ui/sonner";
import "vue-sonner/style.css";
import BottomNav from "./components/layout/bottomNav.vue";
import TopNavBar from "./components/layout/topNavBar.vue";
import { defineAsyncComponent, onMounted, watch } from "vue";
import { useReferralStore } from "./stores/referralStore";
import { useRoute } from "vue-router";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/vue"
import { Analytics } from "@vercel/analytics/vue"
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
const route = useRoute();
const referralStore = useReferralStore();
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

onMounted(() => {
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
});
</script>

<template>
  <SidebarProvider :default-open="true">
    <div class="flex min-h-screen w-full bg-gray-950">
      <SideBar />
      <SidebarInset class="flex flex-col flex-1 min-w-0 bg-gray-900">
        <DownloadNav />
        <TopNavBar />
        <div class="relative flex-1 flex flex-col items-center w-full">
          <router-view v-slot="{ Component }">
            <!-- <keep-alive>
              <Suspense> -->
                <!-- <template #default> -->
                  <component :is="Component" />
                <!-- </template> -->
                <!-- <template #fallback>
                  <div class="flex items-center justify-center h-screen w-full">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                  </div>
                </template> -->
              <!-- </Suspense>
            </keep-alive> -->
          </router-view>
          <UpdatePopup />
          <GameDrawer />
        </div>
        <BottomNav class="md:hidden" />
      </SidebarInset>
    </div>
    <Toaster position="top-left" richColors />
  </SidebarProvider>
  <SpeedInsights />
  <Analytics/>
</template>
