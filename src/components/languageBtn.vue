<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { cn_flag, en_flag, mm_flag } from '@/utils/assets';
import { Globe } from 'lucide-vue-next';
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const changeLang = (lang: string|any) => {
  locale.value = lang;
  localStorage.setItem("lang", lang);
};
const flags:any = {
  en: en_flag,
  cn: cn_flag,
  mm: mm_flag,
};
</script>
<template>
  <Select
    :model-value="locale"
    @update:model-value="changeLang"
    class="border-0"
  >
    <SelectTrigger class="border-0 text-lg px-1 outline-0 ring-0" aria-label="change-language">
      <!-- <img :src="flags[locale]" class="w-7 h-7" /> -->
      <Globe class="w-7 h-7 text-white"/>
    </SelectTrigger>
    <SelectContent class="bg-gray-800 border border-gray-700 p-2">
      <SelectItem value="en" class="text-gray-100 font-bold py-2 text-md border-b border-b-gray-700">
        <span class="mr-2"><img :src="flags.en" class="w-8 h-8" alt="English flag"/></span> English
      </SelectItem>
      <SelectItem value="cn" class="text-gray-100 py-2 font-bold text-md border-b border-b-gray-700">
        <span class="mr-2"><img :src="flags.cn" class="w-8 h-8" alt="Chinese flag"/></span> 中文
      </SelectItem>
      <SelectItem value="mm" class="text-gray-100 py-2 font-bold text-md">
        <span class="mr-2"><img :src="flags.mm" class="w-8 h-8" alt="Myanmar flag"/></span> မြန်မာ
      </SelectItem>
    </SelectContent>
  </Select>
</template>