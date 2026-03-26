<script setup lang="ts">
import { Home, Gamepad2, User, CoinsIcon, BanknoteArrowDownIcon, BanknoteArrowUp } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { menu } from "@/utils";

const route = useRoute();
const router = useRouter();
const {t } = useI18n();
const navItems = [
  { name: "home", icon: Home, path: "/" },
  { name: "deposit", icon: BanknoteArrowDownIcon, path: "/deposit" },
  { name: "games", icon: Gamepad2, path: "/games", center: true },
  { name: "withdraw", icon: BanknoteArrowUp, path: "/withdrawal" },
  { name: "profile", icon: User, path: "/profile" },
];
const go = (path: string) => {
  router.push(path);
};
const activeIndex = computed(() =>
  navItems.findIndex((item) => route.path === item.path)
);
const indicatorStyle = computed(() => {
  const index = activeIndex.value;
  return {
    transform: `translateX(${index * 100}%)`,
  };
});
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center">
    
    <div
      class="relative w-full max-w-md
            ring-1
            ring-gray-700
             bg-[#020617]/90 backdrop-blur-xl
             border-t border-t-white/10
             rounded-t-3xl shadow-lg overflow-hidden"
    >
      
      <div class="absolute top-0 left-0 w-full h-1">
        <div
          class="h-1 w-1/5 bg-sky-400 transition-all duration-300
                 drop-shadow-[0_0_8px_#38BDF8]"
          :style="indicatorStyle"
        />
      </div>

      <div class="grid grid-cols-5 h-16 items-center relative">
        
        <template v-for="item in navItems" :key="item.name">
          
          <div v-if="item.center" class="relative flex justify-center">
            <button
              @click="go(item.path)"
              class="absolute -top-8
                     w-16 h-16 rounded-full
                      text-amber-400
                     flex items-center justify-center
                     shadow-lg
                     transition-all duration-300
                     hover:scale-110 active:scale-95
                     drop-shadow-[0_0_14px_#FACC15]"
            >
              <img :src="menu" class="w-6 h-6" />
            </button>
          </div>

          <button
            v-else
            @click="go(item.path)"
            class="flex flex-col items-center justify-center gap-1 text-xs transition"
            :class="route.path === item.path
              ? 'text-sky-400'
              : 'text-gray-500 hover:text-white'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ t(item.name) }}</span>
          </button>

        </template>

      </div>
    </div>
  </nav>
</template>