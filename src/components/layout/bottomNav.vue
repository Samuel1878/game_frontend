<script setup lang="ts">
import {
  User,
  GiftIcon,
  Wallet,
  BanknoteArrowDown,
  LayoutGrid,
} from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
// import { menu } from "@/utils/assets";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const navItems = [
  { name: "promotion", icon: GiftIcon, path: "/promotions" },
  { name: "deposit", icon: Wallet, path: "/deposit" },
  { name: "home",icon: LayoutGrid, path: "/" },
  { name: "withdraw", icon: BanknoteArrowDown, path: "/withdraw" },
  { name: "profile", icon: User, path: "/user/profile" },
];
const go = (path: string) => {
  router.push(path);
};
const activeIndex = computed(() =>
  navItems.findIndex((item) => route.path === item.path),
);
const indicatorStyle = computed(() => {
  const index = activeIndex.value;
  return {
    transform: `translateX(${index * 100}%)`,
  };
});
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center"
    v-if="!route.meta.hideNavbar"
  >
    <div
      class="relative max-w-md w-full overflow-hidden bg-gray-900 border-t-2 border-t-gray-700/20 shadow-lg"
    >
      <div class="absolute bottom-0 left-0 h-1 w-full">
        <div
          class="h-1 w-1/5 gold-bg transition-all duration-300 drop-shadow-[0_0_20px_#f8ab38]"
          :style="indicatorStyle"
        />
      </div>

      <div class="grid grid-cols-5 h-15 items-center relative">
        <template v-for="item in navItems" :key="item.name">
          <!-- <div v-if="item.center" class="relative flex justify-center">
            <button
              @click="go(item.path)"
              class="absolute -top-8 w-16 h-16 rounded-full text-amber-400 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-[0_0_14px_#FACC15]"
            >
              <img :src="menu" class="w-6 h-6" alt="Home"/>
            </button>
          </div> -->

          <button
            @click="go(item.path)"
            class="flex flex-col items-center justify-center gap-1 text-xs transition"
            :class="
              route.path === item.path
                ? 'text-yellow-500'
                : 'text-gray-300 hover:text-white'
            "
          >
            <component :is="item.icon || 'div'" class="w-6 h-6" />
            <span class="font-bold text-xs">{{ t(item.name) }}</span>
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
