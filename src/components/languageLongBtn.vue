<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { cn_flag, en_flag, mm_flag } from '@/utils/assets';
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const changeLang = (lang: string | any) => {
  locale.value = lang;
  localStorage.setItem("lang", lang);
};

const flags: any = {
  en: en_flag,
  cn: cn_flag,
  mm: mm_flag,
};

const langNames: any = {
  en: "English",
  cn: "中文",
  mm: "မြန်မာ",
};
</script>

<template>
  <div class="flex items-center gap-2 justify-between bg-gray-700/20 px-4 rounded-lg">
    <!-- Optional: Globe icon for context -->
    
    
    <Select
      :model-value="locale"
      @update:model-value="changeLang"
    >
      <SelectTrigger 
        class="border-0 h-auto p-0 shadow-none focus:ring-0 focus:ring-offset-0 hover:opacity-80 transition-opacity flex items-center gap-2 w-full justify-around"
      >
       
          <img :src="flags[locale]" class="w-5 h-5 rounded-sm object-cover shadow-sm" /> 
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {{ langNames[locale] }}
          </span>
      
      </SelectTrigger>

      <SelectContent 
        class="bg-[#1a1f2c] border border-white/10 p-1 shadow-2xl w-full"
      >
        <SelectItem 
          v-for="(flag, key) in flags" 
          :key="key" 
          :value="key" 
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-200 focus:bg-white/10 focus:text-white cursor-pointer rounded-md transition-colors"
        >
          <div class="flex items-center gap-5">
            <img :src="flag" class="w-5 h-5 rounded-sm object-cover" />
            <span>{{ langNames[key] }}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<style scoped>
/* Remove the indicator (check icon) if it interferes with your footer design */
:deep([data-radix-select-viewport] [role="menuitemcheckbox"] [data-radix-select-item-indicator]) {
  display: none;
}

/* Ensure consistent text rendering */
span {
  font-family: inherit;
}
</style>