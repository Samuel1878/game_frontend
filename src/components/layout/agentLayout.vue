<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import { AlignEndHorizontal, FileChartColumn, House, Trophy, Users } from "lucide-vue-next";
import { useAgentStore } from "@/stores/agentStore";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
const agentStore = useAgentStore();
const route = useRoute();
const router = useRouter();

const {t} = useI18n()
onMounted(() => {
    agentStore.fetchAgentData()
})
const tabs = [
  { label: "home", icon: House, path: "/" },

  { label: "tx", icon: FileChartColumn, path: "/user/agent-center/transactions" },
    { label: "overview", icon: AlignEndHorizontal, path: "/user/agent-center/overview", center:true },
  { label: "players", icon: Users, path: "/user/agent-center/users" },
  { label: "rewards", icon: Trophy, path: "/user/agent-center/rewards" },
];

const go = (p: string) => router.push(p);
</script>

<template>
  <div class="min-h-screen bg-[#0b0f19] text-white w-full">

    <main class="pb-28">
      <router-view />
    </main>

   <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-[#111827]/90 backdrop-blur border border-white/10 rounded-2xl px-2 py-2 flex justify-between items-center shadow-xl">
      <button
        v-for="tb in tabs"
        :key="tb.path"
        @click="go(tb.path)"
        class="flex flex-col items-center flex-1 py-2 text-xs relative"
        :class="route.path === tb.path ? 'text-white' : 'text-gray-400'"
      >
        <!-- CENTER BUTTON -->
        <div v-if="tb.center"
             class="absolute -top-6 bg-yellow-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-[#0b0f19]">
           <component :is="tb.icon || 'div'" class="w-7 h-7 text-gray-950" />
        </div>

        <!-- NORMAL BUTTON -->
        <template v-else>
          <component :is="tb.icon || 'div'" class="w-6 h-6" />
        </template>

        <span :class="tb.center ? 'mt-6 text-[11px]' : 'text-[11px]'">
          {{ t(tb.label) }}
        </span>
      </button>
    </nav>

  </div>
</template>