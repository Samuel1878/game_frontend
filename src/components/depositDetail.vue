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
import { CopyIcon, DownloadIcon } from "lucide-vue-next";
import { formatPrice } from "@/utils";
import moment from "moment";
import { Button } from "./ui/button";

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
const copyTxn = () => {
  if (props.deposit?.inv_id) {
    navigator.clipboard.writeText(props.deposit.inv_id);
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="bg-gray-900 border border-gray-800 text-white max-w-lg rounded-2xl">
      <DialogHeader>
        <DialogTitle>Deposit Transaction Details</DialogTitle>
      </DialogHeader>

      <div class="grid gap-2 py-2 md:grid-cols-2">

        <div class="flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Invoice ID</label>
          <p class="text-white text-sm font-semibold flex gap-2">
            {{ localDeposit?.inv_id }}  
            <CopyIcon class="w-4 h-4 cursor-pointer text-gray-400 hover:text-white" @click="copyTxn" />
        </p>
        </div>

        <div class="flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Txn ID</label>
          <p class="text-white font-semibold">{{ localDeposit?.tid }}</p>
        </div>
        <div class="flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Payment Method</label>
          <p class="text-white font-semibold">{{ localDeposit?.payment }}</p>
        </div>

        <div class="flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Request Amount</label>
          <p class="text-sky-400 font-semibold">{{ formatPrice(localDeposit?.request_amount ?? 0)  }} MMK</p>
        </div>

        <div class="flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Actual Amount</label>
          <p class="text-sky-400 font-semibold">{{formatPrice(localDeposit?.actual_amount ?? 0)  }} MMK</p>
        </div>
        <div class="flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Account Name</label>
          <p class="text-white font-semibold">{{ localDeposit?.account_name }}</p>
        </div>

        <div class="flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Account Number</label>
          <p class="text-white font-semibold">{{ localDeposit?.account_no }}</p>
        </div>
        <div class="flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Status</label>
          <p
            class="px-2 py-1 w-fit text-sm rounded-full capitalize"
            :class="{
              'bg-sky-500 text-white': localDeposit?.status === 'approved',
              'bg-yellow-500 text-black': localDeposit?.status === 'pending',
              'bg-red-600 text-white': localDeposit?.status === 'rejected'
            }"
          >
            {{ localDeposit?.status }}
          </p>
        </div>

        <div class="md:col-span-2 flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Remark</label>
          <p class="text-white font-semibold text-xs">{{ localDeposit?.remark }}</p>
        </div>

        <div class="md:col-span-2 flex justify-between items-center text-sm">
          <label class="text-gray-400 text-sm">Date</label>
          <p class="text-white font-semibold">{{moment(localDeposit?.created_at).format("DD/MM/YYYY hh:mm A") }}</p>
        </div>

      </div>

      <DialogFooter class="flex justify-between">
        <Button
          @click="emit('update:open', false)"
          class="px-4 py-2 rounded-md border border-sky-100"
        >
          Close
        </Button>
 


        <Button
          @click="exportDeposit"
          class="px-4 py-2 bg-sky-500 text-white font-bold rounded-md flex gap-2"
        >
            <DownloadIcon/>
          Export CSV
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>