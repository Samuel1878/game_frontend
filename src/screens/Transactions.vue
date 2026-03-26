<script setup lang="ts">
import { getDepositById, getWithdrawalsById } from "@/services/transactionAPI";
import { useAuthStore } from "@/stores/auth";
import type { depositFormData, withdrawalInfo } from "@/utils/types";
import { CoinsIcon, Wallet2Icon } from "lucide-vue-next";
import { ref, computed, onMounted, watch } from "vue";
import moment from "moment";
import DepositDetail from "@/components/depositDetail.vue";
import WithdrawDetail from "@/components/withdrawDetail.vue";
type Type = "deposit" | "withdraw";

const activeTab = ref<Type>("deposit");
const loading = ref(true);
const showDialog = ref(false);
const selectedDeposit = ref<depositFormData | null>(null);
// pagination
const currentPage = ref(1);
const perPage = 5;

// date filter
const dateFilter = ref<"7" | "30" | "all">("7");
const deposits = ref<depositFormData[]>([]);
const withdrawals = ref<withdrawalInfo[]>([]);
const showWithdrawDialog = ref(false);
const selectedWithdrawal = ref<withdrawalInfo | null>(null);

const viewWithdrawal = (txn: withdrawalInfo) => {
  selectedWithdrawal.value = txn;
  showWithdrawDialog.value = true;
};

const handleWithdrawExport = (data: withdrawalInfo) => {
  console.log("Exported withdrawal:", data);
};
const authStore = useAuthStore();
const fetchData = async () => {
  if (authStore.user?.id && activeTab.value === "deposit") {
    const response = await getDepositById(authStore.user?.id);
    deposits.value = response && response;
    return;
  } else if (authStore.user?.id && activeTab.value === "withdraw") {
    const response = await getWithdrawalsById(authStore.user?.id);
    withdrawals.value = response && response;
  }
};
watch(
  () => activeTab.value,
  async () => {
    authStore.isLoggedIn && (await fetchData());
    loading.value = false;
  },
);
onMounted(async () => {
  authStore.isLoggedIn && (await fetchData());
  loading.value = false;
});

const totalPages = computed(() =>
  activeTab.value === "deposit"
    ? Math.ceil(deposits.value?.length / perPage)
    : Math.ceil(withdrawals.value?.length / perPage),
);

const paginatedWithdrawals = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return withdrawals.value?.slice(start, start + perPage);
});
const paginatedDeposits = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return deposits.value?.slice(start, start + perPage);
});

const formatAmount = (amount: number | null) =>
  amount && amount.toLocaleString() + " MMK";

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
const handleExported = (data: depositFormData) => {
  console.log("Exported deposit:", data);
};
const viewDeposit = (deposit: depositFormData) => {
  selectedDeposit.value = deposit;
  showDialog.value = true;
};
</script>

