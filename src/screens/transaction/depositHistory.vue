<script setup lang="ts">
import { getDepositById } from "@/services/transactionAPI";
import { useAuthStore } from "@/stores/auth";
import type { depositFormData } from "@/utils/types";
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import moment from "moment";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import { ChevronLeft, ChevronRight, Headset, Wallet2Icon } from "lucide-vue-next";
import DatePicker from "@/components/CalenderView.vue"
const DepositDetail = defineAsyncComponent(()=>import("@/components/depositDetail.vue"))
const { t } = useI18n();
const authStore = useAuthStore();

const deposits = ref<depositFormData[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const perPage = 5;
const from = ref();
const to = ref();
const showDialog = ref(false);
const selectedDeposit = ref<depositFormData | null>(null);
const totalPages = ref(0);
const total = ref(0);
const fetchData = async () => {
  if (!authStore.user?.id) return;
  const response = await getDepositById({
    page: currentPage.value,
    user_id: authStore.user.id,
    from: from.value,
    to: to.value,
    limit: perPage
  });
  if (response) {
    deposits.value = response.data
    totalPages.value = response.pagination.totalPages;
    total.value = response.pagination.total;
  }
  loading.value = false;
};
onMounted(fetchData);

watch([currentPage, from, to], () => {
  fetchData();
});
const viewDeposit = (d: depositFormData) => {
  selectedDeposit.value = d;
  showDialog.value = true;
};
const goPrev = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goNext = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const formatAmount = (a: number) =>
  a.toLocaleString() + " MMK";
</script>

<template>
  <CustomNavBar title="deposit_history" backTo="/user/profile">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <main class="min-h-screen bg-gray-900 p-4 text-white w-full">

    <div class="glass-bg p-4 rounded-2xl mb-4">
      <div class="flex justify-center items-center gap-2">
        <DatePicker v-model="from" :placeholder="t('start_date')" />
        <DatePicker v-model="to" :placeholder="t('end_date')" />
      </div>
      <!-- <button class="mt-3 w-full bg-yellow-500 py-2 rounded-lg text-sm" @click="fetchData">
          {{ t('search') }}
        </button> -->
    </div>

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
    <div v-else-if="!deposits.length" class="flex flex-col items-center justify-center mt-20 text-gray-400">
      <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Wallet2Icon class="w-8 h-8 opacity-50" />
      </div>
      <p class="text-lg font-semibold">
        {{ t("no_record") }}
      </p>
      <!-- <p class="text-sm opacity-60">
        {{ t("no_data_description") }}
      </p> -->
    </div>
    <div v-else class="space-y-3">
      <div v-for="txn in deposits" :key="txn.id" @click="viewDeposit(txn)"
        class="p-4 space-y-2 cursor-pointer bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_5px_rgba(0,0,0,0.5)] transition rounded-2xl">

        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t('amount') }}</span>
          <span class="font-bold text-white">
            {{ formatAmount(Number(txn.request_amount)) }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t('status') }}</span>
          <span class="px-2 py-1 text-sm font-bold rounded-full capitalize" :class="{
            'bg-sky-600 text-white': txn.status === 'approved',
            'bg-yellow-500 text-black': txn.status === 'pending',
            'bg-red-600 text-white': txn.status === 'rejected',
          }">
            {{ t(txn?.status || "") }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t('date') }}</span>
          <span class="text-gray-400 text-sm">{{
            moment(txn?.created_at).format("DD-MM-YYYY hh:mm A")
            }}</span>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-between px-4 gap-2 mt-6 items-center">
      <button :disabled="currentPage === 1" @click="goPrev" :class="[
        'h-8 px-3 rounded border flex items-center border-white/10',
        currentPage === 1
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : 'bg-gray-800/70  hover:bg-gray-700'
      ]">
        <ChevronLeft class="w-4 h-4 text-gray-400" />
        {{ t("prev") }}
      </button>
      <span class="text-sm text-gray-300">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button :disabled="currentPage === totalPages" @click="goNext" :class="[
        'h-8 px-3 rounded border flex items-center gap-1 border-white/10',
        currentPage === totalPages
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : 'bg-gray-800/70  hover:bg-gray-700'
      ]">
        <span>{{ t("next") }}</span>
        <ChevronRight class="w-4 h-4 text-gray-400" />
      </button>
    </div>
    <DepositDetail :open="showDialog" :deposit="selectedDeposit" @update:open="(v: boolean) => showDialog = v" />
  </main>
</template>