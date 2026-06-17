<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import moment from "moment";
import { 
  CopyIcon, 
  DownloadIcon, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowDownLeft, 
  Wallet2,
  Headset
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { openChat } from "@/utils";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import { useWithdrawStore } from "@/stores/withdrawDetailStore";
import { storeToRefs } from "pinia";
import { captureElement } from "@/utils/shareHandler";
const { t } = useI18n();
const receiptRef = ref<HTMLElement | null>(null);
const withdrawStore = useWithdrawStore();
const { selectedWithdrawal } = storeToRefs(withdrawStore);
const copiedField = ref<string | null>(null);
const formatWithdrawalAmount = (amount: number) =>
  `${amount.toLocaleString()} ${selectedWithdrawal.value?.currency || "MMK"}`;
const statusConfig = computed(() => {
  const status = selectedWithdrawal.value?.status;
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
    case 'paid':
      return {
        bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
        icon: CheckCircle2
      };
    case 'cancelled':
      return {
        bg: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
        icon: XCircle
      };
    default:
      return {
        bg: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
        icon: Clock
      };
  }
});

// Modern Async Copy Operations Action Handler
const handleCopy = async (text: string | undefined, fieldName: string) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copiedField.value = fieldName;
    toast.success(`${t(fieldName) || fieldName} ${t('copied') || 'copied'}`);
    setTimeout(() => { copiedField.value = null; }, 2000);
  } catch (err) {
    toast.error("Copy operation rejected");
  }
};

async function captureAndShare() {
  await captureElement(
    receiptRef,
    `receipt-${selectedWithdrawal.value?.txn_id}.png`
  );
}
</script>

