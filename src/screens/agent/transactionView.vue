<script setup lang="ts">
import { ref, watch } from "vue";
import DatePicker from "@/components/CalenderView.vue";
import { useI18n } from "vue-i18n";
import { getAllTransactionsAPI } from "@/services/agentAPI";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue-sonner";
import { onMounted } from "vue";
import moment from "moment";
import Button from "@/components/ui/button/Button.vue";
import { Headset, SearchIcon } from "lucide-vue-next";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import type { Transaction } from "@/utils/types";

const startDate = ref();
const loading = ref(true);
const page = ref(1);
const limit = 20;
const totalPages = ref(1);
const endDate = ref();
const transactions = ref<Transaction[] | null>(null)
const authStore = useAuthStore()
const { t } = useI18n();
const transactionType = ref("all");

const fetchTransaction = async () => {
  if (!authStore.user?.agent_id) {
    // toast.error("ERROR")
    return
  }
  const res = await getAllTransactionsAPI({
    startDate: startDate.value,
    endDate: endDate.value,
    agent_id: authStore.user?.agent_id,
    page: page.value,
    limit: limit,
    type: transactionType.value

  })
  if (res) {
    console.log("res", res.data);
    transactions.value = res?.data;
    totalPages.value = res.totalPages;
    loading.value = false
  }
};
watch([page, transactionType], fetchTransaction);
onMounted(() => {
  fetchTransaction()
})
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
  <div class="space-y-4 p-4">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-wide">
        {{ t('transactions') }}
      </h1>

      <span class="text-sm text-gray-400">
        {{ t("page") }} {{ page }} / {{ totalPages }}
      </span>
    </div>

    <!-- Filters -->
    <div class="bg-[#0f172a] border border-white/5 rounded-2xl p-4 space-y-3">

      <!-- Date Range -->
      <div class="flex gap-2 justify-center">
        <DatePicker v-model="startDate" :placeholder="t('start_date')" />
        <DatePicker v-model="endDate" :placeholder="t('end_date')" />

      </div>
      <Button :disabled="!startDate || !endDate" @click="startDate && endDate && fetchTransaction()"
        class="w-full flex items-center justify-center h-8 rounded-lg text-lg bg-amber-300 text-gray-900 hover:bg-amber-400">
        <SearchIcon />
        <p>{{ t('search') }}</p>
      </Button>
      <!-- Type Filter -->
      <div class="flex gap-2 flex-wrap mt-2 border-t border-white/5 pt-2">
        <button @click="transactionType = 'all'" class="filter-btn"
          :class="transactionType === 'all' && 'active-filter'">
          {{ t('all') }}
        </button>

        <button @click="transactionType = 'deposit'" class="filter-btn"
          :class="transactionType === 'deposit' && 'bg-green-500/20 text-green-400 border-green-500/30 active-filter'">
          {{ t('deposit') }}
        </button>

        <button @click="transactionType = 'withdraw'" class="filter-btn"
          :class="transactionType === 'withdraw' && 'bg-red-500/20 text-red-400 border-red-500/30 active-filter'">
          {{ t('withdraw') }}
        </button>
      </div>

    </div>

    <!-- Transaction List -->
    <div class="bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden">

      <div v-for="tx in transactions" :key="tx.id"
        class="flex items-center justify-between px-4 py-4 border-b border-white/5 last:border-none hover:bg-white/5 transition">

        <!-- Left -->
        <div class="flex items-center gap-3">

          <!-- Icon -->
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" :class="tx.type === 'deposit'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'">
            {{ tx.type === 'deposit' ? '+' : '-' }}
          </div>

          <!-- Info -->
          <div class="flex flex-col">
            <span class="text-xs font-medium">{{ tx.txn_id }}</span>
            <span class="text-xs text-gray-400 capitalize">
              {{ t(tx.type) }}
            </span>
          </div>

        </div>

        <!-- Right -->
        <div class="text-right">
          <div class="text-md font-semibold" :class="tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'">
            {{ tx.type === 'deposit' ? '+' : '-' }}{{ tx.amount }}
          </div>

          <div class="text-xs text-gray-400">
            {{ moment(tx.created_at).format("DD/MM/YY hh:mm A") }}
          </div>
        </div>

      </div>

    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center text-sm text-gray-400">
      <button class="pagination-btn">{{ t('prev') }}</button>
      <button class="pagination-btn">{{ t('next') }}</button>
    </div>

  </div>
</template>

<style scoped></style>
