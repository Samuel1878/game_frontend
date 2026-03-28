<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const changeLang = (lang: string|any) => {
  locale.value = lang;
  localStorage.setItem("lang", lang);
};

const flags:any = {
  en: "🇬🇧",
  cn: "🇨🇳",
  mm: "🇲🇲",
};
</script>

<template>
  <Select
    :model-value="locale"
    @update:model-value="changeLang"
    class="bg-gray-900 border-0"
  >
    <SelectTrigger class="text-2xl border-0 text-center">
      <span>{{ flags[locale] }}</span>
    </SelectTrigger>

    <SelectContent class="bg-gray-800 border border-gray-700 px-4">
      <SelectItem value="en" class="text-gray-100 font-bold py-2 text-md border-b border-b-gray-700">
        <span class="mr-2">{{ flags.en }}</span> English
      </SelectItem>
      <SelectItem value="cn" class="text-gray-100 py-2 font-bold text-md border-b border-b-gray-700">
        <span class="mr-2">{{ flags.cn }}</span> 中文
      </SelectItem>
      <SelectItem value="mm" class="text-gray-100 py-2 font-bold text-md">
        <span class="mr-2">{{ flags.mm }}</span> မြန်မာ
      </SelectItem>
    </SelectContent>
  </Select>
</template>