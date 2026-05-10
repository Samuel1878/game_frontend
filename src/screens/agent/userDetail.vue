<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import DatePicker from "@/components/CalenderView.vue";
import moment from "moment";
import { getAllTransactionsAPI } from "@/services/agentAPI";
import { useAuthStore } from "@/stores/auth";
import { formatPrice, openChat } from "@/utils";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import { toast } from "vue-sonner";
import type { Transaction } from "@/utils/types";
import {
  Headset,
  ArrowDownCircle,
  ArrowUpCircle,
  Trophy,
  Gift,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  MinusCircle,
  ChartLine,
} from "lucide-vue-next";

import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { storeToRefs } from "pinia";

const route = useRoute();

const id = route.params.id;

const { name, created_at, level, status, is_oneline } = route.query;

const loading = ref(false);

const { t } = useI18n();

const transactions = ref<Transaction[]>([]);

const authStore = useAuthStore();

const transactionType = ref("all");

const page = ref(1);

const limit = 5;

const totalPages = ref(1);

const totalItems = ref(0);

const store = useUserDashboardStore();

const {
  endDate,
  startDate,
  mode,
  transactionReport,
  betReport,
} = storeToRefs(store);

const fetchTransaction = async () => {
  try {
    loading.value = true;

    if (!authStore.user?.agent_id || !id) {
      toast.error("ERROR");
      return;
    }

    const res = await getAllTransactionsAPI({
      startDate: startDate.value,
      endDate: endDate.value,
      agent_id: authStore.user?.agent_id,
      page: page.value,
      limit: limit,
      type: transactionType.value,
      user_id: Number(id),
    });

    if (res) {
      transactions.value = res?.data || [];
      totalPages.value = res.totalPages || 1;
      totalItems.value = res.total || 0;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch([page, transactionType], fetchTransaction);

const searchAll = () => {
  page.value = 1;
  fetchTransaction();
  store.fetchSummary(Number(id));
};

const nextPage = () => {
  if (page.value >= totalPages.value) return;
  page.value++;
};

const prevPage = () => {
  if (page.value <= 1) return;
  page.value--;
};

onMounted(() => {
  fetchTransaction();
  store.fetchSummary(Number(id));
});
</script>

<template>
  <CustomNavBar title="user_detail" backTo="/user/agent-center/users">
    <template #right>
      <button v-on:click="openChat">
        <Headset class="w-6 h-6" />
      </button>

      <LanguageBtn />
    </template>
  </CustomNavBar>

  <div class="p-4 space-y-2">
    <!-- USER PROFILE -->
    <div
      class="rounded-3xl border border-white/10 bg-linear-to-br from-[#111827] to-[#0f172a] p-3 shadow-xl"
    >
      <div class="flex items-start gap-4">
        <div
          class="w-14 h-14 rounded-2xl bg-linear-to-br from-yellow-300 to-amber-600 flex items-center justify-center text-xl font-bold shrink-0"
        >
          {{ String(name)?.charAt(0).toUpperCase() }}
        </div>

        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-xl font-bold">
              {{ name }}
            </h1>

            <div
              class="px-2 py-1 rounded-full text-xs border"
              :class="
               is_oneline? 
                  'bg-green-500/15 border-green-500/30 text-green-400'
                  : 'bg-red-500/15 border-red-500/30 text-red-400'
              "
            >
               {{ is_oneline? t("online"):  t("offline")}}
            </div>
          </div>

          <div class="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
            <div class="glass-chip">
              {{ t("level") }} : {{ level }}
            </div>

            <div class="glass-chip">
              {{ t("joined") }} :
              {{ moment(String(created_at)).format("DD MMM YYYY") }}
            </div>
             <div class="glass-chip">
             {{ status }}
             
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTER -->
    <div class="flex gap-2 overflow-auto no-scrollbar">
      <button
        class="filter-btn"
        :class="mode === 'today' && 'active'"
        @click="store.setMode('today', Number(id))"
      >
        {{ t("today") }}
      </button>

      <button
        class="filter-btn"
        :class="mode === 'this_month' && 'active'"
        @click="store.setMode('this_month', Number(id))"
      >
        {{ t("this_month") }}
      </button>

      <button
        class="filter-btn"
        :class="mode === 'custom' && 'active'"
        @click="store.setMode('custom', Number(id))"
      >
        {{ t("custom") }}
      </button>
    </div>

    <!-- CUSTOM DATE -->
    <div
      v-if="mode === 'custom'"
      class="rounded-2xl border border-white/5 bg-[#0f172a] p-4"
    >
      <div class="flex gap-2">
        <DatePicker v-model="startDate" placeholder="From Date" />

        <DatePicker v-model="endDate" placeholder="To Date" />
      </div>

      <button
        class="mt-3 w-full rounded-xl gold-bg py-3 text-sm font-medium"
        @click="searchAll"
      >
        {{ t("search") }}
      </button>
    </div>

    <!-- DASHBOARD -->
    <div class="grid grid-cols-2 gap-3">
      <div class="dashboard-card">
        <div class="icon green">
          <ArrowDownCircle class="w-5 h-5" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="dashboard-label">
            {{ t("total_deposit") }}
          </span>

          <b class="dashboard-value text-green-400">
            {{ formatPrice(transactionReport?.deposits || 0) }}
          </b>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="icon red">
          <ArrowUpCircle class="w-5 h-5" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="dashboard-label">
            {{ t("total_withdraw") }}
          </span>

          <b class="dashboard-value text-red-400">
            {{ formatPrice(transactionReport?.withdraws || 0) }}
          </b>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="icon blue">
         
          <BarChart3 class="w-5 h-5" />
        </div>
          <div class="flex flex-col gap-2">
        <span class="dashboard-label">
          {{ t("turnover") }}
        </span>

        <b class="dashboard-value text-blue-400">
          {{ formatPrice((betReport?.turnover?.won || 0)+ (betReport?.turnover?.bonus||0)+ (betReport?.turnover?.draw || 0) + (betReport?.turnover?.lose||0) ||0) }}
        </b>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="icon orange">
          <ChartLine class="w-5 h-5" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="dashboard-label">
            {{ t("win_loss") }}
          </span>

          <b class="dashboard-value text-orange-400">
            {{ formatPrice((transactionReport?.deposits || 0)-(transactionReport?.withdraws||0) || 0) }}
          </b>
        </div>
      </div>
      <div class="dashboard-card">
       
        <div class="icon yellow">
          <Trophy class="w-5 h-5" />
        </div>
          
        <div class="flex flex-col gap-2">
          <span class="dashboard-label">
            GGR
          </span>

          <b class="dashboard-value text-yellow-400">
            {{ formatPrice(betReport?.winlose || 0) }}
          </b>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="icon purple">
          <Gift class="w-5 h-5" />
        </div>
        <div class="flex flex-col gap-2">
        <span class="dashboard-label">
          {{ t("total_rebate") }}
        </span>

        <b class="dashboard-value text-purple-400">
          {{ formatPrice(transactionReport?.rebate|| 0) }}
        </b>
        </div>
      </div>
       <div class="dashboard-card">
        <div class="icon purple">
          <Gift class="w-5 h-5" />
        </div>
        <div class="flex flex-col gap-2">
        <span class="dashboard-label">
          {{ t("bonus") }}
        </span>

        <b class="dashboard-value text-purple-400">
          {{ formatPrice(transactionReport?.bonus|| 0) }}
        </b>
        </div>
      </div>

      
    </div>

    <!-- TRANSACTION HEADER -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">
        {{ t("transactions") }}
      </h2>

      <div class="text-xs text-gray-400">
        {{ totalItems }} {{ t("records") }}
      </div>
    </div>

    <!-- TRANSACTION LIST -->
    <div
      class="rounded-3xl overflow-hidden border border-white/5 bg-[#0f172a]"
    >
      <div
        v-if="loading"
        class="py-10 text-center text-sm text-gray-400"
      >
        {{ t("loading") }}...
      </div>

      <div
        v-else-if="!transactions.length"
        class="py-10 text-center text-sm text-gray-400"
      >
        No transactions found
      </div>

      <div
        v-else
        v-for="t in transactions"
        :key="t.id"
        class="flex items-center justify-between border-b border-white/5 px-4 py-4 last:border-none hover:bg-white/5 transition"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-2xl flex items-center justify-center"
           :class="
              t.type === 'deposit' || t.type ==='refund'
                ? 'bg-green-500/15 text-green-400' :t.type==='adjustment'?'bg-gray-500/15 text-gray-300'
                : 'bg-red-500/15 text-red-400'
            "
          >
            <ArrowDownCircle
              v-if="t.type === 'deposit'"
              class="w-5 h-5"
            />
                <MinusCircle v-else-if="t.type==='adjustment'"  class="w-5 h-5"/>

            <ArrowUpCircle
              v-else
              class="w-5 h-5"
            />
          </div>

          <div class="flex flex-col">
            <span class="capitalize text-sm font-medium">
              {{ t.type }}
            </span>

            <span class="text-xs text-gray-400">
              {{ moment(t.created_at).format("DD MMM YYYY HH:mm") }}
            </span>
          </div>
        </div>

        <div class="text-right">
          <div
            class="font-semibold"
            :class="
              t.type === 'deposit' || t.type === 'refund'
                ? 'text-green-400' : t.type === 'adjustment'?'text-gray-300'
                : 'text-red-400'
            "
          >
            {{ t.type === "deposit" ? "+" : "-" }}
            {{ formatPrice(t.amount) }}
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION -->
    <div
      class="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0f172a] px-4 py-3"
    >
      <div class="text-sm text-gray-400">
        {{ t("page") }} {{ page }} / {{ totalPages }}
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="pagination-btn"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="pagination-btn"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  background: linear-gradient(to bottom right, #111827, #1e293b);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

.dashboard-label {
  font-size: 12px;
  color: #9ca3af;
}

.dashboard-value {
  font-size: 18px;
  font-weight: 700;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon.green {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.icon.red {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.icon.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.icon.orange {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.icon.purple {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.icon.yellow {
  background: rgba(234, 179, 8, 0.15);
  color: #facc15;
}

.filter-btn {
  padding: 10px 12px;
  border-radius: 12px;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 14px;
  color: #d1d5db;
  transition: 0.2s;
  white-space: nowrap;
}

.filter-btn.active {
  background: #cf9f01;
  border-color: #ffbb00;
  color: white;
}

.glass-chip {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pagination-btn {

  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.pagination-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>