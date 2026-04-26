<script setup lang="ts">
import { getDepositById } from "@/services/transactionAPI";
import { useAuthStore } from "@/stores/auth";
import type { depositFormData } from "@/utils/types";
import { ref, computed, onMounted } from "vue";
import moment from "moment";
import DepositDetail from "@/components/depositDetail.vue";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import { Headset, Wallet2Icon } from "lucide-vue-next";

const { t } = useI18n();
const authStore = useAuthStore();

const deposits = ref<depositFormData[]>([]);
const loading = ref(true);

const currentPage = ref(1);
const perPage = 5;

const showDialog = ref(false);
const selectedDeposit = ref<depositFormData | null>(null);

const fetchData = async () => {
  if (!authStore.user?.id) return;
  const response = await getDepositById(authStore.user.id);
  if (response){
 deposits.value = response 
}
 
  loading.value = false;
};

onMounted(fetchData);

const totalPages = computed(() =>
  Math.ceil(deposits.value.length / perPage)
);

const paginatedDeposits = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return deposits.value.slice(start, start + perPage);
});

const viewDeposit = (d: depositFormData) => {
  selectedDeposit.value = d;
  showDialog.value = true;
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
                <LanguageBtn/>
            </template>
    </CustomNavBar>
  <main class="min-h-screen bg-gray-900 p-4 text-white w-full">
    <!-- list -->
    <div v-if="loading">{{ t('loading') }}...</div>
<div
  v-else-if="!deposits.length"
  class="flex flex-col items-center justify-center mt-20 text-gray-400"
>
  <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
    <Wallet2Icon class="w-8 h-8 opacity-50" />
  </div>
  <p class="text-lg font-semibold">
    {{ t("no_deposit_records") }}
  </p>
  <p class="text-sm opacity-60">
    {{ t("no_data_description") }}
  </p>
</div>
    <div v-else class="space-y-3">
      <div
              v-for="txn in paginatedDeposits"
              :key="txn.id"
              @click="viewDeposit(txn)"
              class="p-4 space-y-2 cursor-pointer bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_5px_rgba(0,0,0,0.5)] transition rounded-2xl"
            >

              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">{{t('amount')}}</span>
                <span class="font-bold text-white">
                  {{ formatAmount(Number(txn.request_amount)) }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">{{t('status')}}</span>
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
                <span class="text-gray-400 text-sm">{{t('date')}}</span>
                <span class="text-gray-400 text-sm">{{
                  moment(txn?.created_at).format("DD-MM-YYYY hh:mm A")
                }}</span>
              </div>
            </div>
    </div>

    <!-- pagination -->
    <div v-show="paginatedDeposits.length" class="flex justify-center gap-2 mt-6">
      <button @click="currentPage--">Prev</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="currentPage++">Next</button>
    </div>

    <DepositDetail
      :open="showDialog"
      :deposit="selectedDeposit"
      @update:open="(v:boolean)=>showDialog=v"
    />
  </main>
</template>