<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { saveAs } from "file-saver";
import moment from "moment";
import { 
  CopyIcon, 
  DownloadIcon, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight, 
  Wallet2,
  Headset
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { formatPrice, openChat } from "@/utils";
import type { depositFormData } from "@/utils/types";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import { getDepositByInvAPI } from "@/services/transactionAPI";

// Router & Route Setup
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// Component Props (populated automatically from path :id via 'props: true')
const props = defineProps<{
  id: string;
  deposit: depositFormData;
}>();

// States
const loading = ref(true);
const deposit = ref<depositFormData | null>(null);
const copiedField = ref<string | null>(null);

// 1. Unified Back Navigation Logic
const handleBack = () => {
  const nativeBack = history.state?.back;
  if (nativeBack && typeof nativeBack === 'string' && nativeBack.startsWith('/')) {
    router.back();
  } else {
    router.push('/user/transactions'); // Logical default fallback
  }
};

// // Simulated Fetch (Replace this with your genuine Pinia store action or API call)
const fetchTransactionDetails = async (txnId: string) => {
  loading.value = true;
  try {
    // Example: const res = await txStore.getDepositDetails(txnId);
    // deposit.value = res.data;
    const res = await getDepositByInvAPI({inv_id:txnId});
    if (res) {
      deposit.value = res;
    } else {
      throw new Error("No data found");
    }

  } catch (error) {
    toast.error(t("failed_to_load_transaction"));
  } finally {
    loading.value = false;
  }
};

const id = computed(() => props.id || (route.params.id as string));

watch(
  id,
  (val) => {
    if (val) fetchTransactionDetails(val);
  },
  { immediate: true }
);

// Dynamic Theme Configuration based on Status
const statusConfig = computed(() => {
  const status = deposit.value?.status;
  switch (status) {
    case 'approved':
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        icon: CheckCircle2
      };
    case 'pending':
      return {
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        icon: Clock
      };
    case 'rejected':
      return {
        bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        icon: XCircle
      };
    default:
      return {
        bg: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
        icon: Clock
      };
  }
});

const handleCopy = async (text: string | undefined, field: string) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copiedField.value = field;
    toast.success(`${t(field)} ${t('copied_to_clipboard') || 'copied!'}`);
    setTimeout(() => { copiedField.value = null; }, 2000);
  } catch (err) {
    toast.error("Failed to copy");
  }
};

const exportDeposit = () => {
  if (!deposit.value) return;

  const csvData = `
ID,Invoice,User ID,Payment,Request Amount,Actual Amount,Status,Remark,Account No,Account Name,TID,Created At
${[
    deposit.value.id,
    deposit.value.inv_id,
    deposit.value.user_id,
    deposit.value.payment,
    deposit.value.request_amount,
    deposit.value.actual_amount,
    deposit.value.status,
    deposit.value.remark || '',
    deposit.value.account_no || deposit.value.payment_number,
    deposit.value.account_name || deposit.value.payment_account,
    deposit.value.tid,
    deposit.value.created_at,
  ].join(",")}
  `.trim();

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `statement_${deposit.value.tid || deposit.value.inv_id}.csv`);
  toast.success(t("statement_exported"));
};
</script>

