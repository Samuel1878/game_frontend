<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { Globe } from "lucide-vue-next";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { cn_flag, en_flag, mm_flag } from "@/utils/assets";

type Lang = "en" | "cn" | "mm";

const { locale } = useI18n();
const open = ref(false);
const root = ref<HTMLElement | null>(null);

const languages: Array<{ value: Lang; label: string; flag: string; alt: string }> = [
  { value: "en", label: "English", flag: en_flag, alt: "English flag" },
  { value: "cn", label: "中文", flag: cn_flag, alt: "Chinese flag" },
  { value: "mm", label: "မြန်မာ", flag: mm_flag, alt: "Myanmar flag" },
];

const changeLang = (lang: Lang) => {
  locale.value = lang;
  localStorage.setItem("lang", lang);
  open.value = false;
};

onClickOutside(root, () => {
  open.value = false;
});
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="border-0 text-lg px-1 outline-0 ring-0"
      aria-label="change-language"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
      @keydown.escape.stop.prevent="open = false"
    >
      <Globe class="w-7 h-7 text-white" />
    </button>

    <div
      v-if="open"
      role="listbox"
      aria-label="Language"
      class="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-md bg-gray-800 border border-gray-700 p-2 shadow-2xl"
    >
      <button
        v-for="lang in languages"
        :key="lang.value"
        type="button"
        role="option"
        :aria-selected="locale === lang.value"
        class="flex w-full items-center gap-2 text-left text-gray-100 font-bold py-2 text-md border-b border-b-gray-700 last:border-b-0 hover:bg-white/5 rounded-sm"
        @click="changeLang(lang.value)"
      >
        <img :src="lang.flag" class="w-8 h-8" :alt="lang.alt" />
        <span>{{ lang.label }}</span>
      </button>
    </div>
  </div>
</template>
