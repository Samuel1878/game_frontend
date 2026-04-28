<script setup lang="ts">
import LanguageBtn from "@/components/languageBtn.vue";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import { Headset } from "lucide-vue-next";
import { ref } from "vue";

const rewards = ref([
  { id: 1, amount: 2000, status: "pending" },
  { id: 2, amount: 1500, status: "approved" },
]);
</script>

<template>
        <CustomNavBar title="reward_center" backTo="/user/profile">
    <template #right>

      <button
        v-on:click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn/>
    </template>
  </CustomNavBar>
  <div>
    <h1 class="text-xl font-semibold mb-3">Rewards</h1>
    <div class="space-y-2">
      <div v-for="r in rewards" :key="r.id" class="list">
        <span>Reward</span>
        <span class="text-yellow-400">{{ r.amount }}</span>
        <span>{{ r.status }}</span>
      </div>
    </div>
  </div>
</template>