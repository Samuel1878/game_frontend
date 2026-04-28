<script setup lang="ts">
import { RouterView, useRoute, useRouter } from "vue-router";
import CustomNavBar from "./customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "../languageBtn.vue";
import { Headset } from "lucide-vue-next";
import { getAgentDataByIdAPI } from "@/services/agentAPI";
import { useAgentStore } from "@/stores/agentStore";
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
const agentStore = useAgentStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const fetchAgentData = async () => {
  if (!authStore.user?.agent_id) return;
  agentStore.loading = true;
  try {
        const res = await getAgentDataByIdAPI( authStore.user.agent_id);
        console.log("Agent Data", res)
        if (res) {
            agentStore.setAgentData(res);
        }
  } catch (err) {
    console.error(err);
  } finally {
    agentStore.loading = false;
  }
};
onMounted(() => {
    fetchAgentData()
})
const tabs = [
  { label: "home", icon: "🏠", path: "/" },

  { label: "Tx", icon: "💰", path: "/user/agent-center/transactions" },
    { label: "Overview", icon: "📊", path: "/user/agent-center/overview", center:true },
  { label: "Users", icon: "👥", path: "/user/agent-center/users" },
  { label: "Rewards", icon: "🎁", path: "/user/agent-center/rewards" },
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
        v-for="t in tabs"
        :key="t.path"
        @click="go(t.path)"
        class="flex flex-col items-center flex-1 py-2 text-xs relative"
        :class="route.path === t.path ? 'text-white' : 'text-gray-400'"
      >
        <!-- CENTER BUTTON -->
        <div v-if="t.center"
             class="absolute -top-6 bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-[#0b0f19]">
          <span class="text-xl">{{ t.icon }}</span>
        </div>

        <!-- NORMAL BUTTON -->
        <template v-else>
          <span class="text-lg">{{ t.icon }}</span>
        </template>

        <span :class="t.center ? 'mt-6 text-[11px]' : 'text-[11px]'">
          {{ t.label }}
        </span>
      </button>
    </nav>

  </div>
</template>