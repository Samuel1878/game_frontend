<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ref, watch, computed } from "vue";
import { toast } from "vue-sonner";
import { saveAs } from "file-saver";
import type { depositFormData } from "@/utils/types";
import { 
  CopyIcon, 
  DownloadIcon, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight, 
  Wallet2 
} from "lucide-vue-next";
import { formatPrice } from "@/utils";
import moment from "moment";
import { Button } from "./ui/button";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  open: boolean;
  deposit: depositFormData | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "exported", data: depositFormData): void;
}>();

const localDeposit = ref<depositFormData | null>(null);
const copiedField = ref<string | null>(null);

watch(
  () => props.deposit,
  (newVal) => {
    localDeposit.value = newVal ? { ...newVal } : null;
  },
  { immediate: true }
);

// Map status settings to theme attributes
const statusConfig = computed(() => {
  const status = localDeposit.value?.status;
  switch (status) {
    case 'approved':
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        dot: 'bg-emerald-400',
        icon: CheckCircle2
      };
    case 'pending':
      return {
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        dot: 'bg-amber-400',
        icon: Clock
      };
    case 'rejected':
      return {
        bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        dot: 'bg-rose-400',
        icon: XCircle
      };
    default:
      return {
        bg: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
        dot: 'bg-gray-400',
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
    setTimeout(() => {
      copiedField.value = null;
    }, 2000);
  } catch (err) {
    toast.error("Failed to copy");
  }
};

const exportDeposit = () => {
  if (!localDeposit.value) return;

  const csvData = `
ID,Invoice,User ID,Payment,Request Amount,Actual Amount,Status,Remark,Account No,Account Name,TID,Created At
${[
    localDeposit.value.id,
    localDeposit.value.inv_id,
    localDeposit.value.user_id,
    localDeposit.value.payment,
    localDeposit.value.request_amount,
    localDeposit.value.actual_amount,
    localDeposit.value.status,
    localDeposit.value.remark || '',
    localDeposit.value.account_no || localDeposit.value.payment_number,
    localDeposit.value.account_name || localDeposit.value.payment_account,
    localDeposit.value.tid,
    localDeposit.value.created_at,
  ].join(",")}
  `.trim();

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `deposit_${localDeposit.value.tid || localDeposit.value.inv_id}.csv`);
  toast.success("Deposit statement exported!");
  emit("exported", localDeposit.value);
};
</script>

