<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import DatePicker from "@/components/CalenderView.vue";
import moment from "moment";
import { getAllTransactionsAPI, getCutomerReportByModifyAPI } from "@/services/agentAPI";
import { useAuthStore } from "@/stores/auth";
import { formatPrice, openChat } from "@/utils";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import { toast } from "vue-sonner";
import type { ReportItem, Transaction } from "@/utils/types";
import { Headset } from "lucide-vue-next";
const route = useRoute()
const id = route.params.id;
const {name, created_at, level, status} = route.query;
const loading = ref(false);
console.log("User ID:", id);
const mode = ref<"this_month" | "today" | "custom">("this_month");
const {t} = useI18n();
const transactions = ref<Transaction[]>([])
const startDate = ref();
const endDate = ref();
const authStore = useAuthStore();
const transactionType = ref("all");
const page = ref(1);
const limit = 20;
const totalPages = ref(1);

const summary = ref<ReportItem|null>(null );

const fetchCReport = async () => {

  loading.value = true;

  try {
    const res = await getCutomerReportByModifyAPI({
      username:name as string,
      startDate: startDate.value,
      endDate: endDate.value,
      filter: mode.value,
      portfolio: "SeamlessGame"
    });
    console.log("CReport", res);
    if (res && res.result && res.result.length > 0) {
      summary.value = res.result[0] || null;
      return
    }
    summary.value = null; // reset if no data

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(
  mode,
  ([newMode, name]) => {
    if (!name) return;
    if (newMode !== 'custom') fetchCReport();
  },
  { immediate: true } // auto run on load
);
// -------------------- FETCH --------------------
// const fetchSummary = async () => {
//   if (!authStore.user?.agent_id) return;

//   loading.value = true;

//   try {
//     if (!id) return;
//     const res = await getAgentTransactionSummaryUidAPI(authStore.user.agent_id, {
//       mode: mode.value,
//       from: startDate.value,
//       to: endDate.value,
//       user_id: Number(id)
//     });

//     summary.value = res;
//   } catch (err) {
//     console.error(err);
//   } finally {
//     loading.value = false;
//   }
// };

// -------------------- ACTIONS --------------------
const setMode = (m: typeof mode.value) => {
 startDate.value = null; endDate.value = null
  mode.value = m;
  // fetchSummary();
};

const fetchTransaction = async () => {
    console.log("Fetching Transaction", authStore.user?.agent_id)
    if (!authStore.user?.agent_id || !id){
        toast.error("ERROR")
        return 
    }
  const res =await getAllTransactionsAPI({
    startDate:startDate.value,
    endDate:endDate.value,
    agent_id:authStore.user?.agent_id,
    page:page.value,
    limit:limit,
    type:transactionType.value,
    user_id: Number(id)

  })
  if (res){
    console.log("res", res.data);
    transactions.value = res?.data;
    totalPages.value = res.totalPages;
    loading.value = false
  }
};
watch([page, transactionType], fetchTransaction);

onMounted(() => {
  // fetchSummary();
  fetchTransaction();
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
    <div class="flex flex-col gap-2 justify-between">
      <div class="flex gap-2 items-center p-2 glass-bg rounded-lg">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-semibold">
            {{ String(name)?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="text-xl font-semibold">{{ name }}</h1>
          <p class="text-sm text-gray-400">
            {{ t('joined') }} : {{ moment(String(created_at)).format("DD MMM YYYY") }}
          </p>
          <div class="ml-auto text-sm px-2 py-1 rounded-full bg-gray-800/50 border border-gray-500/50">
          {{ t('level') }} : {{ level }}
        </div>
        </div>
        
        <div :class="['ml-auto text-sm px-2 py-1 rounded-full ', status === 'active' ? 'bg-green-500/20 border-green-400 text-green-400' : 'bg-red-500/20 border-red-400 text-red-400']">
         {{ status }}
        </div>
        
      </div>
      <p class="text-sm text-gray-400">Financial overview & history</p>
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
        @click="fetchCReport"
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
        <b class="text-green-400 text-lg">{{ formatPrice(summary?.totalDeposit||0) }}</b>
        <span class="label">{{ t('total_deposit') }}</span>
      </div>

      <div class="flex flex-col gap-2 items-center card">
      
        <b class="text-red-400 text-lg">{{ formatPrice(summary?.totalWithdrawal||0)   }}</b>
          <span class="label">{{ t('total_withdraw') }}</span>
      </div>
     <div class="flex flex-col gap-2 items-center card">
        <b class="text-blue-400 text-lg">{{ formatPrice(summary?.turnover?.won || 0) }}</b>
        <span class="label">{{ t('total_win') }}</span>
      </div>

      <div class="flex flex-col gap-2 items-center card">

        <b class="text-red-400 text-lg">{{ formatPrice(summary?.turnover?.lose || 0) }}</b>
        <span class="label">{{ t('total_loss') }}</span>
      </div>
      <div class="flex flex-col gap-2 items-center card">
      
        <b class="text-blue-400 text-lg">{{ formatPrice(summary?.turnover.bonus||0) }}</b>
          <span class="label">{{ t('total_rebate') }}</span>
      </div>

      <div class="flex flex-col gap-2 items-center card">
    
        <b class="text-yellow-400 text-lg">{{ formatPrice(summary?.winlose||0) }}</b>
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