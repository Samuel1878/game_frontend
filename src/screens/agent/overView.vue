<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getAgentDataByIdAPI, getAgentTransactionSummaryAPI } from "@/services/agentAPI";
import { useI18n } from "vue-i18n";
import DatePicker from "@/components/CalenderView.vue";
import { baseURL, formatPrice, openChat } from "@/utils";
import { Copy, Headset, Share2Icon } from "lucide-vue-next";
import { useAgentStore } from "@/stores/agentStore";
import { storeToRefs } from "pinia";
import { useClipboard } from "@vueuse/core";
import { toast } from "vue-sonner";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";

const { t } = useI18n();

const agentStore = useAgentStore();
const agentData = storeToRefs(agentStore).agentData;
console.log(agentData)

const { copy } = useClipboard({ source: "" });
const copyHandler = (value:any) => {

  copy(value);

  toast.success(`Copied: ${value}`);
};
const loading = ref(false);

const mode = ref<"this_month" | "today" | "custom">("this_month");

const startDate = ref();
const endDate = ref();
const authStore = useAuthStore();
const summary = ref<any>({
  deposits: 0,
  withdraws: 0,
  bonus: 0,
  adjustment: 0,
  total_players: 0,
  net: 0,
});


// -------------------- FETCH --------------------
const fetchSummary = async () => {
  if (!authStore.user?.agent_id) return;

  loading.value = true;

  try {
    const res = await getAgentTransactionSummaryAPI(authStore.user.agent_id, {
      mode: mode.value,
      from: startDate.value,
      to: endDate.value,
    });

    summary.value = res;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// -------------------- ACTIONS --------------------
const setMode = (m: typeof mode.value) => {
 startDate.value = null; endDate.value = null
  mode.value = m;
  fetchSummary();
};

onMounted(() => {
  fetchSummary();
});
</script>

<template>
      <CustomNavBar title="agent_center" backTo="/user/profile">
    <template #right>

      <button
        v-on:click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn/>
    </template>
  </CustomNavBar>
  <div class="space-y-5 p-4">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">{{ t("overview") }}</h1>
        <p class="text-sm text-gray-400">{{ t('my_team_performance') }}</p>
      </div>
      <button class="rounded-full flex gap-4 px-4 bg-gray-800/50 border active-button border-gray-500/50 h-12 items-center" v-on:click="copyHandler(agentData?.referral_code)" >
        <p class="text-md font-bold text-green">{{ agentData?.referral_code }}</p>
        <Copy class="w-5 h-5 text-green-400" />
      </button>
      <!-- <div class="text-sm text-gray-400">
        {{ summary.total_players }} {{ t("users") }}
      </div> -->
    </div>

    <!-- MODE SWITCH -->
    <div class="flex gap-2">
      <button
        class="filter-btn"
        :class="mode === 'this_month' && 'active'"
        @click="setMode('this_month')"
      >
        {{ t("this_month") }}
      </button>

      <button
        class="filter-btn"
        :class="mode === 'today' && 'active'"
        @click="setMode('today')"
      >
        {{ t("today") }}
      </button>

      <button
        class="filter-btn"
        :class="mode === 'custom' && 'active'"
        @click="setMode('custom')"
      >
        {{ t("custom") }}
      </button>
    </div>

    <!-- DATE FILTER -->
    <div v-if="mode === 'custom'" class="bg-[#0f172a] p-4 rounded-2xl border border-white/5">
      <div class="flex justify-center items-center gap-2">
        <DatePicker v-model="startDate" placeholder="From Date" />
        <DatePicker v-model="endDate" placeholder="To Date" />
      </div>

      <button
        class="mt-3 w-full bg-blue-600 py-2 rounded-lg text-sm"
        @click="fetchSummary"
      >
       {{ t('search') }}
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-gray-400 text-sm">
      {{ t('loading') }}...
    </div>

    <!-- CARDS -->
    <div v-else class="grid grid-cols-2 gap-3 ">
        <div class="card col-span-2 h-20 flex items-center justify-between px-4">
        <span class="label text-lg">{{ t('my_team') }}</span>
        <b class="text-emerald-400 text-3xl font-bold">
          {{ summary.total_players }}
        </b>
      </div>
      <div class="flex flex-col gap-2 items-center card">
        <b class="text-green-400 text-lg">{{ formatPrice(summary.deposits||0) }}</b>
        <span class="label">{{ t('total_deposit') }}</span>
      </div>

      <div class="flex flex-col gap-2 items-center card">
      
        <b class="text-red-400 text-lg">{{ formatPrice(summary.withdraws||0)   }}</b>
          <span class="label">{{ t('total_withdraw') }}</span>
      </div>

      <div class="flex flex-col gap-2 items-center card">
      
        <b class="text-blue-400 text-lg">{{ formatPrice(summary.bonus||0) }}</b>
          <span class="label">{{ t('total_rebate') }}</span>
      </div>

      <div class="flex flex-col gap-2 items-center card">
    
        <b class="text-yellow-400 text-lg">{{ formatPrice(summary.net||0) }}</b>
            <span class="label">{{ t('GGR') }}</span>
      </div>

      

    </div>
    <div class="glass-bg active-button w-full flex justify-around items-center h-12 rounded-full" @click="copyHandler(baseURL+`/?rid=${agentData?.referral_code}`)">
        <p class="text-green-400 font-bold text-lg">
            {{ t("share_link") }}
        </p>
        <Share2Icon class="w-5 h-5 text-green-400"/>
    </div>


  </div>
</template>

<!-- <style scoped>
.cardStyle {
  @apply bg-[#111827] border border-white/5 rounded-2xl p-4 flex flex-col gap-1;
}

.label {
  @apply text-xs text-gray-400;
}

.filter-btn {
  @apply px-3 py-1.5 rounded-lg text-xs bg-[#111827] border border-white/10 text-gray-300;
}

.active {
  @apply bg-blue-600 text-white border-blue-500;
}
</style> -->