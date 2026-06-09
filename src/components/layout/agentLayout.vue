<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAgentStore } from "@/stores/agentStore";
import { onActivated } from "vue";
const agentStore = useAgentStore();

onActivated(() => {
  agentStore.fetchAgentData();
});
</script>

<template>
  <div class="min-h-screen bg-[#0b0f19] text-white w-full relative">
    <main class="pb-28">
      <router-view />
    </main>
  </div>
</template>
