<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ref, watch } from "vue";
import { toast } from "vue-sonner";
import { saveAs } from "file-saver";
import type { depositFormData } from "@/utils/types";

// export interface DepositFormData {    
//   id?: number;
//   inv_id?: string;
//   user_id: number | null;
//   payment: string | null;
//   request_amount: number | null;
//   actual_amount?: number;
//   uuid?: string | null;
//   completed?: boolean;
//   status?: string;
//   remark?: string;
//   account_no: string | null;
//   account_name: string | null;
//   created_at?: string;
//   updated_at?: string;
//   tid: string;
//   payment_account?: string | null;
//   payment_number?: string | null;
//   ref_no?: string | null;
// }

const props = defineProps<{
  open: boolean;
  deposit: depositFormData | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "exported", data: depositFormData): void;
}>();

const localDeposit = ref<depositFormData | null>(null);

watch(
  () => props.deposit,
  (newVal) => {
    localDeposit.value = newVal ? { ...newVal } : null;
  },
  { immediate: true }
);

const exportDeposit = () => {
  if (!localDeposit.value) return;

  const csvData = `
ID,Invoice,User ID,Payment,Request Amount,Actual Amount,Status,Remark,Account No,Account Name,TID,Ref No,Created At
${[
    localDeposit.value.id,
    localDeposit.value.inv_id,
    localDeposit.value.user_id,
    localDeposit.value.payment,
    localDeposit.value.request_amount,
    localDeposit.value.actual_amount,
    localDeposit.value.status,
    localDeposit.value.remark,
    localDeposit.value.account_no,
    localDeposit.value.account_name,
    localDeposit.value.tid,
    localDeposit.value.ref_no,
    localDeposit.value.created_at,
  ].join(",")}
  `.trim();

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `deposit_${localDeposit.value.tid}.csv`);
  toast.success("Deposit exported successfully!");
  emit("exported", localDeposit.value);
};
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="sm:max-w-3xl bg-gray-900 text-white">
      <DialogHeader>
        <DialogTitle>Deposit Transaction Details</DialogTitle>
      </DialogHeader>

      <div class="grid gap-1 py-2 md:grid-cols-2">

        <div>
          <label class="text-gray-400 text-sm">Invoice ID</label>
          <p class="text-white font-semibold">{{ localDeposit?.inv_id }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">Transaction ID</label>
          <p class="text-white font-semibold">{{ localDeposit?.tid }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">User ID</label>
          <p class="text-white font-semibold">{{ localDeposit?.user_id }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">Payment Method</label>
          <p class="text-white font-semibold">{{ localDeposit?.payment }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">Request Amount</label>
          <p class="text-white font-semibold">{{ localDeposit?.request_amount }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">Actual Amount</label>
          <p class="text-white font-semibold">{{ localDeposit?.actual_amount }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">Account Name</label>
          <p class="text-white font-semibold">{{ localDeposit?.account_name }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">Account Number</label>
          <p class="text-white font-semibold">{{ localDeposit?.account_no }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">Reference Number</label>
          <p class="text-white font-semibold">{{ localDeposit?.ref_no }}</p>
        </div>

        <div>
          <label class="text-gray-400 text-sm">Status</label>
          <p
            class="px-2 py-1 w-fit text-xs rounded-full"
            :class="{
              'bg-emerald-600 text-white': localDeposit?.status === 'approved',
              'bg-yellow-500 text-black': localDeposit?.status === 'pending',
              'bg-red-600 text-white': localDeposit?.status === 'rejected'
            }"
          >
            {{ localDeposit?.status }}
          </p>
        </div>

        <div class="md:col-span-2">
          <label class="text-gray-400 text-sm">Remark</label>
          <p class="text-white font-semibold">{{ localDeposit?.remark }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="text-gray-400 text-sm">Created At</label>
          <p class="text-white font-semibold">{{ localDeposit?.created_at }}</p>
        </div>

      </div>

      <DialogFooter class="flex justify-between">
        <button
          @click="emit('update:open', false)"
          class="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Close
        </button>

        <button
          @click="exportDeposit"
          class="px-4 py-2 bg-amber-500 text-black rounded-lg"
        >
          Export CSV
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>