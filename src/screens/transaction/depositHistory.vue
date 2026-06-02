<script setup lang="ts">
import { getDepositById } from "@/services/transactionAPI";
import { useAuthStore } from "@/stores/auth";
import type { depositFormData } from "@/utils/types";
import { ref, onMounted, watch } from "vue";
import moment from "moment-timezone";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import { 
  ChevronLeft, 
  ChevronRight, 
  Headset, 
  Wallet2Icon, 
  Search,
  CalendarDays,
  SlidersHorizontal
} from "lucide-vue-next";
import DatePicker from "@/components/CalenderView.vue";
import router from "@/router";

const { t } = useI18n();
const authStore = useAuthStore();

// Core Data States
const deposits = ref<depositFormData[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const perPage = 5;
const totalPages = ref(0);
const total = ref(0);

// Filtering Architecture
const activeDatePreset = ref<'today' | 'this_month' | 'custom'>('this_month');
const selectedStatus = ref<string>('all'); // all, pending, approved, rejected
const searchKeyword = ref('');
const from = ref();
const to = ref();

// Computed helper status states
const statuses = ['all', 'pending', 'approved', 'rejected'];

// ⏳ Process Date Presets seamlessly
const applyDatePreset = (preset: 'today' | 'this_month' | 'custom') => {
  activeDatePreset.value = preset;
  currentPage.value = 1; // Reset pagination whenever filters pivot
if (preset === "today") {
  from.value = moment().startOf("day").utc().format("YYYY-MM-DD HH:mm:ss");
  to.value = moment().endOf("day").utc().format("YYYY-MM-DD HH:mm:ss");
}

else if (preset === "this_month") {
  from.value = moment().startOf("month").utc().format("YYYY-MM-DD HH:mm:ss");
  to.value = moment().endOf("month").utc().format("YYYY-MM-DD HH:mm:ss");
} else {
    // Custom filter clears dates out to let user specify boundaries manually
    from.value = '';
    to.value = '';
  }
};

const selectStatus = (status: string) => {
  selectedStatus.value = status;
  currentPage.value = 1;
};

// Main API Connector Action Fetch
const fetchData = async () => {
  if (!authStore.user?.id) return;
  loading.value = true;
  
  const response = await getDepositById({
    page: currentPage.value,
    from: from.value || undefined,
    to: to.value || undefined,
    status: selectedStatus.value === 'all' ? undefined : selectedStatus.value,
    search: searchKeyword.value || undefined, // Binds into backend parameters if supported
    limit: perPage
  });
  
  if (response) {
    deposits.value = response.data;
    totalPages.value = response.pagination.totalPages;
    total.value = response.pagination.total;
  }
  loading.value = false;
};

// Initialize filter parameters on mount
onMounted(fetchData);

// Reactivity pipeline watching reactive elements automatically triggering fresh sync updates
watch([currentPage, from, to, selectedStatus, searchKeyword], () => {
  fetchData();
});

const viewDeposit = (d: depositFormData) => {
  router.push(`/user/deposit-history/detail/${d.inv_id}`);
};

const goPrev = () => { if (currentPage.value > 1) currentPage.value--; };
const goNext = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const formatAmount = (a: number) => a.toLocaleString() + " MMK";
</script>

<template>
  <CustomNavBar title="deposit_history" backTo="/user/profile">
    <template #right>
      <button @click="openChat" class="p-1 rounded-lg hover:bg-white/5 active:scale-95 transition-all">
        <Headset class="w-6 h-6 text-gray-300" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  
  <main class="min-h-screen bg-gray-900 text-white w-full pb-20 select-none">

   
    <div class="bg-gray-800/20 border-b border-gray-500/20 rounded-b-4xl p-3.5 space-y-4 backdrop-blur-md">
      
      <!-- Segment 1: Range Filter Pills -->
      <div class="space-y-1.5">
        <div class="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">
          <SlidersHorizontal class="w-3.5 h-3.5" />
          <span>{{ t('date') || 'Date Range' }}</span>
        </div>
        <div class="grid grid-cols-3 gap-1.5 bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button 
            v-for="preset in ['today', 'this_month', 'custom'] as const" 
            :key="preset"
            @click="applyDatePreset(preset)"
            class="py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-200"
            :class="activeDatePreset === preset 
              ? 'bg-linear-to-r from-yellow-400 to-amber-500 text-gray-950 shadow-md shadow-amber-500/5 font-bold' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'"
          >
            {{ t(preset) }}
          </button>
        </div>
      </div>

      <!-- Segment 2: Status Filter Selection Carousel row -->
      <div class="space-y-1.5">
        <div class="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wider pl-1">
          <div class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
          <span>{{ t('status') || 'Status' }}</span>
        </div>
        <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button 
            v-for="status in statuses" 
            :key="status"
            @click="selectStatus(status)"
            class="px-4 py-1.5 text-xs font-medium rounded-full border shrink-0 transition-all capitalize"
            :class="selectedStatus === status
              ? 'bg-white text-gray-950 border-white font-bold'
              : 'bg-gray-800/40 text-gray-400 border-gray-900 hover:border-gray-800'"
          >
            {{ t(status) }}
          </button>
        </div>
      </div>

      <!-- Segment 3: Animating Smooth Grid Drawer Layer (Appears ONLY on Custom Select Mode) -->
      <div 
        class="grid transition-all duration-300 ease-out"
        :class="activeDatePreset === 'custom' ? 'grid-template-rows-[1fr] opacity-100 mt-2' : 'grid-template-rows-[0fr] opacity-0 pointer-events-none'"
      >
        <div class="overflow-hidden space-y-3">
          
          <!-- Modern Dynamic Search Bar -->
          <div class="relative flex items-center">
            <Search class="absolute left-3 w-4 h-4 text-gray-500" />
            <input 
              v-model="searchKeyword"
              type="text"
              :placeholder="t('search') || 'Search Txn ID, Invoice...'"
              class="w-full bg-gray-900/20 pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-500/20 placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono"
            />
          </div>
          <!-- Dual Calendar Dynamic Picker Layout Rows -->
          <div class="flex gap-2 justify-center px-1">
              <DatePicker v-model="from" :placeholder="t('start_date')" />
              <DatePicker v-model="to" :placeholder="t('end_date')" />
          </div>
        </div>
      </div>
    </div>
    <!-- 📊 TRANSACTION LOOP HOOK RENDERINGS CONTAINER -->
    <div class="mt-4 space-y-2.5 px-4 ">
      <!-- SKELETON LOADER STATE -->
      <div v-if="loading" class="space-y-2.5">
        <div v-for="i in 4" :key="i" class="animate-pulse flex items-center justify-between p-4 bg-gray-900/40 border border-gray-900 rounded-2xl h-20">
          <div class="space-y-2">
            <div class="h-3.5 w-28 bg-gray-800 rounded-md"></div>
            <div class="h-2.5 w-20 bg-gray-800/60 rounded-md"></div>
          </div>
          <div class="space-y-2 flex flex-col items-end">
            <div class="h-3.5 w-20 bg-gray-800 rounded-md"></div>
            <div class="h-5 w-16 bg-gray-800/60 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE CONTEXT BOX -->
      <div v-else-if="!deposits.length" class="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-900/10 border border-dashed border-gray-900 rounded-2xl">
        <div class="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mb-3">
          <Wallet2Icon class="w-6 h-6 opacity-40 text-gray-400" />
        </div>
        <p class="text-sm font-semibold text-gray-400">{{ t("no_record") }}</p>
       
      </div>

      <!-- DATA CARDS LOOP -->
      <div v-else class="space-y-2.5">
        <div 
          v-for="txn in deposits" 
          :key="txn.id" 
          @click="viewDeposit(txn)"
          class="p-4 bg-gray-800/30 border border-gray-800/20 hover:border-gray-800/80 hover:bg-gray-900/50 active:scale-[0.99] transition-all duration-200 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer group"
        >
          <!-- Left metadata details column layout info -->
          <div class="space-y-1">
            <p class="text-xs font-mono font-bold text-gray-400 group-hover:text-amber-400/90 transition-colors">
              {{ txn.tid || txn.inv_id || `ID: ${txn.id}` }}
            </p>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays class="w-3.5 h-3.5 stroke-[1.5]" />
              <span>{{ moment(txn?.created_at).format("DD-MM-YYYY, hh:mm A") }}</span>
            </div>
          </div>

          <!-- Right financials status structure block -->
          <div class="text-right space-y-1.5 flex flex-col items-end">
            <span class="font-black text-sm tracking-tight text-transparent bg-clip-text bg-linear-to-r from-gray-100 to-gray-300">
              {{ formatAmount(Number(txn.request_amount)) }}
            </span>
            <span 
              class="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider border shadow-sm" 
              :class="{
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-400': txn.status === 'approved',
                'bg-amber-500/10 border-amber-500/20 text-amber-400': txn.status === 'pending',
                'bg-rose-500/10 border-rose-500/20 text-rose-400': txn.status === 'rejected',
              }"
            >
              {{ t(txn?.status || "pending") }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- 📑 PAGINATION NAVIGATION COMPONENT BAR -->
    <div v-if="totalPages > 1" class="flex justify-between items-center px-2 mt-6">
      <button 
        :disabled="currentPage === 1" 
        @click="goPrev" 
        class="h-10 px-4 rounded-xl border border-gray-900 text-xs font-semibold flex items-center gap-1 bg-gray-900/40 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 hover:text-white transition-all"
      >
        <ChevronLeft class="w-4 h-4" />
        <span>{{ t("prev") }}</span>
      </button>
      
      <span class="text-xs font-bold text-gray-500 font-mono tracking-wider">
        {{ currentPage }} <span class="opacity-40">/</span> {{ totalPages }}
      </span>
      
      <button 
        :disabled="currentPage === totalPages" 
        @click="goNext" 
        class="h-10 px-4 rounded-xl border border-gray-900 text-xs font-semibold flex items-center gap-1 bg-gray-900/40 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 hover:text-white transition-all"
      >
        <span>{{ t("next") }}</span>
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

  </main>
</template>

<style scoped>
/* Clean scrollbar suppression modifier mixins */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom CSS Grid Expansion Variable Transitions values */
.grid-template-rows-\[0fr\] {
  grid-template-rows: 0fr;
}
.grid-template-rows-\[1fr\] {
  grid-template-rows: 1fr;
}
</style>