<template>
  <Dialog :open="open" @update:open="(val: boolean) => emit('update:open', val)">
    <DialogContent class="bg-gray-950 border border-gray-800/80 rounded-2xl text-white max-w-sm w-full p-0 overflow-hidden shadow-2xl backdrop-blur-xl">
      
      <div class="relative p-6 bg-linear-to-b from-gray-900/50 to-transparent border-b border-gray-900/60 flex flex-col items-center text-center">
        <div class="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-3">
          <ArrowUpRight class="w-6 h-6 text-yellow-400" />
        </div>
        <DialogTitle class="text-gray-400 font-medium text-sm tracking-wide uppercase">
          {{ t("deposit_details") || "Deposit Details" }}
        </DialogTitle>
        
        <h2 class="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-yellow-400 to-amber-500 mt-1 tracking-tight">
          {{ formatPrice(localDeposit?.actual_amount ?? localDeposit?.request_amount ?? 0) }}
          <span class="text-sm font-bold text-amber-400/80 ml-0.5">MMK</span>
        </h2>

        <div 
          class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all duration-300"
          :class="statusConfig.bg"
        >
          <component :is="statusConfig.icon" class="w-3.5 h-3.5" />
          <span>{{ t(localDeposit?.status || "pending") }}</span>
        </div>
      </div>

      <div class="px-6 py-2 division-container divide-y divide-gray-900/60 max-h-[60vh] overflow-y-auto">
        
        <div class="flex justify-between items-center py-3.5 group">
          <span class="text-gray-400 text-sm font-medium">{{ t('invoice_id') }}</span>
          <button 
            @click="handleCopy(localDeposit?.inv_id, 'invoice_id')"
            class="text-gray-100 text-sm font-mono font-semibold flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
          >
            <span>{{ localDeposit?.inv_id }}</span>
            <CopyIcon 
              class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" 
              :class="{ 'text-emerald-400 opacity-100': copiedField === 'invoice_id' }"
            />
          </button>
        </div>

        <div class="flex justify-between items-center py-3.5 group">
          <span class="text-gray-400 text-sm font-medium">Txn ID</span>
          <button 
            @click="handleCopy(localDeposit?.tid, 'txn_id')"
            class="text-gray-100 text-sm font-mono font-semibold flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
          >
            <span>{{ localDeposit?.tid }}</span>
            <CopyIcon 
              class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" 
              :class="{ 'text-emerald-400 opacity-100': copiedField === 'txn_id' }"
            />
          </button>
        </div>

        <div class="flex justify-between items-center py-3.5">
          <span class="text-gray-400 text-sm font-medium">{{ t("payment_method") }}</span>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-center">
              <Wallet2 class="w-3 h-3 text-yellow-400" />
            </div>
            <span class="text-gray-100 font-semibold text-sm">{{ localDeposit?.payment }}</span>
          </div>
        </div>

        <div class="py-3.5 space-y-2">
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-400 font-medium">{{ t("account_info") || "Account Info" }}</span>
            <span class="text-gray-100 font-semibold">
              {{ localDeposit?.payment_account || localDeposit?.account_name || '---' }}
            </span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500 text-xs">{{ t("account_number") }}</span>
            <button 
              @click="handleCopy(localDeposit?.payment_number || localDeposit?.account_no || '---', 'account_number')"
              class="text-gray-400 font-mono text-xs hover:text-yellow-400 flex items-center gap-1 transition-colors"
            >
              <span>{{ localDeposit?.payment_number || localDeposit?.account_no || '---' }}</span>
              <CopyIcon class="w-3 h-3 opacity-50" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 py-3.5">
          <div class="bg-gray-900/30 border border-gray-900 p-2.5 rounded-xl">
            <span class="text-gray-500 text-xs font-medium block mb-0.5">{{ t("request_amount") }}</span>
            <span class="text-gray-300 font-semibold text-sm">
              {{ formatPrice(localDeposit?.request_amount ?? 0) }} MMK
            </span>
          </div>
          <div class="bg-gray-900/30 border border-gray-900 p-2.5 rounded-xl">
            <span class="text-gray-500 text-xs font-medium block mb-0.5">{{ t("actual_amount") }}</span>
            <span class="text-amber-400 font-bold text-sm">
              {{ formatPrice(localDeposit?.actual_amount ?? 0) }} MMK
            </span>
          </div>
        </div>

        <div class="flex justify-between items-center py-3.5">
          <span class="text-gray-400 text-sm font-medium">{{ t("date") }}</span>
          <span class="text-gray-300 text-sm font-medium">
            {{ moment(localDeposit?.created_at).format("DD MMM YYYY, hh:mm A") }}
          </span>
        </div>

        <div v-if="localDeposit?.remark" class="py-3.5 flex flex-col gap-1">
          <span class="text-gray-500 text-xs font-medium">{{ t("remark") }}</span>
          <div class="bg-gray-900/40 border border-gray-900 p-3 rounded-xl text-gray-300 text-xs leading-relaxed italic">
            "{{ localDeposit.remark }}"
          </div>
        </div>

      </div>

      <div class="p-4 bg-gray-900/30 border-t border-gray-900 flex gap-3">
        <Button
          variant="outline"
          @click="emit('update:open', false)"
          class="flex-1 h-11 rounded-xl border-gray-800 bg-transparent text-gray-400 hover:text-white hover:bg-gray-900 font-semibold transition-all"
        >
          {{ t("close") }}
        </Button>
 
        <Button
          @click="exportDeposit"
          class="flex-1 h-11 gold-bg hover:opacity-90 active:scale-[0.98] text-gray-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/5 transition-all"
        >
          <DownloadIcon class="w-4 h-4" />
          {{ t("download") }}
        </Button>
      </div>

    </DialogContent>
  </Dialog>
</template>

<style scoped>
/* Utility background for luxury dark-mode design */
.gold-bg {
  background: linear-gradient(135deg, #ffe066 0%, #f59e0b 100%);
}

/* Custom scrolling bar optimization */
.division-container::-webkit-scrollbar {
  width: 4px;
}
.division-container::-webkit-scrollbar-thumb {
  background: #1f2937;
  border-radius: 99px;
}
</style>