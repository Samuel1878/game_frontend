<script setup lang="ts">
import AuthModal from "@/components/Auth.vue";
import { Toaster } from "./components/ui/sonner";
import "vue-sonner/style.css";
import BottomNav from "./components/layout/bottomNav.vue";
import { onMounted } from "vue";
import TopNavBar from "./components/layout/topNavBar.vue";
import GameDrawer from "./components/gameDrawer.vue";

import { useReferralStore } from "./stores/referralStore";
import { useRoute } from "vue-router";
import SideBar from "./components/sideBar.vue";
import SidebarProvider from "./components/ui/sidebar/SidebarProvider.vue";
import SidebarInset from "./components/ui/sidebar/SidebarInset.vue";
const referralStore = useReferralStore();
const route = useRoute();
onMounted(() => {
  const refFromUrl = route.query.rid as string;
  console.log(refFromUrl);
  if (refFromUrl && /^[A-Z][0-9]{3}$/.test(refFromUrl)) {
    referralStore.setReferral(refFromUrl);
    console.log("[REFERRAL CAPTURED]:", refFromUrl);
  }
});
</script>

<template>
  <!-- Force the sidebar to be open by default with :default-open="true" -->
  <SidebarProvider :default-open="true">
    <div class="flex min-h-screen w-full bg-gray-950">
      <SideBar />
      <SidebarInset class="flex flex-col flex-1 min-w-0 bg-gray-900">
        
        <TopNavBar />
        <div class="relative flex-1 flex flex-col items-center w-full">
          <router-view />
          
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
