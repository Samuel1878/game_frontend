<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import DatePicker from "@/components/CalenderView.vue";
import { useI18n } from "vue-i18n";
import { getAllTransactionsAPI } from "@/services/agentAPI";
import { useAuthStore } from "@/stores/auth";
import moment from "moment";

import {
  Headset,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  MinusCircle,
  ClipboardX,
} from "lucide-vue-next";

import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat, formatPrice } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import type { Transaction } from "@/utils/types";

const startDate = ref();
const endDate = ref();

const loading = ref(true);

const page = ref(1);

const limit = 5;

const totalPages = ref(1);

const totalItems = ref(0);

const transactions = ref<Transaction[]>([]);

const authStore = useAuthStore();

const { t } = useI18n();

const transactionType = ref("all");

const fetchTransaction = async () => {
  try {
    loading.value = true;

    if (!authStore.user?.agent_id) return;

    const res = await getAllTransactionsAPI({
      startDate: startDate.value,
      endDate: endDate.value,
      agent_id: authStore.user?.agent_id,
      page: page.value,
      limit,
      type: transactionType.value,
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

const searchTransaction = () => {
  page.value = 1;
  fetchTransaction();
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
});
</script>

<template>
  <CustomNavBar title="transactions" backTo="/user/profile">
    <template #right>
      <button v-on:click="openChat">
        <Headset class="w-6 h-6 text-yellow-400" />
      </button>

      <LanguageBtn />
    </template>
  </CustomNavBar>

  <div class="p-4 space-y-5">
    <!-- HEADER -->
    <div
      class="rounded-3xl p-5 bg-linear-to-br from-[#111827] to-[#1e293b] border border-white/5 shadow-xl"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">
            {{ t("transactions") }}
          </h1>

          <p class="text-sm text-gray-400 mt-1">
            {{ totalItems }} {{ t("records") }}
          </p>
        </div>

        <div
          class="w-14 h-14 rounded-2xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center"
        >
          <Wallet class="w-7 h-7" />
        </div>
      </div>
    </div>

    <!-- FILTER -->
    <div class="rounded-3xl bg-[#0f172a] border border-white/5 p-4 space-y-4">
      <!-- DATE -->
      <div class="flex justify-between gap-2">
        <DatePicker v-model="startDate" :placeholder="t('start_date')" />

        <DatePicker v-model="endDate" :placeholder="t('end_date')" />
      </div>

      <!-- SEARCH -->
      <button
        :disabled="!startDate || !endDate"
        @click="searchTransaction"
        class="w-full h-11 rounded-2xl bg-yellow-400 text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
      >
        <SearchIcon class="w-4 h-4" />
        {{ t("search") }}
      </button>

      <!-- TYPE FILTER -->
      <div class="flex gap-2 overflow-auto no-scrollbar">
        <button
          @click="transactionType = 'all'"
          class="filter-btn"
          :class="transactionType === 'all' && 'active-filter'"
        >
          {{ t("all") }}
        </button>

        <button
          @click="transactionType = 'deposit'"
          class="filter-btn"
          :class="
            transactionType === 'deposit' &&
            'bg-green-500/15 border-green-500/30 text-green-400'
          "
        >
          {{ t("deposit") }}
        </button>

        <button
          @click="transactionType = 'withdraw'"
          class="filter-btn"
          :class="
            transactionType === 'withdraw' &&
            'bg-red-500/15 border-red-500/30 text-red-400'
          "
        >
          {{ t("withdraw") }}
        </button>
      </div>
    </div>

    <!-- LIST -->
    <div class="rounded-3xl overflow-hidden border border-white/5 bg-[#0f172a]">
      <!-- LOADING -->
      <div v-if="loading" class="p-4 space-y-3">
        <div
          v-for="i in 6"
          :key="i"
          class="animate-pulse flex justify-between p-4 bg-[#0f172a] rounded-xl"
        >
          <div class="space-y-2">
            <div class="h-3 w-24 bg-white/10 rounded"></div>
            <div class="h-2 w-16 bg-white/10 rounded"></div>
          </div>

          <div class="space-y-2 text-right">
            <div class="h-3 w-20 bg-white/10 rounded"></div>
            <div class="h-2 w-12 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-else-if="!transactions?.length"
        class="flex flex-col items-center justify-center py-16 text-gray-500"
      >
        <div
          class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4"
        >
          <ClipboardX class="w-8 h-8 opacity-50" />
        </div>
        <p class="text-sm">{{ t("no_record") }}</p>
      </div>

      <div
        v-else
        v-for="tx in transactions"
        :key="tx.id"
        class="flex items-center justify-between px-4 py-4 border-b border-white/5 last:border-none hover:bg-white/5 transition"
      >
        <!-- LEFT -->
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center"
            :class="
              tx.type === 'deposit' ||
              tx.type === 'refund' ||
              tx.type === 'bonus' ||
              tx.type === 'rebate' ||
              tx.type === 'dividend'
                ? 'bg-green-500/15 text-green-400'
                : tx.type === 'adjustment'
                ? 'bg-gray-500/15 text-gray-300'
                : 'bg-red-500/15 text-red-400'
            "
          >
            <ArrowDownCircle
              v-if="
                tx.type === 'deposit' ||
                tx.type === 'refund' ||
                tx.type === 'bonus' ||
                tx.type === 'rebate' ||
                tx.type === 'dividend'
              "
              class="w-5 h-5"
            />
            <MinusCircle v-else-if="tx.type === 'adjustment'" class="w-5 h-5" />

            <ArrowUpCircle v-else class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="text-sm font-medium">
              {{ tx.txn_id }}
            </span>

            <span class="text-xs text-gray-400 capitalize">
              {{ t(tx.type) }}
            </span>

            <span class="text-xs text-gray-500 mt-1">
              {{ moment(tx.created_at).format("DD MMM YYYY HH:mm") }}
            </span>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="text-right">
          <div
            class="text-lg font-bold"
            :class="
              tx.type === 'deposit' ||
              tx.type === 'refund' ||
              tx.type === 'bonus' ||
              tx.type === 'rebate' ||
              tx.type === 'dividend'
                ? 'text-green-400'
                : tx.type === 'adjustment'
                ? 'text-gray-300'
                : 'text-red-400'
            "
          >
            {{
              tx.type === "deposit" ||
              tx.type === "refund" ||
              tx.type === "bonus" ||
              tx.type === "rebate" ||
              tx.type === "dividend"
                ? "+"
                : "-"
            }}
            {{ formatPrice(tx.amount) }}
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION -->
    <div
      class="rounded-2xl border border-white/5 bg-[#0f172a] px-4 py-3 flex items-center justify-between"
    >
      <div class="text-sm text-gray-400">
        {{ t("page") }}
        {{ page }}
        /
        {{ totalPages }}
      </div>

      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="page === 1" class="pagination-btn">
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
.filter-btn {
  padding: 10px 16px;
  border-radius: 14px;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #d1d5db;
  font-size: 14px;
  transition: 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

.active-filter {
  background: rgba(250, 204, 21, 0.12);
  border-color: rgba(250, 204, 21, 0.25);
  color: #facc15;
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
  background: rgba(255, 255, 255, 0.08);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
