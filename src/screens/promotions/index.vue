<script setup lang="ts">
const Footer = defineAsyncComponent(() => import("@/components/footer.vue"));
import { openChat, openTelegram } from "@/utils";
import { ChevronDownIcon, Headset } from "lucide-vue-next";
import { computed, defineAsyncComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
type bonus_type = "all" | "other" | "welcome" | "deposit";
type Types = {
  value: bonus_type;
  label: string;
};
type imageTypes = {
  id: number;
  detail_url?: string | null;
  type: bonus_type;
  cn_image: string;
  image: string;
};
const { t, locale } = useI18n();
const view = ref(0);
const choseType = ref<bonus_type>("all");
const types: Types[] = [
  {
    value: "all",
    label: "all",
  },
  {
    value: "welcome",
    label: "welcome_bonus",
  },
  {
    value: "deposit",
    label: "deposit_bonus",
  },
  {
    value: "other",
    label: "other",
  },
];
const image: imageTypes[] = [
  {
    id: 1,
    image: "/images/agent_promo.webp",
    cn_image: "/images/agent_promo_cn.webp",
    detail_url:"/images/agent_bonus.webp",
    type: "other",
  },
  {
    id: 2,
    image: "/images/slider_1.webp",
    cn_image: "/images/slider_1_cn.webp",
    detail_url: "/images/vip_bonus.webp",
    type: "other",
  },
  {
    id: 3,
    detail_url: "/images/welcome_bonus.webp",
    image: "/images/slider_2.webp",
    cn_image: "/images/slider_2_cn.webp",
    type: "welcome",
  },
  {
    id: 4,
    detail_url: "/images/deposit_bonus.webp",
    image: "/images/slider_3.webp",
    cn_image: "/images/slider_3_cn.webp",
    type: "deposit",
  },
  {
    id: 5,
    detail_url: "/images/lost_cashback.webp",
    image: "/images/slider_4.webp",
    cn_image: "/images/slider_4_cn.webp",
    type: "other",
  },
];
const filteredImages = computed(() => {
  if (choseType.value === "all") return image;
  return image.filter((item) => item.type === choseType.value);
});
const togglePromo = (id: number) => {
  view.value = view.value === id ? 0 : id;
};
</script>
<template>
  <main
    class="bg-gray-900 min-h-screen max-w-lg w-full flex justify-between flex-col mx-auto border-x border-white/5"
  >
    <div class="w-full px-4 py-3">
      <div class="flex justify-between items-center">
        <p
          class="font-black text-lg text-white uppercase tracking-wide drop-shadow-md"
        >
          {{ t("promotions") }}
        </p>
        <div class="flex gap-2">
          <div
            @click="openChat"
            class="flex justify-center items-center h-10 w-10 border bg-black rounded-full border-gray-500/20"
          >
            <Headset class="text-white w-6 h-6" />
          </div>
          <div
            @click="openTelegram"
            class="flex justify-center items-center h-10 w-10 border rounded-full border-gray-500/20"
          >
            <img src="/socials/telegram_black.svg" classw="w-6 h-6" />
          </div>
        </div>
      </div>
      <aside class="py-2">
        <div
          class="w-full p-2 relative flex justify-between gap-2 overflow-x-auto no-scrollbar scroll-smoot"
        >
          <div v-for="type in types" class="relative">
            <div
              @click="choseType = type.value"
              class="px-3 h-10 rounded-full flex items-center justify-center border cursor-pointer"
              :class="
                type.value === choseType
                  ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                  : 'bg-gray-800/20 border-gray-700/50 text-gray-300 '
              "
            >
              <p class="text-nowrap font-bold active-button text-md capitalize">
                {{ t(type.label) }}
              </p>
            </div>
          </div>
        </div>
      </aside>
      <div class="flex flex-col gap-3 w-full">
        <div
          v-for="promo in filteredImages"
          :key="promo.id"
          class="w-full flex flex-col"
        >
          <div
            @click="togglePromo(promo.id)"
            class="w-full relative cursor-pointer border-gray-500/20 rounded-lg overflow-hidden border transition-all duration-300 ease-out active:scale-[0.99] select-none"
          >
            <img
              :src="locale === 'cn' ? promo?.cn_image : promo?.image"
              class="w-full object-cover transition-transform duration-500"
              :class="view === promo.id ? 'scale-[1.01]' : 'scale-100'"
            />
            <div
              class="flex justify-between px-4 py-2"
              v-show="promo.detail_url"
            >
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
                <div
                  class="p-2 pb-4 pt-3 rounded-b-lg bg-gray-800/20 border-x border-b border-white/5 shadow-inner flex flex-col gap-3 items-center"
                >
                  <div
                    class="relative w-full rounded-lg overflow-hidden border border-white/5 shadow-2xl bg-gray-900"
                  >
                    <img
                      v-if="promo.detail_url"
                      :src="promo.detail_url"
                      class="w-full h-auto object-contain"
                      alt="Promotion Detail Window"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</template>
