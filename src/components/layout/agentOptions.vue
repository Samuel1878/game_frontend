<script setup lang="ts">
import router from "@/router";
import {
  AlignEndHorizontal,
  FileChartColumn,
  Trophy,
  Users,
} from "lucide-vue-next";
import { useI18n } from "vue-i18n";
const props = defineProps<{ current_page: string }>();
const { t } = useI18n();
const gotoPath = (path: string) => {
  router.push(path);
};
const tabs = [
 {
    label: "overview",
    icon: AlignEndHorizontal,
    path: "/user/agent-center/overview",
  },
   { label: "players", icon: Users, path: "/user/agent-center/users" },
  {
    label: "tx",
    icon: FileChartColumn,
    path: "/user/agent-center/transactions",
  },
  
 
  { label: "rewards", icon: Trophy, path: "/user/agent-center/rewards" },
];
</script>
<template>
  <nav
    class="bg-[#111827]/90 backdrop-blur border-b border-white/10 p-2 flex justify-between items-center shadow-xl"
  >
    <button
      v-for="tb in tabs"
      :key="tb.path"
      @click="gotoPath(tb.path)"
      class="flex flex-col items-center flex-1 gap-2 text-xs relative"
      :class="props.current_page === tb.label ? 'text-white' : 'text-gray-400'"
    >
      <component :is="tb.icon || 'div'" class="w-6 h-6" />
      <span class="text-[11px]">
        {{ t(tb.label) }}
      </span>
    </button>
  </nav>
</template>
