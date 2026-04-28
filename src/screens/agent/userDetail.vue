<script setup lang="ts">
import { onMounted, ref } from "vue";
import DatePicker from "@/components/CalenderView.vue";
import moment from "moment";
import { getAgentTransactionSummaryUidAPI } from "@/services/agentAPI";
import { useAuthStore } from "@/stores/auth";
import { formatPrice, openChat } from "@/utils";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
const route = useRoute()
const id = route.params.id
const loading = ref(false);
console.log("User ID:", id);
const mode = ref<"this_month" | "today" | "custom">("this_month");
const {t} = useI18n();
const transactions = ref<any[]>([])
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
    if (!id) return;
    const res = await getAgentTransactionSummaryUidAPI(authStore.user.agent_id, {
      mode: mode.value,
      from: startDate.value,
      to: endDate.value,
      user_id: Number(id)
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
        <CustomNavBar title="user_detail" backTo="/user/agent-center/users">
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
        <h1 class="text-xl font-semibold">User Detail</h1>
        <p class="text-sm text-gray-400">Financial overview & history</p>
      </div>
    </div>

    <!-- USER SUMMARY -->
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
    <!-- TRANSACTION LIST -->
    <div class="bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden">

      <div
        v-for="t in transactions"
        :key="t.id"
        class="flex justify-between items-center px-4 py-4 border-b border-white/5 last:border-none hover:bg-white/5 transition"
      >

        <!-- LEFT -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
            :class="t.type === 'deposit'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'"
          >
            {{ t.type === 'deposit' ? '+' : '-' }}
          </div>

          <div class="flex flex-col">
            <span class="text-sm font-medium capitalize">
              {{ t.type }}
            </span>
            <span class="text-xs text-gray-400">
              {{ moment(t.created_at).format('DD MMM YYYY HH:mm') }}
            </span>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="text-right">
          <span
            class="font-semibold"
            :class="t.type === 'deposit' ? 'text-green-400' : 'text-red-400'"
          >
            {{ t.type === 'deposit' ? '+' : '-' }}{{ t.amount }}
          </span>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.cardStyle {
  background: #111827;
  border: 1px solid rgba(255,255,255,0.05);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>