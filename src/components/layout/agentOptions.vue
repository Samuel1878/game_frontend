<script setup lang="ts">
import { computed } from "vue";
import router from "@/router";
import { LayoutDashboard, Network, Trophy, Users } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  currentPage?: "summary" | "players" | "agents" | "dividends";
  /** Backward compatibility for legacy, no-longer-routed agent screens. */
  current_page?: string;
}>();
const { t } = useI18n();

const currentPage = computed(() => {
  if (props.currentPage) return props.currentPage;
  if (props.current_page === "overview") return "summary";
  if (props.current_page === "rewards" || props.current_page === "tx") return "dividends";
  return "players";
});

const tabs = [
  { label: "summary", icon: LayoutDashboard, path: "/user/agent-center/overview" },
  { label: "players", icon: Users, path: "/user/agent-center/users" },
  { label: "agents", icon: Network, path: "/user/agent-center/agents" },
  { label: "dividends", icon: Trophy, path: "/user/agent-center/dividends" },
] as const;
</script>

<template>
  <nav class="sticky top-0 z-10 flex items-center justify-between border-b border-amber-400/10 bg-[#111827]/95 p-2 shadow-xl backdrop-blur">
    <button
      v-for="tab in tabs"
      :key="tab.path"
      type="button"
      class="flex flex-1 flex-col items-center gap-1.5 rounded-xl py-1.5 text-xs transition"
      :class="currentPage === tab.label ? 'bg-amber-400/10 text-amber-300' : 'text-gray-400'"
      @click="router.push(tab.path)"
    >
      <component :is="tab.icon" class="h-5 w-5" />
      <span class="text-[11px]">{{ t(tab.label) }}</span>
    </button>
  </nav>
</template>
