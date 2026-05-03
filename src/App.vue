<script setup lang="ts">
import AuthModal from "@/components/Auth.vue";
import { Toaster } from "./components/ui/sonner";
import "vue-sonner/style.css";
import BottomNav from "./components/layout/bottomNav.vue";
import { onMounted } from "vue";
import TopNavBar from "./components/layout/topNavBar.vue";
import GameDrawer from "./components/gameDrawer.vue";

import SnowParticle from "@/components/particles.vue";
import { useReferralStore } from "./stores/referralStore";
import { useRoute } from "vue-router";
const referralStore = useReferralStore();
const route = useRoute()
onMounted(() => {
  const refFromUrl = route.query.rid as string;

  if (refFromUrl && /^[A-Z][0-9]{3}$/.test(refFromUrl)) {
    referralStore.setReferral(refFromUrl);

    console.log("[REFERRAL CAPTURED]:", refFromUrl);
  }
});

</script>

<template>
  <main class="min-h-screen w-full relative bg-gray-950 text-gray-100 overflow-hidden">

    <!-- BACKGROUND LAYER -->
    <SnowParticle class="absolute inset-0 z-0" >
   
    <!-- UI LAYER -->
    <div class="relative z-10">
      
      <TopNavBar />

      <div class="w-full relative flex flex-col items-center bg-gray-900">

        <div class="min-h-screen w-full bg-black flex justify-center gap-8 flex-col">
          <p class="text-2xl text-red-600">
            Maintainance Alert!
          </p>
          <p class="text-md text-yellow-300">
            We are updating the system for the better game play experience. It will be done by tonight 5 PM. 
          </p>
          <p class="text-lg text-yellow-50">
            ပိုမိုကောင်းမွန် သော ဂိမ်းအတွေ့ကြုံနင့် နိုင်ပွဲများ အတွက် ဆာဗာ ပြင်ဆင်နေပါ သဖြင့် ယနေ့ည ၅ နာရီမှသာပြန်လည် ကစားနိုင် မည် ဖြစ်သည်
          </p>
        </div>
        <!-- <router-view />
        <AuthModal />
        <BottomNav />
        <GameDrawer /> -->
       
      </div>

    </div>

 </SnowParticle>
    <Toaster position="top-left" richColors />
  </main>
</template>

