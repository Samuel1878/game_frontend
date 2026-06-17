<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ChevronDown } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { cn_flag, en_flag, mm_flag } from "@/utils/assets";

type Lang = "en" | "cn" | "mm";

const { locale } = useI18n();
const open = ref(false);
const root = ref<HTMLElement | null>(null);

const languages: Record<Lang, { label: string; flag: string }> = {
  en: { label: "English", flag: en_flag },
  cn: { label: "中文", flag: cn_flag },
  mm: { label: "မြန်မာ", flag: mm_flag },
};

const currentLang = computed(() => languages[(locale.value as Lang) || "en"]);

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
  <div ref="root" class="relative flex items-center gap-2 justify-between bg-gray-700/20 px-4 rounded-lg">
    <button
      type="button"
      class="h-10 w-full hover:opacity-80 transition-opacity flex items-center gap-2 justify-around"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
      @keydown.escape.stop.prevent="open = false"
    >
      <img :src="currentLang.flag" class="w-5 h-5 rounded-sm object-cover shadow-sm" alt="Selected language flag" />
      <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">
        {{ currentLang.label }}
      </span>
      <ChevronDown class="h-4 w-4 text-gray-400 transition-transform" :class="open ? 'rotate-180' : ''" />
    </button>

    <div
      v-if="open"
      role="listbox"
      aria-label="Language"
      class="absolute bottom-full left-0 z-50 mb-2 w-full rounded-md bg-[#1a1f2c] border border-white/10 p-1 shadow-2xl"
    >
      <button
        v-for="(lang, key) in languages"
        :key="key"
        type="button"
        role="option"
        :aria-selected="locale === key"
        class="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white cursor-pointer rounded-md transition-colors"
        @click="changeLang(key)"
      >
        <img :src="lang.flag" class="w-5 h-5 rounded-sm object-cover" alt="Language flag" />
        <span>{{ lang.label }}</span>
      </button>
    </div>
  </div>
</template>
