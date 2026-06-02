<script setup lang="ts">
const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
import { homeSlide } from "@/consts";
import { ChevronDownIcon } from "lucide-vue-next";
import { defineAsyncComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const view = ref(0);

const image = [
  {
    id: 1,
    url: "/images/vip_bonus.webp",
  },
  {
    id: 2,
    url: "/images/welcome_bonus.webp",
  },
  {
    id: 3,
    url: "/images/deposit_bonus.webp",
  },
  {
    id: 4,
    url: "/images/lost_cashback.webp",
  },
];

// Smoothly toggles open or closed states inline
const togglePromo = (id: number) => {
  view.value = view.value === id ? 0 : id;
};
</script>

<template>
  <main
    class="bg-gray-900 min-h-screen max-w-lg w-full flex justify-between flex-col mx-auto border-x border-white/5"
  >
    <div class="w-full px-4 py-3">
      <!-- Header section with sleek layout treatment -->
      <h1
        class="text-center font-black text-2xl my-4 text-white uppercase tracking-wide drop-shadow-md"
      >
        {{ t("promotions") }}
      </h1>

      <!-- Interactive Collapsible Stack Container -->
      <div class="flex flex-col gap-3 w-full">
        <div
          v-for="(promo, index) in image"
          :key="promo.id"
          class="w-full flex flex-col"
        >
          <!-- Promotion Entry Banner Card -->
          <div
            @click="togglePromo(promo.id)"
            class="w-full relative cursor-pointer border-gray-500/20 rounded-lg overflow-hidden border transition-all duration-300 ease-out active:scale-[0.99] select-none"
          >
            <img
              :src="
                locale === 'cn'
                  ? homeSlide[index]?.cn_image
                  : homeSlide[index]?.image
              "
              class="w-full object-cover transition-transform duration-500"
              :class="view === promo.id ? 'scale-[1.01]' : 'scale-100'"
            />
            <div class="flex justify-between px-4 py-2">
              <h2 class="text-white font-bold text-sm drop-shadow-md">
                {{ t("view_details") }}
              </h2>
              <ChevronDownIcon
                :class="
                  view === promo.id
                    ? 'rotate-180 text-amber-400'
                    : 'rotate-0 text-white/70'
                "
                class="w-5 h-5 transition-transform duration-300"
              />
            </div>
            <div
              class="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
              :class="
                view === promo.id
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              "
            >
              <div class="overflow-hidden">
                <!-- Detailed Promo Dropdown Container Area -->
                <div
                  class="p-2 pb-4 pt-3 rounded-b-lg bg-gray-800/20 border-x border-b border-white/5 shadow-inner flex flex-col gap-3 items-center"
                >
                  <!-- Decorative UI divider line linking card elements -->

                  <!-- The Target Promotion Detailed View Image -->
                  <div
                    class="relative w-full rounded-lg overflow-hidden border border-white/5 shadow-2xl bg-gray-900"
                  >
                    <img
                      :src="promo.url"
                      class="w-full h-auto object-contain"
                      alt="Promotion Detail Window"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modern CSS Grid Collapsible Window (Guarantees hardware-accelerated 60fps animations) -->
        </div>
      </div>
    </div>
  </main>
  <Footer />
</template>