<template>
  <main class="min-h-screen bg-linear-to-b w-full from-gray-950 to-black px-4">
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <h1 class="text-3xl font-bold text-white">Transaction History</h1>

        <!-- Date Filter -->
        <div class="flex gap-3">
          <button
            v-for="option in ['7', '30', 'all']"
            :key="option"
            @click="dateFilter = option as any"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold',
              dateFilter === option
                ? 'bg-sky-600 text-white'
                : 'bg-gray-800 text-gray-400',
            ]"
          >
            {{ option === "all" ? "All" : option + " Days" }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4">
        <button
          @click="activeTab = 'deposit'"
          :class="
            activeTab === 'deposit'
              ? 'bg-sky-600 text-white px-6 py-2 rounded-xl flex gap-2 items-center'
              : 'bg-gray-800 text-gray-400 px-6 py-2 rounded-xl flex gap-2 items-center'
          "
        >
          <Wallet2Icon />
          <p>Deposits</p>
        </button>

        <button
          @click="activeTab = 'withdraw'"
          :class="
            activeTab === 'withdraw'
              ? 'bg-emerald-600 text-white px-6 py-2 rounded-xl flex gap-2 items-center'
              : 'bg-gray-800 text-gray-400 px-6 py-2 rounded-xl flex gap-2 items-center'
          "
        >
          <CoinsIcon />
          <p>Withdrawals</p>
        </button>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="h-16 bg-gray-800 animate-pulse rounded-xl"
        ></div>
      </div>

      <!-- Content -->
      <div v-else>
        <div v-if="activeTab === 'deposit'">
          <div
            class="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
          >
            <div
              class="grid grid-cols-4 bg-gray-800 text-gray-400 text-sm px-6 py-3"
            >
              <span>ID</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            <div
              v-for="txn in paginatedDeposits"
              :key="txn.id"
              @click="viewDeposit(txn)"
              class="grid grid-cols-4 px-6 py-4 border-t border-gray-800 text-sm items-center"
            >
              <span class="text-white font-medium">{{ txn.inv_id }}</span>

              <span class="text-sky-400 font-semibold">
                {{ formatAmount(Number(txn?.request_amount)) }}
              </span>

              <span
                class="px-3 py-1 text-xs capitalize rounded-full w-fit"
                :class="{
                  'bg-sky-600 text-white': txn.status === 'approved',
                  'bg-yellow-500 text-black': txn.status === 'pending',
                  'bg-red-600 text-white': txn.status === 'rejected',
                }"
              >
                {{ txn.status }}
              </span>

              <span class="text-gray-400">{{
                moment(txn.created_at).format("DD-MM-YYYY hh:mm A")
              }}</span>
            </div>
          </div>
          <!-- Mobile Card Layout -->
          <div class="md:hidden space-y-4">
            <div
              v-for="txn in paginatedDeposits"
              :key="txn.id"
              @click="viewDeposit(txn)"
              class="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2"
            >
              <!-- <div class="flex justify-between">
                <span class="text-gray-400 text-sm">ID</span>
                <span class="text-white text-sm">{{ txn.inv_id }}</span>
              </div> -->

              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Amount</span>
                <span class="font-bold text-white">
                  {{ formatAmount(Number(txn.request_amount)) }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Status</span>
                <span
                  class="px-2 py-1 text-sm font-bold rounded-full capitalize"
                  :class="{
                    'bg-sky-600 text-white': txn.status === 'approved',
                    'bg-yellow-500 text-black': txn.status === 'pending',
                    'bg-red-600 text-white': txn.status === 'rejected',
                  }"
                >
                  {{ txn.status }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Date</span>
                <span class="text-gray-400 text-sm">{{
                  moment(txn?.created_at).format("DD-MM-YYYY hh:mm A")
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div
            class="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
          >
            <div
              class="grid grid-cols-4 bg-gray-800 text-gray-400 text-sm px-6 py-3"
            >
              <span>ID</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            <div
              v-for="txn in paginatedWithdrawals"
              :key="txn.id"
              @click="viewWithdrawal(txn)"
              class="grid grid-cols-4 px-6 py-4 border-t border-gray-800 text-sm items-center"
            >
              <span class="text-white font-medium">{{ txn?.txn_id }}</span>

              <span class="text-sky-400 font-semibold">
                {{ formatAmount(Number(txn?.amount)) }}
              </span>

              <span
                class="px-3 py-1 text-xs capitalize rounded-full w-fit"
                :class="{
                  'bg-emerald-600 text-white': txn.status === 'approved',
                  'bg-yellow-500 text-black': txn.status === 'pending',
                  'bg-red-600 text-white': txn.status === 'rejected',
                }"
              >
                {{ txn.status }}
              </span>

              <span class="text-gray-400">{{
                moment(txn.created_at).format("DD-MM-YYYY hh:mm a")
              }}</span>
            </div>
          </div>
          <!-- Mobile Card Layout -->
          <div class="md:hidden space-y-4">
            <div
              v-for="txn in paginatedWithdrawals"
              :key="txn.id"
              @click="viewWithdrawal(txn)"
              class="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2"
            >
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">ID</span>
                <span class="text-white text-sm">{{ txn.txn_id }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Amount</span>
                <span>
                  {{ formatAmount(Number(txn.amount)) }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Status</span>
                <span
                  class="px-2 py-1 text-xs rounded-full capitalize"
                  :class="{
                    'bg-emerald-600 text-white': txn.status === 'approved',
                    'bg-yellow-500 text-black': txn.status === 'pending',
                    'bg-red-600 text-white': txn.status === 'rejected',
                  }"
                >
                  {{ txn.status }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Date</span>
                <span class="text-gray-400 text-sm">{{
                  moment(txn?.created_at).format("DD-MM-YYYY hh:mm a")
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div class="flex justify-center items-center gap-2 fixed bottom-0 right-0 left-0">
          <button
            @click="changePage(currentPage - 1)"
            class="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg"
          >
            Prev
          </button>

          <span class="text-gray-300 text-sm">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            @click="changePage(currentPage + 1)"
            class="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    <WithdrawDetail
      :open="showWithdrawDialog"
      :withdrawal="selectedWithdrawal"
      @update:open="(val:boolean) => (showWithdrawDialog = val)"
      @exported="handleWithdrawExport"
    />
    <DepositDetail
      :open="showDialog"
      :deposit="selectedDeposit"
      @update:open="(val:boolean) => (showDialog = val)"
      @exported="handleExported"
    />
  </main>
</template>