<template>
      <CustomNavBar title="detail" backTo="/user/deposit-history" @back="handleBack">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <main class="min-h-screen w-full bg-gray-900 text-white flex flex-col antialiased selection:bg-amber-500/30">
    

    <div class="flex-1 overflow-y-auto p-4 max-w-md w-full mx-auto space-y-4 pb-24">
      
      <div v-if="loading" class="animate-pulse space-y-4 pt-8">
        <div class="h-24 bg-gray-800 rounded-2xl w-3/4 mx-auto"></div>
        <div class="space-y-2 pt-6">
          <div v-for="n in 5" :key="n" class="h-11 bg-gray-900 rounded-xl w-full"></div>
        </div>
      </div>

      <div v-else-if="deposit" class="space-y-4">
        
        <div class="p-6 bg-linear-to-b from-gray-800/40 to-transparent border border-gray-900 rounded-3xl flex flex-col items-center text-center shadow-xl">
          <div class="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <ArrowUpRight class="w-6 h-6 text-amber-400" />
          </div>
          <span class="text-gray-500 font-semibold text-xs uppercase tracking-widest">
            {{ t("amount") || "Total Amount" }}
          </span>
          <h2 class="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-yellow-400 to-amber-500 mt-1 tracking-tight">
            {{ formatPrice(deposit.actual_amount ?? deposit.request_amount ?? 0) }}
            <span class="text-sm font-bold text-amber-400/80 ml-0.5">MMK</span>
          </h2>

          <div 
            class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all"
            :class="statusConfig.bg"
          >
            <component :is="statusConfig.icon" class="w-3.5 h-3.5" />
            <span>{{ t(deposit.status || "pending") }}</span>
          </div>
        </div>

        <div class="bg-gray-800/20 border border-gray-900 rounded-3xl px-5 py-2 divide-y divide-gray-700/20 shadow-lg">
          
          <div class="flex justify-between items-center py-3.5 group">
            <span class="text-gray-400 text-sm font-medium">{{ t('invoice_id') }}</span>
            <button 
              @click="handleCopy(deposit.inv_id, 'invoice_id')"
              class="text-gray-100 text-sm font-mono font-semibold flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
            >
              <span>{{ deposit.inv_id }}</span>
              <CopyIcon 
                class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" 
                :class="{ 'text-emerald-400 opacity-100': copiedField === 'invoice_id' }"
              />
            </button>
          </div>

          <div class="flex justify-between items-center py-3.5 group">
            <span class="text-gray-400 text-sm font-medium">Txn ID</span>
            <button 
              @click="handleCopy(deposit.tid, 'txn_id')"
              class="text-gray-100 text-sm font-mono font-semibold flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
            >
              <span>{{ deposit.tid }}</span>
              <CopyIcon 
                class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" 
                :class="{ 'text-emerald-400 opacity-100': copiedField === 'txn_id' }"
              />
            </button>
          </div>

          <div class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{ t("payment_method") }}</span>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-md bg-gray-950 border border-gray-800 flex items-center justify-center">
                <Wallet2 class="w-3 h-3 text-yellow-400" />
              </div>
              <span class="text-gray-100 font-semibold text-sm">{{ deposit.payment }}</span>
            </div>
          </div>

          <div class="py-3.5 space-y-2">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-medium">{{ t("account_info") || "Account Info" }}</span>
              <span class="text-gray-100 font-semibold">
                {{ deposit.payment_account || deposit.account_name || '---' }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500 text-xs">{{ t("account_number") }}</span>
              <button 
                @click="handleCopy(deposit.payment_number || deposit.account_no || '---', 'account_number')"
                class="text-gray-400 font-mono text-xs hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <span>{{ deposit.payment_number || deposit.account_no || '---' }}</span>
                <CopyIcon class="w-3.5 h-3.5 opacity-50" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 py-3.5">
            <div class="bg-gray-900 border border-gray-900 p-3 rounded-2xl">
              <span class="text-gray-500 text-[11px] font-semibold block mb-0.5 uppercase tracking-wider">{{ t("request_amount") }}</span>
              <span class="text-gray-300 font-bold text-sm">
                {{ formatPrice(deposit.request_amount ?? 0) }} <span class="text-xs text-gray-500">MMK</span>
              </span>
            </div>
            <div class="bg-gray-900 border border-gray-900 p-3 rounded-2xl">
              <span class="text-gray-500 text-[11px] font-semibold block mb-0.5 uppercase tracking-wider">{{ t("actual_amount") }}</span>
              <span class="text-amber-400 font-black text-sm">
                {{ formatPrice(deposit.actual_amount ?? 0) }} <span class="text-xs text-amber-500/70">MMK</span>
              </span>
            </div>
          </div>

          <div class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{ t("date") }}</span>
            <span class="text-gray-300 text-sm font-semibold">
              {{ moment(deposit.created_at).format("DD MMM YYYY, hh:mm A") }}
            </span>
          </div>

          <div v-if="deposit.remark" class="py-3.5 flex flex-col gap-1.5">
            <span class="text-gray-500 text-xs font-semibold uppercase tracking-wider">{{ t("remark") }}</span>
            <div class="bg-gray-800/30 border border-gray-900 p-3 rounded-2xl text-gray-300 text-xs leading-relaxed italic">
              "{{ deposit.remark }}"
            </div>
          </div>

        </div>
      </div>
    </div>

    <footer class="w-full z-30  fixed bottom-0 right-0 left-0 p-4 bg-gray-800/20 backdrop-blur-2xl border-t border-gray-700/50">
      <div class="max-w-md mx-auto">
        <Button
          @click="exportDeposit"
          :disabled="loading || !deposit"
          class="w-full h-12 gold-bg hover:opacity-95 active:scale-[0.99] disabled:opacity-40 text-gray-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/5 transition-all"
        >
          <DownloadIcon class="w-4 h-4" />
          {{ t("download") || "Download Receipt" }}
        </Button>
      </div>
    </footer>

  </main>
</template>

<style scoped>
/* Luxury custom background setup gradients */
.gold-bg {
  background: linear-gradient(135deg, #ffe066 0%, #f59e0b 100%);
}
</style>