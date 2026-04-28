<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { cn_flag, en_flag, mm_flag } from '@/utils';

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
    class="bg-gray-900 border-0"
  >
    <SelectTrigger class="border-0 px-2">
      <img :src="flags[locale]" class="w-7 h-7" />
       <!-- <Globe class=" text-gray-50 font-extrabold"/> -->
    </SelectTrigger>

    <SelectContent class="bg-gray-800 border border-gray-700 p-2">
      <SelectItem value="en" class="text-gray-100 font-bold py-2 text-md border-b border-b-gray-700">
        <span class="mr-2"><img :src="flags.en" class="w-8 h-8" /></span> English
      </SelectItem>
      <SelectItem value="cn" class="text-gray-100 py-2 font-bold text-md border-b border-b-gray-700">
        <span class="mr-2"><img :src="flags.cn" class="w-8 h-8" /></span> 中文
      </SelectItem>
      <SelectItem value="mm" class="text-gray-100 py-2 font-bold text-md">
        <span class="mr-2"><img :src="flags.mm" class="w-8 h-8" /></span> မြန်မာ
      </SelectItem>
    </SelectContent>
  </Select>
</template>