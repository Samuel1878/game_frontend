<script setup lang="ts">
import { ref, computed} from "vue";
import {  useRouter } from "vue-router";
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
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import { storeToRefs } from 'pinia';
import { useDepositStore } from '@/stores/depositDetailStore';
const depositStore = useDepositStore();
const { selectedDeposit } = storeToRefs(depositStore);
const router = useRouter();
const { t } = useI18n();
const copiedField = ref<string | null>(null);
const handleBack = () => {
  const nativeBack = history.state?.back;
  if (nativeBack && typeof nativeBack === 'string' && nativeBack.startsWith('/')) {
    router.back();
  } else {
    router.push('/user/transactions'); // Logical default fallback
  }
};
const statusConfig = computed(() => {
  const status = selectedDeposit.value?.status;
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
  if (!selectedDeposit.value) return;

  const csvData = `
ID,Invoice,User ID,Payment,Request Amount,Actual Amount,Status,Remark,Account No,Account Name,TID,Created At
${[
    selectedDeposit.value.id,
    selectedDeposit.value.inv_id,
    selectedDeposit.value.user_id,
    selectedDeposit.value.payment,
    selectedDeposit.value.request_amount,
    selectedDeposit.value.actual_amount,
    selectedDeposit.value.status,
    selectedDeposit.value.remark || '',
    selectedDeposit.value.account_no || selectedDeposit.value.payment_number,
    selectedDeposit.value.account_name || selectedDeposit.value.payment_account,
    selectedDeposit.value.tid,
    selectedDeposit.value.created_at,
  ].join(",")}
  `.trim();

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `statement_${selectedDeposit.value.tid || selectedDeposit.value.inv_id}.csv`);
  toast.success(t("statement_exported"));
};
</script>
<template>

  <main class="min-h-screen w-full bg-gray-900 text-white flex flex-col antialiased selection:bg-amber-500/30">
      <CustomNavBar title="detail" backTo="/user/deposit-history" @back="handleBack">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
    <div class="flex-1 overflow-y-auto p-4 max-w-md w-full mx-auto space-y-4">
      <div v-if="selectedDeposit" class="space-y-4">
        
        <div class="p-6 bg-linear-to-b from-gray-800/40 to-transparent border border-gray-900 rounded-3xl flex flex-col items-center text-center shadow-xl">
          <div class="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <ArrowUpRight class="w-6 h-6 text-amber-400" />
          </div>
          <span class="text-gray-500 font-semibold text-xs uppercase tracking-widest">
            {{ t("amount") || "Total Amount" }}
          </span>
          <h2 class="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-yellow-400 to-amber-500 mt-1 tracking-tight">
            {{ formatPrice(selectedDeposit.actual_amount ?? selectedDeposit.request_amount ?? 0) }}
            <span class="text-sm font-bold text-amber-400/80 ml-0.5">MMK</span>
          </h2>

          <div 
            class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all"
            :class="statusConfig.bg"
          >
            <component :is="statusConfig.icon" class="w-3.5 h-3.5" />
            <span>{{ t(selectedDeposit.status || "pending") }}</span>
          </div>
        </div>

        <div class="bg-gray-800/20 border border-gray-900 rounded-3xl px-5 py-2 divide-y divide-gray-700/20 shadow-lg">
          
          <div class="flex justify-between items-center py-3.5 group">
            <span class="text-gray-400 text-sm font-medium">{{ t('invoice_id') }}</span>
            <button 
              @click="handleCopy(selectedDeposit.inv_id, 'invoice_id')"
              class="text-gray-100 text-sm font-mono font-semibold flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
            >
              <span>{{ selectedDeposit.inv_id }}</span>
              <CopyIcon 
                class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" 
                :class="{ 'text-emerald-400 opacity-100': copiedField === 'invoice_id' }"
              />
            </button>
          </div>

          <div class="flex justify-between items-center py-3.5 group">
            <span class="text-gray-400 text-sm font-medium">Txn ID</span>
            <button 
              @click="handleCopy(selectedDeposit.tid, 'txn_id')"
              class="text-gray-100 text-sm font-mono font-semibold flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
            >
              <span>{{ selectedDeposit.tid }}</span>
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
              <span class="text-gray-100 font-semibold text-sm">{{ selectedDeposit.payment }}</span>
            </div>
          </div>

          <div class="py-3.5 space-y-2">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-medium">{{ t("account_info") || "Account Info" }}</span>
              <span class="text-gray-100 font-semibold">
                {{ selectedDeposit.payment_account || selectedDeposit.account_name || '---' }}
              </span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500 text-xs">{{ t("account_number") }}</span>
              <button 
                @click="handleCopy(selectedDeposit.payment_number || selectedDeposit.account_no || '---', 'account_number')"
                class="text-gray-400 font-mono text-xs hover:text-yellow-400 flex items-center gap-1 transition-colors"
              >
                <span>{{ selectedDeposit.payment_number || selectedDeposit.account_no || '---' }}</span>
                <CopyIcon class="w-3.5 h-3.5 opacity-50" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 py-3.5">
            <div class="bg-gray-900 border border-gray-900 p-3 rounded-2xl">
              <span class="text-gray-500 text-[11px] font-semibold block mb-0.5 uppercase tracking-wider">{{ t("request_amount") }}</span>
              <span class="text-gray-300 font-bold text-sm">
                {{ formatPrice(selectedDeposit.request_amount ?? 0) }} <span class="text-xs text-gray-500">MMK</span>
              </span>
            </div>
            <div class="bg-gray-900 border border-gray-900 p-3 rounded-2xl">
              <span class="text-gray-500 text-[11px] font-semibold block mb-0.5 uppercase tracking-wider">{{ t("actual_amount") }}</span>
              <span class="text-amber-400 font-black text-sm">
                {{ formatPrice(selectedDeposit.actual_amount ?? 0) }} <span class="text-xs text-amber-500/70">MMK</span>
              </span>
            </div>
          </div>

          <div class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{ t("date") }}</span>
            <span class="text-gray-300 text-sm font-semibold">
              {{ moment(selectedDeposit.created_at).format("DD MMM YYYY, hh:mm A") }}
            </span>
          </div>

          <div v-if="selectedDeposit.remark" class="py-3.5 flex flex-col gap-1.5">
            <span class="text-gray-500 text-xs font-semibold uppercase tracking-wider">{{ t("remark") }}</span>
            <div class="bg-gray-800/30 border border-gray-900 p-3 rounded-2xl text-gray-300 text-xs leading-relaxed italic">
              "{{ selectedDeposit.remark }}"
            </div>
          </div>

        </div>
      </div>
    </div>

    <footer class="w-full z-30 p-4 bg-gray-800/20 backdrop-blur-2xl border-t border-gray-700/50">
      <div class="max-w-md mx-auto">
        <Button
          @click="exportDeposit"
          :disabled="!selectedDeposit"
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