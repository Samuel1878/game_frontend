<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref, watch } from "vue";
import { getAllTransactionsByUserId } from "../../services/transactionAPI";
import DatePicker from "@/components/CalenderView.vue";
import type { Transaction } from "@/utils/types";
import moment from "moment";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import Button from "@/components/ui/button/Button.vue";
import { ClipboardX, Headset, SearchIcon, Trophy } from "lucide-vue-next";

const authStore = useAuthStore();
const { t } = useI18n();

const transactions_local = ref<Transaction[]>([]);
const loading = ref(false);

const page = ref(1);
const limit = 10;
const totalPages = ref(1);
const totalItems = ref(0);

const transactionType = ref("dividend");
const startDate = ref();
const endDate = ref();

const fetchTransaction = async () => {
  if (!authStore.user?.id) return;

  loading.value = true;

  const res = await getAllTransactionsByUserId({
    page: page.value,
    limit,
    type: transactionType.value || "dividend",
    startDate: startDate.value,
    endDate: endDate.value,
    user_id: authStore.user.id,
  });

  if (res) {
    transactions_local.value = res.data || [];
    totalPages.value = res.totalPages || 1;
    totalItems.value = res.total || 0;
  }

  loading.value = false;
};

const nextPage = () => {
  if (page.value >= totalPages.value) return;
  page.value++;
};

const prevPage = () => {
  if (page.value <= 1) return;
  page.value--;
};

watch([page, transactionType], fetchTransaction);

onMounted(fetchTransaction);
</script>
<template>
  <CustomNavBar title="reward_center" backTo="/user/profile">
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
      <h1 class="text-xl font-semibold tracking-wide">
        {{ t("rewards") }}
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
        @click="()=>{startDate && endDate && fetchTransaction(); page=1}"
        class="w-full flex items-center justify-center h-8 rounded-lg text-lg gold-bg active-button text-gray-900 hover:bg-amber-400"
      >
        <SearchIcon />
        <p>{{ t("search") }}</p>
      </Button>
      <!-- Type Filter -->
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
          <!-- Icon -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            :class="
              tx.type === 'deposit' || tx.type === 'bonus'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            "
          >
            <Trophy class="w-4 h-4 text-green-400" />
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
          <div class="text-md font-semibold text-green-400">
            {{ tx.type === "deposit" || tx.type === "bonus" ? "+" : "-"
            }}{{ tx.amount }}
          </div>

          <div class="text-xs text-gray-400">
            {{ moment(tx.created_at).format("DD/MM/YY hh:mm A") }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-gray-400 pt-2">
      <div>
        {{ t("page") }} {{ page }} / {{ totalPages }}
        <span class="ml-2 text-gray-500"> ({{ totalItems }} items) </span>
      </div>

      <div class="flex gap-2">
        <button @click="prevPage" :disabled="page === 1" class="pagination-btn">
          ← {{ t("prev") }}
        </button>

        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="pagination-btn"
        >
          {{ t("next") }} →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination-btn {
  padding: 6px 12px;
  border-radius: 10px;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: 0.2s;
  font-size: 13px;
}

.pagination-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
