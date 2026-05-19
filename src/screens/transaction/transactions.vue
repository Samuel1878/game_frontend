<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref, watch } from "vue";
import { getAllTransactionsByUserId } from "../../services/transactionAPI";
import DatePicker from "@/components/CalenderView.vue";
import type { Transaction } from "@/utils/types";
import moment from "moment";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { formatPrice, openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import Button from "@/components/ui/button/Button.vue";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, ClipboardX, Headset, MinusCircle, SearchIcon } from "lucide-vue-next";
const authStore = useAuthStore();
const transactions_local = ref<Transaction[]>([]);
const loading = ref(true);
const page = ref(1);
const limit = 10;
const totalPages = ref(1);
const transactionType = ref("all");
const startDate = ref();
const { t } = useI18n();
const endDate = ref();
const fetchTransaction = async () => {
  // console.log("fetching local db transactions");
  loading.value = true;

  const res = await getAllTransactionsByUserId({
    page: page.value,
    limit,
    type: transactionType.value || "all",
    startDate: startDate.value,
    endDate: endDate.value,
    user_id: authStore.user?.id,
  });
  // console.log("res", res.data);
  transactions_local.value = res?.data;
  totalPages.value = res.totalPages;
  loading.value = false;
};
onMounted(() => {
  fetchTransaction();
});
const nextPage = () => {
  if (page.value >= totalPages.value) return;
  page.value++;
};

const prevPage = () => {
  if (page.value <= 1) return;
  page.value--;
};
watch([page, transactionType], fetchTransaction);
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
  <div class="space-y-4 p-4 w-full min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-wide text-gray-100">
        {{ t("transactions") }}
      </h1>

      <span class="text-sm text-gray-400">
        {{ t("page") }} {{ page }} / {{ totalPages }}
      </span>
    </div>

    <!-- Filters -->
    <div
      class="bg-[#0f172a] border glass-bg border-white/5 rounded-2xl p-4 space-y-3"
    >
      <!-- Date Range -->
      <div class="flex gap-2 justify-center">
        <DatePicker v-model="startDate" :placeholder="t('start_date')" />
        <DatePicker v-model="endDate" :placeholder="t('end_date')" />
      </div>
      <Button
        :disabled="!startDate || !endDate"
        @click="()=>{startDate && endDate && fetchTransaction();page=1}"
        class="w-full flex items-center justify-center h-8 rounded-lg text-lg gold-bg active-button text-gray-900 hover:bg-amber-400"
      >
        <SearchIcon />
        <p>{{ t("search") }}</p>
      </Button>
      <!-- Type Filter -->
      <div class="flex gap-2 flex-wrap mt-2 border-t border-white/5 pt-2">
        <button
          @click="transactionType = 'all'"
          class="filter-btn"
          :class="transactionType === 'all' && 'active-filter'"
        >
          {{ t("all") }}
        </button>
        <button
          @click="transactionType = 'bonus'"
          class="filter-btn"
          :class="
            transactionType === 'bonus' &&
            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 active-filter'
          "
        >
          {{ t("bonus") }}
        </button>
        <button
          @click="transactionType = 'deposit'"
          class="filter-btn"
          :class="
            transactionType === 'deposit' &&
            'bg-green-500/20 text-green-400 border-green-500/30 active-filter'
          "
        >
          {{ t("deposit") }}
        </button>

        <button
          @click="transactionType = 'withdraw'"
          class="filter-btn"
          :class="
            transactionType === 'withdraw' &&
            'bg-red-500/20 text-red-400 border-red-500/30 active-filter'
          "
        >
          {{ t("withdraw") }}
        </button>
        <button
          @click="transactionType = 'refund'"
          class="filter-btn"
          :class="
            transactionType === 'refund' &&
            'bg-red-500/20 text-red-400 border-red-500/30 active-filter'
          "
        >
          {{ t("refund") }}
        </button>
        <button
          @click="transactionType = 'adjustment'"
          class="filter-btn"
          :class="
            transactionType === 'adjustment' &&
            'bg-red-500/20 text-red-400 border-red-500/30 active-filter'
          "
        >
          {{ t("adjustment") }}
        </button>
        <button
          @click="transactionType = 'rebate'"
          class="filter-btn"
          :class="
            transactionType === 'rebate' &&
            'bg-red-500/20 text-red-400 border-red-500/30 active-filter'
          "
        >
          {{ t("rebate") }}
        </button>
        <!-- <button
          @click="transactionType = 'dividend'"
          class="filter-btn"
          :class="
            transactionType === 'dividend' &&
            'bg-red-500/20 text-red-400 border-red-500/30 active-filter'
          "
        >
          {{ t("dividend") }}
        </button> -->
      </div>
    </div>

    <!-- Transaction List -->
    <div
      class="bg-[#0f172a] glass-bg border border-white/5 rounded-2xl overflow-hidden"
    >
      <div v-if="loading" class="p-4 space-y-3">
  <div v-for="i in 6" :key="i" class="animate-pulse flex justify-between p-4 bg-[#0f172a] rounded-xl">
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
  v-else-if="!transactions_local?.length"
  class="flex flex-col items-center justify-center py-16 text-gray-500"
>
 <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <ClipboardX class="w-8 h-8 opacity-50" />
      </div>
  <p class="text-sm">{{ t('no_record') }}</p>
</div>
      <div
        v-else
        v-for="tx in transactions_local"
        :key="tx.id"
        class="flex items-center justify-between px-4 py-4 border-b border-white/5 last:border-none hover:bg-white/5 transition"
      >
        <!-- Left -->
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center"
            :class="
              tx.type === 'deposit' || tx.type ==='refund'
                ? 'bg-green-500/15 text-green-400' :tx.type==='adjustment'?'bg-gray-500/15 text-gray-300'
                : 'bg-red-500/15 text-red-400'
            "
          >
            <ArrowDownCircle
              v-if="tx.type === 'deposit' || tx.type === 'refund'"
              class="w-5 h-5"
            />
            <MinusCircle v-else-if="tx.type==='adjustment'"  class="w-5 h-5"/>

            <ArrowUpCircle
              v-else
              class="w-5 h-5"
            />
          </div>

          <div class="flex flex-col text-gray-100">
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
              tx.type === 'deposit' || tx.type === 'refund'
                ? 'text-green-400' : tx.type === 'adjustment'?'text-gray-300'
                : 'text-red-400'
            "
          >
            {{ tx.type === "deposit" || tx.type ==='refund' ? "+" : "-" }}
            {{ formatPrice(tx.amount) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
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
<style lang="css" scoped>
.pagination-btn {

  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.pagination-btn:hover {
  background: rgba(255,255,255,0.08);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}</style>