<template>
  <main class="min-h-screen bg-gray-900 w-full text-white flex flex-col antialiased selection:bg-emerald-500/30">
     <CustomNavBar title="detail" backTo="/user/withdraw-history">
    <template #right>
      <button @click="openChat" class="p-1 rounded-lg hover:bg-white/5 active:scale-95 transition-all">
        <Headset class="w-6 h-6 text-gray-300" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
    <!-- CONTENT DISPLAY CONTAINER SCROLL VIEW LAYER -->
    <div class="flex-1 overflow-y-auto p-4 max-w-md w-full mx-auto space-y-4 pb-28 bg-gray-900" ref="receiptRef">

      <div v-if="selectedWithdrawal" class="space-y-4 animate-in fade-in-50 duration-200">
        
        <!-- Premium Centralized Hero Receipt Banner Card Segment -->
        <div class="p-6 bg-linear-to-b from-gray-800/40 to-transparent border border-gray-900/80 rounded-3xl shadow-xl flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
            <ArrowDownLeft class="w-6 h-6 text-emerald-400" />
          </div>
          <span class="text-gray-500 font-semibold text-xs uppercase tracking-widest">
            {{ t("amount") || "Withdrawal Amount" }}
          </span>
          
          <h2 class="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-200 via-emerald-400 to-teal-500 mt-1 tracking-tight">
            {{ formatWithdrawalAmount(Number(selectedWithdrawal.amount)) }}
          </h2>

          <div 
            class="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-sm"
            :class="statusConfig.bg"
          >
            <component :is="statusConfig.icon" class="w-3.5 h-3.5" />
            <span>{{ t(selectedWithdrawal.status || "pending") }}</span>
          </div>
        </div>

        <!-- Meta Specification Variable Row Data Blocks -->
        <div class="bg-gray-900/20 border border-gray-800/80 rounded-3xl px-5 py-1 divide-y divide-gray-800/50 shadow-lg">
          
          <!-- Row Item Element: Transaction ID (Invoice Reference key) -->
          <div class="flex justify-between items-center py-3.5 group">
            <span class="text-gray-400 text-sm font-medium">{{ t('invoice_id') }}</span>
            <button 
              @click="handleCopy(selectedWithdrawal.txn_id, 'invoice_id')"
              class="text-gray-100 text-sm font-mono font-semibold flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <span>{{ selectedWithdrawal.txn_id }}</span>
              <CopyIcon 
                class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" 
                :class="{ 'text-emerald-400 opacity-100': copiedField === 'invoice_id' }"
              />
            </button>
          </div>

          <!-- Row Item Element: Target Gateway Channel Group -->
          <div class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{ t("payment_method") }}</span>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-center">
                <Wallet2 class="w-3 h-3 text-emerald-400" />
              </div>
              <span class="text-gray-100 font-semibold text-sm">{{ selectedWithdrawal.payment_method }}</span>
            </div>
          </div>

          <!-- Row Item Element Component Group: Account Details Node Structure -->
          <div class="py-3.5 space-y-2">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-medium">{{ t("account_name") }}</span>
              <span class="text-gray-100 font-semibold">
                {{ selectedWithdrawal.withdraw_name || '---' }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500 text-xs">{{ t("account_number") }}</span>
              <button 
                @click="handleCopy(selectedWithdrawal.withdraw_no, 'account_number')"
                class="text-gray-400 font-mono text-xs hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <span>{{ selectedWithdrawal.withdraw_no || '---' }}</span>
                <CopyIcon class="w-3.5 h-3.5 opacity-50" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 py-3.5">
            <div class="bg-gray-900 border border-gray-900 p-3 rounded-2xl">
              <span class="text-gray-500 text-[11px] font-semibold block mb-0.5 uppercase tracking-wider">
                {{ t("fee") }}
              </span>
              <span class="text-gray-300 font-bold text-sm">
                {{ formatWithdrawalAmount(Number(selectedWithdrawal.fee || 0)) }}
              </span>
            </div>
            <div class="bg-gray-900 border border-gray-900 p-3 rounded-2xl">
              <span class="text-gray-500 text-[11px] font-semibold block mb-0.5 uppercase tracking-wider">
                {{ t("final_amount") }}
              </span>
              <span class="text-gray-300 font-bold text-sm">
                {{ formatWithdrawalAmount(Number(selectedWithdrawal.final_amount || selectedWithdrawal.amount || 0)) }}
              </span>
            </div>
          </div>

          <!-- Row Item Element: Timestamp Records log row -->
          <div class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{ t("date") }}</span>
            <span class="text-gray-300 text-sm font-semibold">
              {{ selectedWithdrawal.created_at ? moment(selectedWithdrawal.created_at).format("DD MMM YYYY, hh:mm A") : '-' }}
            </span>
          </div>

          <div v-if="selectedWithdrawal.reviewed_at" class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{ t("reviewed_at") }}</span>
            <span class="text-gray-300 text-sm font-semibold">
              {{ moment(selectedWithdrawal.reviewed_at).format("DD MMM YYYY, hh:mm A") }}
            </span>
          </div>

          <!-- Row Item Element Component Row Block: Remark Output Block (Conditionally Rendered) -->
          <div v-if="selectedWithdrawal.remark" class="py-3.5 flex flex-col gap-1.5">
            <span class="text-gray-500 text-xs font-semibold uppercase tracking-wider">{{ t("remark") }}</span>
            <div class="bg-gray-900/30 border border-gray-900 p-3 rounded-2xl text-gray-300 text-xs leading-relaxed italic">
              "{{ selectedWithdrawal.remark }}"
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- STICKY ACTION PANEL BAR FOOTER CONTAINER (Fixed pinning boundary logic at base view boundaries) -->
    <footer class="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-lg border-t border-gray-900/80">
      <div class="max-w-md mx-auto">
        <Button
          @click="captureAndShare"
          :disabled="!selectedWithdrawal"
          class="w-full h-12 bg-linear-to-r from-emerald-500 to-teal-600 hover:opacity-95 active:scale-[0.99] disabled:opacity-40 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/5 border border-emerald-400/20 transition-all"
        >
          <DownloadIcon class="w-4 h-4" />
          {{ t("download") || "Download JSON Statement" }}
        </Button>
      </div>
    </footer>

  </main>
</template>
