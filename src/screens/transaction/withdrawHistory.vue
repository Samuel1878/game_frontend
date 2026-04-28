<script setup lang="ts">
import { getWithdrawalsById } from "@/services/transactionAPI";
import { useAuthStore } from "@/stores/auth";
import type { withdrawalInfo } from "@/utils/types";
import { ref, computed, onMounted } from "vue";
import moment from "moment";
import WithdrawDetail from "@/components/withdrawDetail.vue";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { CoinsIcon, Headset } from "lucide-vue-next";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";

const { t } = useI18n();
const authStore = useAuthStore();

const withdrawals = ref<withdrawalInfo[]>([]);
const loading = ref(true);

const currentPage = ref(1);
const perPage = 5;

const showDialog = ref(false);
const selectedWithdrawal = ref<withdrawalInfo | null>(null);

const fetchData = async () => {
  if (!authStore.user?.id) return;

  const response = await getWithdrawalsById(authStore.user.id);
  if (response) {
    withdrawals.value = response
  }
  loading.value = false;
};

onMounted(fetchData);

const totalPages = computed(() =>
  Math.ceil(withdrawals.value.length / perPage)
);

const paginatedWithdrawals = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return withdrawals.value.slice(start, start + perPage);
});

const viewWithdrawal = (w: withdrawalInfo) => {
  selectedWithdrawal.value = w;
  showDialog.value = true;
};

const formatAmount = (a: number) =>
  a.toLocaleString() + " MMK";
</script>

<template>
  <CustomNavBar title="withdraw_history" backTo="/user/profile">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <main class="min-h-screen bg-gray-900 p-4 text-white w-full">



    <div v-if="loading">{{ t('loading') }}...</div>
    <div v-else-if="!withdrawals.length" class="flex flex-col items-center justify-center mt-20 text-gray-400">
      <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <CoinsIcon class="w-8 h-8 opacity-50" />
      </div>
      <p class="text-lg font-semibold">
        {{ t("no_record") }}
      </p>
      <!-- <p class="text-sm opacity-60">
        {{ t("no_data_description") }}
      </p> -->
    </div>
    <div v-else class="space-y-3">
      <div v-for="txn in paginatedWithdrawals" :key="txn.id" @click="viewWithdrawal(txn)"
        class="bg-gray-900 p-4 space-y-2 cursor-pointer bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_5px_rgba(0,0,0,0.5)] transition rounded-2xl">
        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t('id') }}</span>
          <span class="text-white text-sm">{{ txn.txn_id }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t("amount") }}</span>
          <span>
            {{ formatAmount(Number(txn.amount)) }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t('status') }}</span>
          <span class="px-2 py-1 text-xs rounded-full capitalize" :class="{
            'bg-emerald-600 text-white': txn.status === 'approved',
            'bg-yellow-500 text-black': txn.status === 'pending',
            'bg-red-600 text-white': txn.status === 'rejected',
          }">
            {{ txn.status }}
          </span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t('date') }}</span>
          <span class="text-gray-400 text-sm">{{
            moment(txn?.created_at).format("DD-MM-YYYY hh:mm a")
          }}</span>
        </div>
      </div>
    </div>

    <div v-show="paginatedWithdrawals.length" class="flex justify-center gap-2 mt-6">
      <button @click="currentPage--">Prev</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="currentPage++">Next</button>
    </div>

    <WithdrawDetail :open="showDialog" :withdrawal="selectedWithdrawal" @update:open="(v: boolean) => showDialog = v" />
  </main>
</template>