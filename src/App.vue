<script setup lang="ts">
import AuthModal from "@/components/Auth.vue";
import { Toaster } from "./components/ui/sonner";
import "vue-sonner/style.css";
import BottomNav from "./components/layout/bottomNav.vue";
import { onMounted, onUnmounted } from "vue";
import TopNavBar from "./components/layout/topNavBar.vue";
import GameDrawer from "./components/gameDrawer.vue";

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const referral = urlParams.get("rid");

  if (referral) {
    localStorage.setItem("referral_code", referral);
  }
  window.addEventListener("pageshow", handlePageShow);
});

onUnmounted(() => {
  window.removeEventListener("pageshow", handlePageShow);
});

const handlePageShow = (event: PageTransitionEvent) => {
  if (event.persisted) {
    console.log("reload")
    window.location.reload();
  }
}

</script>

<template>
  <main
    class="min-h-screen w-full relative bg-gray-950 text-gray-100"
  >
   <TopNavBar/>
    <div
      class="w-full relative flex flex-col items-center bg-gray-900"
    >
      <router-view />
      <AuthModal />
      <BottomNav />
      <GameDrawer />
    </div>
    <Toaster position="top-left" richColors />
  </main>
</template>

