<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const changeLang = (lang: string|any) => {
  locale.value = lang;
  localStorage.setItem("lang", lang);
};
const flags:any = {
  en: "🇺🇸",
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
    <SelectTrigger class="w-full border-0 bg-gray-800 py-2 space-x-4 text-gray-100 font-bold">
      <SelectValue placeholder="Language" />
    </SelectTrigger>

    <SelectContent class="bg-gray-800 border-gray-700">
      <SelectItem value="en" class="text-gray-100 font-bold border-b border-b-gray-700"><span>{{ flags.en }}</span>English  </SelectItem>
      <SelectItem value="cn" class="text-gray-100 font-bold border-b border-b-gray-700"><span>{{ flags.cn }}</span>中文  </SelectItem>
      <SelectItem value="mm" class="text-gray-100 font-bold border-b border-b-gray-700"> <span>{{ flags.mm }}</span>မြန်မာ </SelectItem>
    </SelectContent>
  </Select>
</template>